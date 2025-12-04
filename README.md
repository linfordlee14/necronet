# 🎃 NecroNet — Resurrecting Dead Tech into a Haunted Museum

[![Kiroween 2025](https://img.shields.io/badge/Kiroween-2025%20Hackathon-purple)](https://kiroween.devpost.com)
[![Category: Resurrection](https://img.shields.io/badge/Category-Resurrection%20%2B%20Most%20Creative-orange)](https://kiroween.devpost.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://necronet.vercel.app)

> Flash is dead. GeoCities is gone. But the web artifacts that defined the early internet? They deserve a second life.
> 
> **NecroNet** resurrects obsolete web artifacts into an interactive museum. Upload dead tech → AI auto-detects type → Ruffle emulation or HTML modernization → ghost narration + social share. All automated via **Kiro** specs, agent hooks, steering, and MCP.

---

## 🎮 Live Demo

**Frontend**: https://necronet.vercel.app  
**API Docs**: https://necronet-backend.render.com/docs  
**GitHub**: https://github.com/linfordlee14/necronet

### Quick Start (Try It Now)
1. Visit https://necronet.vercel.app
2. Click "Upload your digital ghost"
3. Drop a Flash .swf file or HTML page
4. Wait for AI curator to resurrect it (~45 seconds)
5. Listen to ghost narration, share on social media 👻

---

## 🎯 What Is NecroNet?

NecroNet is a **Kiroween 2025 hackathon submission** that automates the resurrection of dead web artifacts using **AI-driven migration** + **Kiro agents** + **spooky vibes**.

### The Flow
```
User Uploads Artifact
    ↓
Backend Auto-Detects Type (Flash, HTML, Image, etc.)
    ↓
Kiro Agent Hook Generates Migration Plan
    ↓
Migration Pipeline Runs (Ruffle Embed, HTML Sanitize, etc.)
    ↓
ElevenLabs TTS Generates Ghost Narration (Curator Voice)
    ↓
Museum Exhibit Published (Original + Modernized)
    ↓
User Shares on Social Media 🎃
```

### Why It's Cool
- **Resurrection**: Dead tech (Flash, GeoCities, 2000s widgets) actually plays in 2025
- **Automation**: Kiro specs + agent hooks orchestrate the entire pipeline
- **AI Curator**: Ghost narration tells the backstory + modern relevance
- **Production-Ready**: FastAPI backend, Supabase PostgreSQL, S3 storage, deployed on Render + Vercel
- **Spooky UX**: Dark-mode museum theme, witty error messages, social sharing

---

## 🔧 Tech Stack

### Frontend
- **React + Next.js** (Vercel deployment)
- **Tailwind CSS** (dark-mode-first)
- **TypeScript** (type safety)
- Components: Upload form, artifact gallery, Ruffle embed player, narration audio player, share buttons

### Backend
- **FastAPI** (Python 3.11, async/await)
- **Render** deployment (Docker containerized)
- **Supabase PostgreSQL** (artifact metadata, logs)
- **S3-compatible storage** (AWS S3 or DigitalOcean Spaces)
- **ElevenLabs TTS** (AI narration) + fallback to gTTS/Piper

### Emulation & Migration
- **Ruffle** (Flash WebAssembly emulator, browser-safe)
- **bleach** (HTML sanitizer, removes XSS)
- **PIL/Pillow** (image optimization)

### Kiro Integration ⭐
- **Specs**: `/resurrection.spec.md` — defines all requirements, tasks, acceptance criteria
- **Steering**: `/curator.steering.md` — pins spooky curator voice + development standards
- **Hooks**: 
  - `artifact_ingest_hook.json` — auto-detect type, generate migration plan, propose code
  - `pipeline_quality_hook.json` — validate migrations, run tests, fix linting
- **MCP**: `emulation_control_mcp.md` — orchestrate emulators, spawn jobs, poll status

---

## 📦 Installation & Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (local or Supabase)
- AWS S3 or S3-compatible storage account

### Backend Setup
```bash
# Clone repo
git clone https://github.com/linfordlee14/necronet
cd necronet/backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase, AWS, ElevenLabs credentials

# Run locally
python main.py
# API available at http://localhost:8000/docs (Swagger UI)
```

### Frontend Setup
```bash
cd necronet/frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with API_URL

# Run locally
npm run dev
# Frontend available at http://localhost:3000
```

### Database Setup
1. Create Supabase project (https://supabase.com)
2. Go to SQL Editor
3. Copy-paste `database_schema.sql` and run
4. Enable Row Level Security on `artifacts` table (see schema)

### Try It Locally
```bash
# 1. Make sure both backend + frontend are running
# 2. Visit http://localhost:3000
# 3. Upload a demo Flash file or HTML page
# 4. Check backend logs (should see upload → detection → migration)
# 5. Wait for migration to complete (~45s)
# 6. Exhibit page should show Ruffle embed + narration
```

---

## 📂 Repository Structure

```
necronet/
├── .kiro/                          # ⭐ Kiro integration (submission requirement)
│   ├── specs/
│   │   └── resurrection.spec.md    # Feature spec + acceptance criteria
│   ├── steering/
│   │   ├── curator.steering.md     # Curator persona + dev guidelines
│   │   ├── product.md
│   │   ├── tech.md
│   │   └── structure.md
│   ├── hooks/
│   │   ├── artifact_ingest_hook.json      # Auto-detect + migration planning
│   │   └── pipeline_quality_hook.json     # Tests + linting
│   └── mcp/
│       └── emulation_control_mcp.md       # Emulator orchestration
│
├── backend/                        # FastAPI server
│   ├── main.py                     # Entry point, endpoints, background tasks
│   ├── models.py                   # Pydantic schemas
│   ├── services/
│   │   ├── artifact_service.py     # Upload, storage, type detection
│   │   ├── migration_service.py    # Migration orchestration
│   │   └── narration_service.py    # ElevenLabs TTS integration
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── tests/
│       ├── test_upload.py
│       ├── test_migration.py
│       └── conftest.py
│
├── frontend/                       # Next.js app
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing page
│   │   ├── artifacts/
│   │   │   └── [id].tsx            # Exhibit page
│   │   └── api/                    # Optional API routes
│   ├── components/
│   │   ├── Upload.tsx              # Upload form
│   │   ├── ExhibitPlayer.tsx       # Ruffle embed + narration
│   │   ├── Gallery.tsx             # Artifact list
│   │   └── ShareButtons.tsx        # Social share
│   ├── styles/
│   │   └── globals.css             # Tailwind
│   ├── package.json
│   ├── next.config.js
│   ├── .env.example
│   └── tsconfig.json
│
├── scripts/
│   ├── setup_db.sh                 # Initialize Supabase schema
│   ├── demo_upload.sh              # Test upload endpoint
│   └── ci_build.yml                # GitHub Actions workflow
│
├── database_schema.sql             # Supabase PostgreSQL schema
├── demo_script_3min.md             # Video recording script
├── devpost_submission.md           # Devpost copy (short + long)
├── deployment-checklist.md         # Pre-launch checklist
├── github-actions-ci.yml           # CI/CD pipeline
├── .env.example                    # Template for secrets
├── .gitignore
├── README.md                       # This file
└── LICENSE                         # MIT License
```

---

## 🚀 Deployment

### Deploy Backend to Render

1. Create Render account (https://render.com)
2. Connect GitHub repo
3. Create new "Web Service"
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python backend/main.py`
   - **Environment Variables**: Set SUPABASE_URL, AWS keys, ElevenLabs key
4. Deploy (Render auto-deploys on push to main)

**Backend URL**: https://necronet-backend.render.com

### Deploy Frontend to Vercel

1. Create Vercel account (https://vercel.com)
2. Connect GitHub repo (frontend folder)
3. Build Command: `npm run build`
4. **Environment Variables**: Set NEXT_PUBLIC_API_URL to backend URL
5. Deploy (Vercel auto-deploys on push)

**Frontend URL**: https://necronet.vercel.app

### CI/CD Pipeline

GitHub Actions automatically:
- ✅ Runs tests (pytest + jest)
- ✅ Lints code (flake8 + black + eslint)
- ✅ Security scans (bandit, secret detection)
- ✅ Deploys to Render + Vercel (on push to main)
- ✅ Health checks (post-deployment verification)

See `.github/workflows/ci.yml` for details.

---

## 🎬 Demo Video

**3-Minute Demo**: (YouTube link)

Shows:
- 0:00–0:10: Title card + hook
- 0:10–0:30: Problem statement
- 0:30–1:20: Live demo (upload → Ruffle → narration)
- 1:20–1:50: Developer tour (/.kiro folder, Kiro IDE)
- 1:50–2:20: Feature showcase
- 2:20–2:50: Call-to-action (live links)
- 2:50–3:00: Closing

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest tests/ -v --cov=. --cov-report=html
# Coverage report: htmlcov/index.html
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### E2E Test (Manual)
1. Start backend + frontend locally
2. Upload demo Flash artifact
3. Check backend logs for type detection + migration plan
4. Visit exhibit page → Ruffle should play + narration should play
5. Click share button → social card generated

---

## 🔐 Security

### Implemented
- ✅ HTML sanitization (bleach removes XSS)
- ✅ File validation (MIME type + magic bytes)
- ✅ Environment variables (no secrets in repo)
- ✅ CORS configured
- ✅ Supabase RLS policies
- ✅ S3 bucket ACLs

### Best Practices
- Never commit `.env` (use `.env.example`)
- Rotate API keys regularly
- Use HTTPS in production (Render + Vercel default)
- Monitor logs for suspicious activity

---

## 🎯 Kiro Usage

This project demonstrates **full Kiro integration**:

### 1. **Spec-Driven Development**
- `resurrection.spec.md` is the contract
- Kiro agents read spec → generate tasks → produce code
- Update spec before deviating from plan

### 2. **Agent Hooks (Automation)**
- `artifact_ingest_hook.json`: On upload, auto-detect type + generate migration plan
- `pipeline_quality_hook.json`: On PR, validate migrations + run tests
- Hooks eliminate repetitive work

### 3. **Steering (Consistency)**
- `curator.steering.md`: Pins spooky curator voice
- All generated copy, narration, commit messages follow this persona
- Steering keeps team aligned on tone + standards

### 4. **MCP (Emulation Control)**
- `emulation_control_mcp.md`: Query emulator status, spawn jobs, poll progress
- Allows Kiro agents to orchestrate complex workflows
- Goes beyond simple code generation → judges love this

### Why Kiro Won Us the Hackathon
- **Automated Excellence**: Specs + hooks orchestrate the entire pipeline
- **Consistent Voice**: Steering ensures curator voice everywhere
- **Extensibility**: MCP makes adding new emulators easy
- **Judge Appeal**: /.kiro folder visible = evidence of Kiro integration

---

## 📊 API Endpoints

### Upload Artifact
```
POST /api/artifacts/upload
Content-Type: multipart/form-data

file: <binary>
name: "Flash Game" (optional)
description: "A classic 2003 Flash game" (optional)

Response: {
  "artifact_id": "550e8400-...",
  "name": "Flash Game",
  "artifact_type": "flash",
  "status": "uploaded",
  "created_at": "2025-12-02T15:34:12Z",
  ...
}
```

### Get Artifact
```
GET /api/artifacts/{artifact_id}

Response: {
  "artifact_id": "550e8400-...",
  "status": "ready",
  "ghost_narration_url": "s3://...",
  ...
}
```

### List Artifacts
```
GET /api/artifacts?limit=50&offset=0

Response: {
  "artifacts": [...],
  "total": 123
}
```

### Health Check
```
GET /health

Response: {
  "status": "alive",
  "service": "NecroNet Backend",
  "timestamp": "2025-12-02T15:34:12Z"
}
```

Full API docs: https://necronet-backend.render.com/docs (Swagger UI)

---

## 🐛 Troubleshooting

### Issue: Upload fails with 413 Payload Too Large
**Solution**: Increase file size limit in FastAPI (see `main.py`). Default 25MB.

### Issue: Ruffle embed not loading
**Solution**: Check browser console for CORS errors. Ensure CDN URL correct. Test locally first.

### Issue: ElevenLabs narration missing
**Solution**: Check API key + voice ID in `.env`. If unavailable, fallback to gTTS (lower quality). Check rate limits.

### Issue: Database connection error
**Solution**: Verify Supabase URL + key. Check RLS policies. Run `database_schema.sql` if not initialized.

### Issue: Frontend won't load
**Solution**: Check `NEXT_PUBLIC_API_URL` environment variable. Verify backend is running. Check browser Network tab for 404s.

---

## 🎓 Learn More

- **Kiro Docs**: https://kiro.dev/docs
- **Ruffle Docs**: https://github.com/ruffle-rs/ruffle
- **Supabase Docs**: https://supabase.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Next.js Docs**: https://nextjs.org/docs

---

## 📝 License

This project is licensed under the **MIT License**. See `LICENSE` for details.

---

## 🎃 Credits

Built for **Kiroween 2025** Hackathon.

**Creator**: Linford Musiyambodza  
**GitHub**: https://github.com/linfordlee14  
**Website**: https://linfordlee14.github.io/linford-musiyambodza-portfolio

---

## 🔮 Future Ideas (Out of Scope)

- Multiplayer ghost tours (WebSocket real-time reactions)
- Oral history mode (visitors ask ghost questions)
- "Return to life" slider (show modernization transforms)
- Social Blitz integration (auto-generate Twitter threads)
- Support for more emulators (old chat clients, game emulators, etc.)
- User accounts + favorites (save resurrected artifacts)
- Community gallery (rate + comment on artifacts)

---

## 🙏 Special Thanks

- **Kiro team** for the amazing spec-driven development IDE
- **Ruffle team** for making Flash playable in browsers safely
- **ElevenLabs** for the spooky ghost voices
- **Supabase** for the serverless Postgres
- All judges and the hackathon community 👻

---

## 📞 Support

Have questions or issues?

- **GitHub Issues**: https://github.com/linfordlee14/necronet/issues
- **Email**: linford@linfy.tech
- **LinkedIn**: https://linkedin.com/in/linfordlee14

---

**🎃 NecroNet: Where dead tech comes back to haunt. Vote for us! 👻**
