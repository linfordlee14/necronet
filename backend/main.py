"""
NecroNet Backend — Artifact Ingestion + Migration Orchestration
FastAPI + Supabase + ElevenLabs TTS + S3-compatible storage
Ready to deploy on Render with PostgreSQL
"""

import os
import uuid
import asyncio
import httpx
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============================================================================
# CONFIGURATION
# ============================================================================

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "").strip()
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "").strip()
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET", "necronet-artifacts-linford").strip()
AWS_S3_REGION = os.getenv("AWS_S3_REGION", "eu-north-1").strip()
AWS_S3_ENDPOINT = os.getenv("AWS_S3_ENDPOINT", "").strip()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "").strip()
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "").strip()
USE_MOCK_MODE = os.getenv("USE_MOCK_MODE", "false").lower() == "true"

# Log configuration status
logger.info("=" * 60)
logger.info("🎃 NecroNet Backend Configuration")
logger.info("=" * 60)
logger.info(f"SUPABASE_URL: {'✅ Set' if SUPABASE_URL else '❌ Not set'}")
logger.info(f"SUPABASE_KEY: {'✅ Set' if SUPABASE_KEY else '❌ Not set'}")
logger.info(f"AWS_ACCESS_KEY_ID: {'✅ Set' if AWS_ACCESS_KEY_ID else '❌ Not set'}")
logger.info(f"AWS_S3_BUCKET: {AWS_S3_BUCKET}")
logger.info(f"AWS_S3_REGION: {AWS_S3_REGION}")
logger.info(f"ELEVENLABS_API_KEY: {'✅ Set (' + ELEVENLABS_API_KEY[:8] + '...)' if ELEVENLABS_API_KEY else '❌ Not set'}")
logger.info(f"ELEVENLABS_VOICE_ID: {'✅ Set (' + ELEVENLABS_VOICE_ID + ')' if ELEVENLABS_VOICE_ID else '❌ Not set'}")
logger.info(f"USE_MOCK_MODE: {USE_MOCK_MODE}")
logger.info("=" * 60)

# Initialize clients
supabase = None
s3_client = None

# Initialize Supabase client (fixed for supabase-py 2.x)
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client
        # supabase-py 2.x uses only url and key, no proxy argument
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("✅ Supabase client initialized successfully")
    except TypeError as e:
        # Handle version mismatch - try alternative initialization
        logger.warning(f"⚠️ Supabase init TypeError: {e}")
        try:
            from supabase._sync.client import SyncClient
            supabase = SyncClient(SUPABASE_URL, SUPABASE_KEY)
            logger.info("✅ Supabase client initialized (alternative method)")
        except Exception as e2:
            logger.error(f"❌ Supabase initialization failed: {e2}")
            supabase = None
    except Exception as e:
        logger.error(f"❌ Supabase not configured: {e}")
        supabase = None
else:
    logger.warning("⚠️ Supabase credentials not provided - using mock storage")

# Initialize S3 client
if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
    try:
        import boto3
        s3_config = {
            "aws_access_key_id": AWS_ACCESS_KEY_ID,
            "aws_secret_access_key": AWS_SECRET_ACCESS_KEY,
            "region_name": AWS_S3_REGION,
        }
        if AWS_S3_ENDPOINT:
            s3_config["endpoint_url"] = AWS_S3_ENDPOINT
        
        s3_client = boto3.client("s3", **s3_config)
        logger.info(f"✅ S3 client initialized (bucket: {AWS_S3_BUCKET}, region: {AWS_S3_REGION})")
    except Exception as e:
        logger.error(f"❌ S3 not configured: {e}")
        s3_client = None
else:
    logger.warning("⚠️ AWS credentials not provided - S3 uploads will fail")

# In-memory storage for mock mode
mock_artifacts: dict[str, dict] = {}

