# NecroNet — Devpost Submission Copy

## Short Description (280 characters max for project card)
🎃 NecroNet resurrects obsolete web artifacts (Flash, GeoCities, 2000s widgets) into an interactive museum. Upload dead tech → AI auto-detects type → Ruffle emulation or HTML modernization → ghost narration + social share. Built with Kiro specs, hooks, steering, MCP.

---

## Long Description (Project Page)

### Inspiration
Flash is dead. GeoCities is gone. But the web artifacts that defined the early internet—those playable games, quirky websites, multimedia experiments—deserve to be remembered, not forgotten.

We built NecroNet to prove that dead tech can live again. And we used **Kiro** to automate the entire resurrection process: from artifact detection to museum publication.

### What It Does
**NecroNet** is an AI-powered museum of resurrected web artifacts. Here's the flow:

1. **User uploads** an obsolete artifact (Flash .swf, HTML page, image, archive)
2. **Backend auto-detects type** (Flash, HTML, image, etc.) using MIME type + file headers
3. **Migration pipeline kicks off** (async, background task):
   - Flash → Ruffle (WebAssembly emulator) + museum exhibit page
   - HTML → sanitized + modern CSS fallback + accessibility
   - Images → optimized (WebP) + metadata extracted
4. **Ghost narration generated** (ElevenLabs TTS):
   - AI curator generates 90-second audio: 1-2 line backstory + 3 feature bullets + museum note
   - Spooky, witty, preservationist tone
5. **Museum exhibit published**:
   - Original vs. modernized side-by-side comparison
   - Live playback (Ruffle for Flash, iframe for HTML)
   - Ghost narration player + transcript
   - Social share buttons (Twitter/X, LinkedIn, email)

All **automated via Kiro agent hooks, steering, and MCP integration**.

### How It Works (Technical)

#### Frontend Stack
- **React + Next.js** (deployed on Vercel)
- **Tailwind CSS** (dark-mode-first, spooky theme)
- Upload form, artifact gallery, exhibit player, share buttons

#### Backend Stack
- **FastAPI** (Python, deployed on Render)
- **Supabase PostgreSQL** (artifact metadata, logs)
- **S3-compatible storage** (AWS S3 or DigitalOcean Spaces)
- **ElevenLabs TTS** (ghost narration) + fallback to gTTS

#### Emulation & Migration
- **Ruffle** (Flash WebAssembly emulator, browser-safe)
- **bleach** (HTML sanitizer, removes XSS vectors)
- **PIL/Pillow** (image optimization)

#### Kiro Integration (The Secret Sauce)
1. **Specs**: `/resurrection.spec.md` defines all requirements, acceptance criteria, implementation tasks
2. **Steering**: `/curator.steering.md` pins the "spooky curator" voice across all generated code + copy
3. **Agent Hooks**: 
   - `artifact_ingest_hook.json` — on upload, detect type → generate migration plan → propose scaffolding code
   - `pipeline_quality_hook.json` — on PR, validate migrations + run tests + auto-fix linting
4. **MCP Extension**: `/emulation_control_mcp.md` allows agents to query emulator status, spawn migration jobs, poll progress, retrieve results

**Why Kiro?** Because automation beats manual code generation every time. Judges see /.kiro folder → understand NecroNet automates itself.

### Demo Artifacts (Live + Playable)
1. **Flash Mini-Game** (Ruffle-playable):
   - Original: Classic 2003-era Flash game running in Ruffle
   - Modernized: Accessibility fixes, CSS refactor
   - Ghost narration: Historical context + feature breakdown
   - URL: `https://necronet.vercel.app/artifacts/demo-flash-id`

2. **GeoCities HTML Page** (1990s nostalgia):
   - Original: Preserved quirky layout + fonts
   - Modernized: Semantic HTML, modern CSS, accessibility
   - Ghost narration: Backstory of GeoCities era
   - URL: `https://necronet.vercel.app/artifacts/demo-html-id`

### Demo Video
**YouTube**: (Link to 3-minute video)
- Scene 1: Title + hook (spooky vibe)
- Scene 2: Problem statement + vision
- Scene 3: Live demo (upload → Ruffle playback → narration)
- Scene 4: Developer tour (/.kiro folder, Kiro usage)
- Scene 5: Full feature walkthrough
- Scene 6: Call-to-action (links to live demo + repo)

---

## Inspiration & Social Impact

### Why This Matters
- **Digital Preservation**: Web artifacts from the early internet era are at risk. NecroNet preserves them playable, not archived.
- **Tech Archaeology**: Celebrates the creativity + innovation of early web devs (many of whom went on to build modern tech).
- **Accessibility**: Resurrects old tech safely (Ruffle sandbox, HTML sanitization) so modern browsers can play without Flash vulnerabilities.
- **Community**: Every resurrected artifact gets a story. Encourages users to share + celebrate forgotten tech.

### Resurrecting Category Fit
This is **textbook resurrection**: Dead tech (Flash, GeoCities, 2000s widgets) comes back to life. Not just archived or documented—actually *playable and interactive* in 2025. Plus, we're using Kiro to automate the resurrection process itself.

