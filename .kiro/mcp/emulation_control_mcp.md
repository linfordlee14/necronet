# NecroNet MCP Extension — Emulation Control

## Overview
This MCP (Modular Capability Provider) extension allows Kiro agents to orchestrate artifact migrations by providing capabilities to:
1. Query emulator availability (Ruffle version, browser support, etc.)
2. Spawn and monitor migration jobs
3. Retrieve migration logs and screenshots
4. Generate museum exhibit pages

Judges love MCP because it demonstrates deep Kiro integration beyond simple code generation.

---

## Capabilities

### 1. `query_emulator_status`
**Purpose**: Check if an emulator is available and ready.

**Input**:
```json
{
  "emulator_type": "ruffle" | "html_sanitizer" | "image_optimizer" | "game_emulator",
  "version_constraint": ">=2.0.0" (optional)
}
```

**Output**:
```json
{
  "available": true,
  "version": "2.1.5",
  "last_updated": "2025-11-30T10:00:00Z",
  "supported_formats": [".swf", ".swc"],
  "browser_compatibility": ["Chrome 90+", "Firefox 88+", "Safari 14+", "Mobile browsers"]
}
```

**Use Case**: Before generating Ruffle embed code, verify Ruffle is available and modern.

---

### 2. `spawn_migration_job`
**Purpose**: Start an async migration job for an artifact.

**Input**:
```json
{
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "artifact_type": "flash" | "html" | "image",
  "storage_url": "s3://necronet-artifacts/artifacts/flash/550e8400/.../demo.swf",
  "migration_strategy": "ruffle_embed",
  "options": {
    "generate_narration": true,
    "narration_voice": "aria",
    "publish_museum": true
  }
}
```

**Output**:
```json
{
  "job_id": "job-xyz-123",
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued" | "running" | "completed" | "failed",
  "progress_percent": 0,
  "estimated_duration_seconds": 45,
  "message": "🎃 Migration queued. Your ghost curator is preparing the exhibit..."
}
```

**Use Case**: Kiro agent calls this after detecting an artifact type. Returns a job ID for polling.

---

### 3. `poll_migration_status`
**Purpose**: Get status + progress of an ongoing migration job.

**Input**:
```json
{
  "job_id": "job-xyz-123"
}
```

**Output**:
```json
{
  "job_id": "job-xyz-123",
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "running",
  "progress_percent": 65,
  "current_step": "4. Generating ghost narration",
  "elapsed_seconds": 28,
  "estimated_remaining_seconds": 17,
  "log_lines": [
    "✅ Step 1: Artifact validated",
    "✅ Step 2: Ruffle embed generated",
    "✅ Step 3: Museum exhibit page created",
    "🔄 Step 4: Calling ElevenLabs TTS..."
  ]
}
```

**Use Case**: Kiro agent polls this to show progress to user or determine when to proceed.

---

### 4. `get_migration_result`
**Purpose**: Retrieve final results of a completed migration job.

**Input**:
```json
{
  "job_id": "job-xyz-123"
}
```

**Output**:
```json
{
  "job_id": "job-xyz-123",
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "artifact_name": "Flash Mini-Game",
  "artifact_type": "flash",
  "museum_exhibit_url": "https://necronet.vercel.app/artifacts/550e8400-e29b-41d4-a716-446655440000",
  "original_artifact_url": "s3://necronet-artifacts/artifacts/flash/550e8400/.../demo.swf",
  "ruffle_embed_code": "<div id=\"ruffle\">...</div><script src=\"...ruffle.js\"></script><script>...",
  "narration_audio_url": "s3://necronet-artifacts/narrations/550e8400-e29b-41d4-a716-446655440000_ghost.mp3",
  "narration_transcript": "This Flash game was released in 2003... [full transcript]",
  "social_share_card": {
    "title": "Flash Mini-Game Resurrected",
    "description": "🎃 NecroNet: A haunted museum of obsolete web tech",
    "image_url": "s3://necronet-artifacts/thumbnails/550e8400-preview.png",
    "url": "https://necronet.vercel.app/artifacts/550e8400-e29b-41d4-a716-446655440000"
  },
  "completion_time_seconds": 47,
  "message": "🎃 Artifact resurrected! Your ghost curator awaits visitors..."
}
```

**Use Case**: Kiro agent retrieves this after migration completes, then auto-generates a commit with the results.

---

### 5. `retrieve_migration_logs`
**Purpose**: Get detailed logs for troubleshooting failed migrations.