# FastAPI app
app = FastAPI(
    title="NecroNet",
    version="1.0.0",
    description="🎃 Resurrecting Dead Tech — Artifact Ingestion API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://necronet.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ArtifactBase(BaseModel):
    name: str
    artifact_type: str
    original_url: Optional[str] = None
    description: Optional[str] = None

class ArtifactCreate(ArtifactBase):
    pass

class ArtifactResponse(BaseModel):
    artifact_id: str
    name: str
    artifact_type: str
    storage_key: str
    created_at: str
    status: str
    ghost_narration_url: Optional[str] = None
    error_message: Optional[str] = None
    original_url: Optional[str] = None
    description: Optional[str] = None

class MigrationPlan(BaseModel):
    artifact_id: str
    artifact_type: str
    strategy: str
    steps: list[str]
    estimated_duration_seconds: int

class HealthStatus(BaseModel):
    status: str
    supabase: str
    s3: str
    tts: str
    timestamp: str

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def detect_artifact_type(filename: str, content_type: str) -> str:
    """Detect artifact type from filename and MIME type."""
    ext = Path(filename).suffix.lower()
    if ext in [".swf"] or "flash" in content_type.lower():
        return "flash"
    elif ext in [".html", ".htm"] or "html" in content_type.lower():
        return "html"
    elif ext in [".png", ".jpg", ".jpeg", ".gif", ".webp"] or "image" in content_type.lower():
        return "image"
    elif ext in [".zip", ".tar", ".gz"]:
        return "archive"
    return "other"


def get_s3_public_url(bucket: str, key: str) -> str:
    """Generate public S3 URL for an object.
    
    Hardcoded for demo: necronet-artifacts-linford in eu-north-1
    """
    # Hardcode for demo to ensure correct URL
    demo_bucket = "necronet-artifacts-linford"
    demo_region = "eu-north-1"
    
    if AWS_S3_ENDPOINT:
        return f"{AWS_S3_ENDPOINT}/{bucket}/{key}"
    
    # Use hardcoded values for demo
    return f"https://{demo_bucket}.s3.{demo_region}.amazonaws.com/{key}"


def upload_to_s3(file_bytes: bytes, bucket: str, key: str, content_type: str = "application/octet-stream") -> str:
    """Upload file to S3 and return public URL.
    
    Note: No ACL is set - bucket policy controls public access.
    """
    if not s3_client:
        logger.error("❌ S3 client not initialized - cannot upload")
        raise Exception("S3 not configured")
    
    try:
        s3_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
        )
        url = get_s3_public_url(bucket, key)
        logger.info(f"✅ Uploaded to S3: {url}")
        return url
    except Exception as e:
        logger.error(f"❌ S3 upload failed: {e}")
        raise


def generate_migration_plan(artifact_type: str, artifact_id: str = "") -> MigrationPlan:
    """Generate a migration strategy based on artifact type."""
    if not artifact_id:
        artifact_id = str(uuid.uuid4())
    
    plans = {
        "flash": MigrationPlan(
            artifact_id=artifact_id, artifact_type="flash", strategy="ruffle_embed",
            steps=["1. Validate .swf", "2. Generate Ruffle embed", "3. Create exhibit", "4. Test playback", "5. Generate narration"],
            estimated_duration_seconds=45,
        ),
        "html": MigrationPlan(
            artifact_id=artifact_id, artifact_type="html", strategy="html_sanitize",
            steps=["1. Sanitize HTML", "2. Apply CSS fallback", "3. Refactor styles", "4. Add a11y", "5. Generate narration"],
            estimated_duration_seconds=30,
        ),
        "image": MigrationPlan(
            artifact_id=artifact_id, artifact_type="image", strategy="image_optimize",
            steps=["1. Optimize image", "2. Generate thumbnail", "3. Extract metadata", "4. Create entry", "5. Generate narration"],
            estimated_duration_seconds=20,
        ),
    }
    return plans.get(artifact_type, MigrationPlan(
        artifact_id=artifact_id, artifact_type=artifact_type, strategy="generic",
        steps=["1. Analyze", "2. Store", "3. Narrate"], estimated_duration_seconds=15,
    ))


# ============================================================================
# DATABASE FUNCTIONS
# ============================================================================

async def store_artifact(artifact_data: dict) -> dict:
    """Store artifact in Supabase or mock storage."""
    if supabase and not USE_MOCK_MODE:
        try:
            result = supabase.table("artifacts").insert(artifact_data).execute()
            logger.info(f"✅ Artifact stored in Supabase: {artifact_data['artifact_id']}")
            return result.data[0] if result.data else artifact_data
        except Exception as e:
            logger.error(f"❌ Supabase insert failed: {e}")
    
    mock_artifacts[artifact_data["artifact_id"]] = artifact_data
    logger.info(f"✅ Artifact stored in mock DB: {artifact_data['artifact_id']}")
    return artifact_data