---

## Technical Achievements

### Production-Grade Backend
- ✅ Async/await for non-blocking uploads + migrations
- ✅ Background tasks (migration pipeline runs while API stays responsive)
- ✅ Supabase RLS policies for security
- ✅ S3-compatible storage for scalability
- ✅ Error handling + fallbacks (ElevenLabs → gTTS if TTS fails)
- ✅ Comprehensive logging + audit trail (migration_logs table)
- ✅ Docker containerized for Render deployment

### Kiro Deep Integration
- ✅ Spec-driven development (resurrection.spec.md is the contract)
- ✅ Agent hooks for type detection + code generation
- ✅ Steering docs enforcing curator voice consistency
- ✅ MCP extension for emulator orchestration
- ✅ /.kiro folder visible in repo (judges love this)

### Security & Accessibility
- ✅ HTML sanitization (bleach removes XSS vectors)
- ✅ File type validation (MIME + magic bytes)
- ✅ CORS configured for production
- ✅ ARIA labels + semantic HTML
- ✅ Keyboard navigation throughout
- ✅ Dark-mode + high contrast

### Innovation
- ✅ Ruffle embedding (brings Flash back safely)
- ✅ AI ghost narrator (ElevenLabs TTS + curator voice)
- ✅ Automated migration pipeline (orchestrated via Kiro MCP)
- ✅ Social sharing (auto-generated share cards)
- ✅ Before/after comparison (see modernization transforms)

---

## Challenges & Solutions

### Challenge: Flash Security
Flash is dangerous. Running arbitrary .swf files in a browser?

**Solution**: Use Ruffle, a WebAssembly emulator written in Rust. Ruffle sandboxes Flash in the browser, no security vulnerabilities. Judges will be impressed.

### Challenge: HTML Sanitization
User-uploaded HTML could contain XSS attacks (malicious scripts, iframes, etc.).

**Solution**: Use bleach library to strip dangerous tags. Only allow safe HTML (h1–h6, p, img, a, etc.). All URLs validated.

### Challenge: Async Migration Complexity
Migration can take 30–60 seconds. Can't block the API.

**Solution**: Background tasks (async/await in FastAPI). API returns immediately with job_id. Frontend polls for status. Migration runs in background.

### Challenge: TTS Cost
ElevenLabs API can be expensive at scale.

**Solution**: Cache narrations. Fallback to free TTS (gTTS/Piper) if budget exhausted. For this hackathon, demo uses ElevenLabs with generous fallback.

---

## Team & Contributions

**Built by**: Linford Musiyambodza (Full-stack, Kiro integration, DevOps)

**Role**: Designed architecture, implemented Kiro specs + hooks + MCP, built FastAPI backend, integrated Ruffle + ElevenLabs, deployed on Render + Vercel.

---

## What We Learned

1. **Kiro is a game-changer**: Specs + steering + hooks + MCP make automation feel natural, not forced.
2. **Async is essential**: Background tasks keep APIs responsive even during heavy lifting.
3. **Automation beats scale**: NecroNet doesn't need a huge team. Kiro agents + CI/CD do the work.
4. **Preservation matters**: Early internet artifacts have real historical value. This project celebrates that.

---

## Bonus Ideas (Not Implemented, But Exciting)

- Multiplayer ghost tours (WebSocket real-time reactions from other visitors)
- Oral history mode (visitors ask ghost questions via AI Q&A)
- "Return to life" slider (show automated modernization transforms in real-time)
- Social Blitz integration (auto-generate Twitter threads about each artifact)
- Leaderboard (most-resurrected artifacts, longest ghost narrations, etc.)

---

## GitHub Repository

**Repo**: https://github.com/linfordlee14/necronet

**Structure**:
```
necronet/
├── backend/          # FastAPI + Supabase
├── frontend/         # Next.js + Vercel
├── .kiro/            # Specs, steering, hooks, MCP
├── database_schema.sql
├── README.md
└── LICENSE (MIT)
```

**Running Locally**:
```bash
# Backend
cd backend
pip install -r requirements.txt
export $(cat .env | xargs)
python main.py  # Runs on http://localhost:8000

# Frontend
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

---

## Live Demo

**Frontend**: https://necronet.vercel.app  
**API Docs**: https://necronet-backend.render.com/docs  
**GitHub**: https://github.com/linfordlee14/necronet

---

## Category & Bonuses

**Primary Category**: Resurrection ✅  
**Bonus Categories**:
- Most Creative (spooky museum concept, ghost narrator, AI-driven automation)
- Best Use of Kiro (specs + steering + hooks + MCP)
- Best Startup Idea (could scale to preserve entire web archives)

---

## Final Thoughts

NecroNet proves that dead tech doesn't have to stay dead. With the right tools—Kiro for automation, Ruffle for emulation, AI for narration—we can resurrect the early web and share it with the world.

**Vote for NecroNet. Let's bring back the ghosts of the early internet. 🎃👻**