**Input**:
```json
{
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "limit": 50,
  "filter_event": "error" | "warning" | "info" | null
}
```

**Output**:
```json
{
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "logs": [
    {
      "timestamp": "2025-12-02T15:34:12Z",
      "event": "upload",
      "level": "info",
      "message": "Artifact received: demo.swf (102KB)"
    },
    {
      "timestamp": "2025-12-02T15:34:15Z",
      "event": "migrate_start",
      "level": "info",
      "message": "Migration strategy: ruffle_embed"
    },
    {
      "timestamp": "2025-12-02T15:35:02Z",
      "event": "narration_complete",
      "level": "info",
      "message": "Ghost narration generated (90s audio)"
    }
  ]
}
```

**Use Case**: Debugging; Kiro agent uses this to understand why a migration failed.

---

### 6. `generate_exhibit_page`
**Purpose**: Create a museum exhibit page (HTML/React) for an artifact.

**Input**:
```json
{
  "artifact_id": "550e8400-e29b-41d4-a716-446655440000",
  "artifact_name": "Newgrounds Flash Game",
  "artifact_type": "flash",
  "original_url": "s3://...",
  "modernized_url": "...",
  "narration_audio_url": "...",
  "narration_transcript": "...",
  "theme": "dark" | "light"
}
```

**Output**:
```json
{
  "exhibit_page_html": "<div class=\"exhibit\">... full HTML component ...",
  "exhibit_page_react": "export default function Exhibit() { ... }",
  "preview_url": "https://necronet.vercel.app/artifacts/550e8400-preview",
  "message": "🎃 Exhibit page generated. Ready for museum gallery!"
}
```

**Use Case**: Kiro agent generates the complete exhibit page code, ready to commit or deploy.

---

## Integration Example (Pseudocode)

```python
# Kiro agent hook: artifact_ingest_and_migrate
def handle_artifact_upload(artifact_data):
    # Step 1: Query emulator status
    ruffle_status = mcp.query_emulator_status(
        emulator_type="ruffle",
        version_constraint=">=2.0.0"
    )
    assert ruffle_status["available"], "Ruffle not available!"
    
    # Step 2: Spawn migration job
    job_result = mcp.spawn_migration_job(
        artifact_id=artifact_data.id,
        artifact_type="flash",
        storage_url=artifact_data.s3_url,
        migration_strategy="ruffle_embed"
    )
    job_id = job_result["job_id"]
    
    # Step 3: Poll until complete
    while True:
        status = mcp.poll_migration_status(job_id)
        if status["status"] in ["completed", "failed"]:
            break
        time.sleep(2)  # Poll every 2 seconds
    
    # Step 4: Retrieve results
    if status["status"] == "completed":
        result = mcp.get_migration_result(job_id)
        
        # Step 5: Generate exhibit page
        exhibit = mcp.generate_exhibit_page(
            artifact_id=result["artifact_id"],
            artifact_name=result["artifact_name"],
            original_url=result["original_artifact_url"],
            narration_audio_url=result["narration_audio_url"],
            narration_transcript=result["narration_transcript"]
        )
        
        # Step 6: Commit results
        commit_msg = f"🎃 feat(migration): Resurrect {result['artifact_name']}"
        git.commit(exhibit["exhibit_page_react"], commit_msg)
    else:
        logs = mcp.retrieve_migration_logs(result["artifact_id"])
        log_error(f"Migration failed: {logs}")
```

---

## Implementation Notes

- **MCP runs in background**: All migration jobs are async; API returns immediately with a job_id.
- **Polling interval**: Kiro agents should poll every 2–5 seconds for status updates.
- **Fallback TTS**: If ElevenLabs unavailable, fallback to gTTS (narration quality lower but functional).
- **Museum exhibit auto-publish**: If `publish_museum=true` in job options, exhibit page deployed automatically to Vercel.
- **Social cards**: Auto-generate Twitter/X, LinkedIn, email share cards for each artifact.

---

## Judges Will Love This Because:
1. **Shows Kiro depth**: MCP demonstrates custom capability integration, not just code generation.
2. **Realistic workflow**: Migration pipeline is orchestrated via MCP calls, not hardcoded.
3. **Extensible**: Easy to add more emulators (game emulators, classic chat clients, etc.) without touching core logic.
4. **Automated excellence**: Judges see agent-driven code generation → MCP calls → deployed exhibit pages.