async def get_artifact_from_db(artifact_id: str) -> Optional[dict]:
    """Get artifact from Supabase or mock storage."""
    if supabase and not USE_MOCK_MODE:
        try:
            result = supabase.table("artifacts").select("*").eq("artifact_id", artifact_id).execute()
            if result.data:
                return result.data[0]
        except Exception as e:
            logger.error(f"❌ Supabase fetch failed: {e}")
    return mock_artifacts.get(artifact_id)


async def update_artifact_in_db(artifact_id: str, updates: dict) -> None:
    """Update artifact in Supabase or mock storage."""
    if supabase and not USE_MOCK_MODE:
        try:
            supabase.table("artifacts").update(updates).eq("artifact_id", artifact_id).execute()
            logger.info(f"✅ Artifact updated in Supabase: {artifact_id}")
            return
        except Exception as e:
            logger.error(f"❌ Supabase update failed: {e}")
    
    if artifact_id in mock_artifacts:
        mock_artifacts[artifact_id].update(updates)
        logger.info(f"✅ Artifact updated in mock DB: {artifact_id}")


async def list_artifacts_from_db(limit: int = 50, offset: int = 0) -> list[dict]:
    """List artifacts from Supabase or mock storage."""
    if supabase and not USE_MOCK_MODE:
        try:
            result = supabase.table("artifacts").select("*").order("created_at", desc=True).range(offset, offset + limit - 1).execute()
            return result.data or []
        except Exception as e:
            logger.error(f"❌ Supabase list failed: {e}")
    
    artifacts = list(mock_artifacts.values())
    artifacts.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return artifacts[offset:offset + limit]


# ============================================================================
# TTS FUNCTIONS
# ============================================================================

async def generate_ghost_narration(artifact_id: str, artifact_name: str, artifact_type: str) -> Optional[str]:
    """Generate ghost narration using ElevenLabs TTS API.
    
    Uses eleven_turbo_v2_5 model for low latency and high quality.
    Uploads generated audio to S3 and returns public URL.
    """
    logger.info(f"🎤 Generating TTS for {artifact_id}...")
    
    # Check configuration
    if not ELEVENLABS_API_KEY:
        logger.warning(f"⚠️ TTS skipped for {artifact_id}: ELEVENLABS_API_KEY not set")
        return None
    
    if not ELEVENLABS_VOICE_ID:
        logger.warning(f"⚠️ TTS skipped for {artifact_id}: ELEVENLABS_VOICE_ID not set")
        return None
    
    if not s3_client:
        logger.warning(f"⚠️ TTS skipped for {artifact_id}: S3 not configured (cannot store audio)")
        return None

    # Create spooky narrator script
    narrator_script = f"""Welcome, visitor, to the NecroNet Museum. 
Before you stands {artifact_name}, a {artifact_type} artifact from the digital past.
This relic has been resurrected from the depths of obsolete technology.
Listen closely as I tell you its tale."""

    try:
        logger.info(f"🔊 Calling ElevenLabs API for artifact {artifact_id}...")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}",
                headers={
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "text": narrator_script,
                    "model_id": "eleven_turbo_v2_5",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.75,
                    },
                },
            )
            
            logger.info(f"📡 ElevenLabs response status: {response.status_code}")
            
            if response.status_code == 200:
                audio_bytes = response.content
                logger.info(f"✅ Received {len(audio_bytes)} bytes of audio")
                
                # Upload to S3
                audio_key = f"narrations/{artifact_id}_ghost.mp3"
                audio_url = upload_to_s3(audio_bytes, AWS_S3_BUCKET, audio_key, "audio/mpeg")
                logger.info(f"🎃 Ghost narration uploaded: {audio_url}")
                return audio_url
            else:
                error_text = response.text[:500] if response.text else "No error details"
                logger.error(f"❌ ElevenLabs API error {response.status_code}: {error_text}")
                return None
                
    except httpx.TimeoutException:
        logger.error(f"❌ ElevenLabs API timeout for {artifact_id}")
        return None
    except Exception as e:
        logger.error(f"❌ TTS generation failed for {artifact_id}: {type(e).__name__}: {e}")
        return None


async def test_elevenlabs_connection() -> dict:
    """Test ElevenLabs API connection."""
    if not ELEVENLABS_API_KEY:
        return {"status": "not_configured", "error": "ELEVENLABS_API_KEY not set"}
    
    if not ELEVENLABS_VOICE_ID:
        return {"status": "not_configured", "error": "ELEVENLABS_VOICE_ID not set"}
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Test by fetching voice info
            response = await client.get(
                f"https://api.elevenlabs.io/v1/voices/{ELEVENLABS_VOICE_ID}",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
            )
            
            if response.status_code == 200:
                voice_data = response.json()
                return {
                    "status": "connected",
                    "voice_name": voice_data.get("name", "Unknown"),
                    "voice_id": ELEVENLABS_VOICE_ID,
                }
            else:
                return {"status": "error", "error": f"HTTP {response.status_code}: {response.text[:200]}"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint."""
    return {"service": "🎃 NecroNet Backend", "version": "1.0.0", "docs": "/docs", "health": "/health"}


@app.get("/health")
async def health_check():
    """Basic health check."""
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
        "supabase": "connected" if supabase else "not_configured",
        "s3": "connected" if s3_client else "not_configured",
        "tts": "configured" if (ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID) else "not_configured",
    }


@app.get("/health/tts", response_model=HealthStatus)
async def health_check_tts():
    """Detailed health check including TTS test."""
    tts_status = await test_elevenlabs_connection()
    
    return HealthStatus(
        status="alive",
        supabase="connected" if supabase else "not_configured",
        s3="connected" if s3_client else "not_configured",
        tts=tts_status.get("status", "unknown") + (f" ({tts_status.get('voice_name', '')})" if tts_status.get("voice_name") else ""),
        timestamp=datetime.utcnow().isoformat(),
    )


@app.post("/api/artifacts/upload", response_model=ArtifactResponse)
async def upload_artifact(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    """Upload an artifact for resurrection."""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="👻 No filename provided")

        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="👻 File is empty")

        artifact_id = str(uuid.uuid4())
        artifact_type = detect_artifact_type(file.filename, file.content_type or "")
        s3_key = f"artifacts/{artifact_type}/{artifact_id}/{file.filename}"
        created_at = datetime.utcnow().isoformat()

        # Upload to S3
        try:
            upload_to_s3(file_bytes, AWS_S3_BUCKET, s3_key, file.content_type or "application/octet-stream")
        except Exception as e:
            logger.error(f"❌ S3 upload failed: {e}")
            raise HTTPException(status_code=500, detail=f"😢 Storage upload failed: {e}")

        artifact_data = {
            "artifact_id": artifact_id,
            "name": file.filename,
            "artifact_type": artifact_type,
            "storage_key": s3_key,
            "status": "uploaded",
            "created_at": created_at,
            "ghost_narration_url": None,
            "error_message": None,
        }

        await store_artifact(artifact_data)

        if background_tasks:
            background_tasks.add_task(orchestrate_migration, artifact_id, file.filename, artifact_type)

        logger.info(f"🎃 Artifact uploaded: {artifact_id} ({artifact_type})")
        return ArtifactResponse(**artifact_data)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"😢 Upload failed: {e}")


@app.post("/api/artifacts/migrate", response_model=MigrationPlan)
async def get_migration_plan(body: ArtifactCreate):
    """Get migration plan for an artifact type."""
    return generate_migration_plan(body.artifact_type)


@app.get("/api/artifacts/{artifact_id}", response_model=ArtifactResponse)
async def get_artifact(artifact_id: str):
    """Get artifact by ID."""
    artifact = await get_artifact_from_db(artifact_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="👻 Artifact not found")
    return ArtifactResponse(**artifact)


@app.get("/api/artifacts")
async def list_artifacts(limit: int = 50, offset: int = 0):
    """List all artifacts."""
    artifacts = await list_artifacts_from_db(limit, offset)
    return {"artifacts": artifacts, "total": len(artifacts)}


# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def orchestrate_migration(artifact_id: str, artifact_name: str, artifact_type: str):
    """Run migration pipeline in background."""
    try:
        logger.info(f"🔄 Starting migration for {artifact_id}...")
        await update_artifact_in_db(artifact_id, {"status": "migrating"})
        
        # Simulate processing
        await asyncio.sleep(3)
        
        # Generate narration
        ghost_url = await generate_ghost_narration(artifact_id, artifact_name, artifact_type)
        
        await update_artifact_in_db(artifact_id, {"status": "ready", "ghost_narration_url": ghost_url})
        logger.info(f"✅ Migration complete: {artifact_id} (narration: {'✅' if ghost_url else '❌'})")

    except Exception as e:
        logger.error(f"❌ Migration failed for {artifact_id}: {e}")
        await update_artifact_in_db(artifact_id, {"status": "failed", "error_message": str(e)})


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"🚀 Starting NecroNet Backend on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
