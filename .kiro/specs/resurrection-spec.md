# NecroNet Resurrection Spec

## Purpose
Automate ingestion, migration, and safe playback of legacy web artifacts by providing emulator-based rendering, a modernized alternative, and AI-generated "ghost" narration. NecroNet turns a museum of dead tech into an interactive, spooky, shareable experience.

## Vision
Users upload obsolete artifacts (Flash .swf, GeoCities HTML, old chat clients, classic 2000s widgets) → NecroNet detects type, automatically migrates/emulates, and deploys as a playable museum exhibit with live "ghost narrator" commentary.

---

## Minimum Viable Deliverables (MVP)

### 1. Upload & Ingestion Pipeline
- **Input**: Accept file upload (Flash .swf, HTML file, image, or ZIP archive) via REST `/api/artifacts/upload` endpoint
- **Processing**: Auto-detect artifact type (MIME, file headers, extension)
- **Output**: Store in S3-compatible storage; return `artifact_id` + storage URL
- **Response**: JSON with upload status, artifact metadata, next steps

### 2. Migration Orchestration
- **Strategy Detection**: Based on artifact type, determine migration path:
  - **Flash** → Ruffle (WebAssembly emulation) + museum exhibit page
  - **HTML** → Sanitize + apply modern CSS fallback + accessibility
  - **Image** → Optimize (WebP) + extract metadata + gallery entry
  - **Archive** → Extract + process contents
- **Automated Steps**: Run detection → choose emulator/transform → produce scaffolding code
- **Output**: Migration plan (strategy, steps, duration), stored in DB

### 3. Two Working Demo Artifacts (Judge-Friendly)
- **Demo 1: Flash Mini-Game** (e.g., Ruffle-playable .swf)
  - Original: Playable in-browser via Ruffle embed
  - Modernized: Show before/after comparison (CSS, accessibility enhancements)
  - Ghost narration: AI-generated audio + transcript (90s)
- **Demo 2: GeoCities-Style HTML Page**
  - Original: Restored with modern CSS fallback
  - Modernized: Refactored structure, accessible alt text, modern typography
  - Ghost narration: AI-generated backstory + museum note

### 4. Ghost Narration System
- **AI Integration**: Use ElevenLabs TTS (or fallback to gTTS/Piper) to generate spooky, witty narration
- **Content**: 1-2 line backstory + 3 bullets (unique features) + 1-line museum note
- **Audio**: Store MP3 in S3; return public URL
- **Transcript**: Extract text for display on exhibit page

### 5. Dark, Spooky UI + Museum Experience
- **Landing Page**: Haunt-themed landing with call-to-action ("Upload your dead tech")
- **Artifact Exhibit Page**: 
  - Original vs. modernized side-by-side comparison
  - Live playback (Ruffle, iframe, or gallery)
  - Ghost narration player + transcript
  - Share buttons (Twitter/X, LinkedIn, email)
- **Museum Gallery**: List all uploaded artifacts with thumbnails, type badges, status indicators
- **Admin Dashboard** (bonus): Show migration pipeline status, logs, errors

### 6. Testing & Documentation
- **Unit Tests**: API endpoints (upload, fetch, list), artifact type detection, migration plan generation
- **E2E Tests**: Full upload → migration → playback flow (at least one demo artifact)
- **Health Checks**: /health endpoint for Render deployment
- **README.md**: Local run instructions, API documentation, how Kiro was used

---

## Acceptance Criteria

### Required (Submission Mandatory)
- [ ] Public GitHub repo with `./.kiro/` folder visible (specs, steering, hooks, MCP)
- [ ] Backend deployed on Render or equivalent (publicly accessible)
- [ ] Two demo artifacts working (Flash + HTML) with live URLs
- [ ] Ghost narration functional (ElevenLabs or fallback)
- [ ] 3-minute demo video (YouTube/Vimeo) showing full end-to-end flow
- [ ] README explains /.kiro usage + how to run locally
- [ ] OSI-approved LICENSE (MIT, Apache 2.0, etc.)
- [ ] Devpost submission with category (Resurrection) + bonus categories

### Stretch Goals (Nice-to-Have)
- [ ] Multiplayer ghost tours (WebSocket real-time reactions)
- [ ] Oral history mode (visitors ask ghost questions via AI Q&A)
- [ ] "Return to life" slider (before/after modernization transforms)
- [ ] Social Blitz integration (auto-generate shareable cards)
- [ ] CI/CD via GitHub Actions (auto-convert demo artifacts on commit)

---

## Technical Architecture

### Frontend Stack
- **Framework**: React + Next.js (SSR for SEO, static site generation for demo)
- **Styling**: Tailwind CSS (dark mode by default)
- **Components**: Upload form, artifact player (iframe/embed), gallery, share buttons
- **Real-time**: WebSocket for live ghost reactions (bonus)

### Backend Stack
- **Runtime**: FastAPI (Python) on Render
- **Database**: Supabase (PostgreSQL) for artifact metadata + logs
- **Storage**: S3-compatible (AWS S3, DigitalOcean Spaces, or Wasabi)
- **TTS**: ElevenLabs API (fallback: gTTS/Piper)
- **Emulation**: Ruffle (Flash), HTML sanitizer (bleach/nh3), Wasm-based game emulators

### Deployment
- **Frontend**: Vercel (Next.js, automatic deploys on GitHub push)
- **Backend**: Render (Docker container, environment variables)
- **Database**: Supabase hosted (quick setup, no ops needed)
- **Storage**: S3-compatible (any region; fast CDN delivery)
- **CI/CD**: GitHub Actions for asset conversion + tests

---

## Kiro Usage (How We Build This)

### 1. **Spec-Driven Development**
- This spec is the contract. Kiro agents read it to understand requirements.
- Kiro generates tasks from spec sections (upload pipeline, demo artifacts, narration, UI, tests).
- We iterate spec → implementation → feedback loop.

### 2. **Agent Hooks** (Automated Workflows)
- **Hook 1: Artifact Ingest Hook**
  - Trigger: `@artifact_ingest` tagged in issues or on `/api/artifacts/upload` call
  - Action: Agent detects type → generates migration plan → proposes code scaffolding
  - Output: Commit-ready Python/JavaScript code for handlers
  
- **Hook 2: Migration Pipeline Hook**
  - Trigger: Scheduled daily or on PR open
  - Action: Validate Ruffle embed, sanitize HTML, run tests
  - Output: Auto-generate commit message + run pytest

- **Hook 3: Narration Generation Hook**
  - Trigger: Artifact reaches `migrating` status
  - Action: Call ElevenLabs, download MP3, upload to S3
  - Output: Update artifact record with narration URL

### 3. **Steering Docs** (Consistent Persona + Code Style)
- **Product.md**: NecroNet vision, spooky curator voice
- **Tech.md**: FastAPI patterns, React hooks, Kiro agent best practices
- **Structure.md**: Repo layout, naming conventions, DRY principles
- **Curator.steering.md**: Custom persona (witty, eerie, helpful) for all generated copy + narration scripts

### 4. **MCP Extension** (Emulation Control)
- **Capability**: Query emulator availability, spawn migration job, retrieve logs
- **API**: Kiro agents can call MCP to check Ruffle version, start migration, poll status
- **Output**: Judges see extended Kiro capabilities beyond boilerplate

---

## Implementation Tasks (Ordered by Priority)

### Phase 1: Core Infrastructure (Days 0–1)
- [ ] Set up FastAPI backend (main.py, requirements.txt, Dockerfile)
- [ ] Create Supabase PostgreSQL + run database_schema.sql
- [ ] Configure S3-compatible storage (AWS S3 or DigitalOcean Spaces)
- [ ] Implement `/api/artifacts/upload` endpoint (file ingestion + S3 upload)
- [ ] Implement `/api/artifacts/{id}` endpoint (fetch metadata)
- [ ] Set up environment variables (.env) + .gitignore

### Phase 2: Migration Pipeline (Days 1–2)
- [ ] Implement artifact type detection (detect_artifact_type function)
- [ ] Generate migration plans (generate_migration_plan function)
- [ ] Integrate ElevenLabs TTS (or fallback to gTTS)
- [ ] Background task orchestration (orchestrate_migration async function)
- [ ] Store migration logs in database (audit trail)

### Phase 3: Demo Artifacts (Days 1–2, Parallel)
- [ ] Find/create Flash .swf demo (or use public domain example)
- [ ] Create GeoCities-style HTML page (replica of 1990s design)
- [ ] Test Ruffle embed integration
- [ ] Test HTML sanitization + CSS refactoring

### Phase 4: Frontend (Days 2–3)
- [ ] React landing page (upload form, call-to-action)
- [ ] Artifact exhibit page (original vs. modernized, ghost narration player)
- [ ] Museum gallery (list all artifacts, filter by type)
- [ ] Share buttons (Twitter/X, LinkedIn, email)

### Phase 5: Testing & Polish (Days 2–3)
- [ ] Write unit tests (pytest: endpoints, type detection, plan generation)
- [ ] Write E2E tests (upload demo artifact, fetch, verify DB + S3)
- [ ] Record 3-minute demo video (scene-by-scene, highlighting Kiro usage)
- [ ] Polish README.md + API docs

### Phase 6: Deployment & Submission (Day 3)
- [ ] Deploy backend to Render (Docker + environment variables)
- [ ] Deploy frontend to Vercel (Next.js + GitHub integration)
- [ ] Verify demo artifacts are live + working
- [ ] Submit Devpost (link to repo, live demo, video)

---

## Success Metrics

- **Demo Quality**: Two live, playable demo artifacts accessible via URLs
- **Judge Experience**: 3-minute video clearly shows Kiro usage (spec, hooks, steering, MCP)
- **Code Quality**: /.kiro folder visible; repo has clear structure; README explains Kiro integration
- **Innovation**: Memorable UX (spooky museum theme, ghost narrator, social share)
- **Completeness**: All endpoints working, migrations automated, tests passing

---

## Additional Notes

- **Spooky Tone**: Maintain eerie-but-helpful curator voice throughout UI copy, narration scripts, error messages, and commit messages (via steering).
- **Demo Safety**: All uploads sanitized before display; no XSS or injection attacks possible.
- **Scalability**: Use async/background tasks to handle long-running migrations without blocking requests.
- **Fallbacks**: If ElevenLabs API unavailable, fallback to text-only narration or free TTS (gTTS/Piper).
- **Social Impact**: Frame as "preserving digital heritage" and "celebrating obsolete tech" — resonates with judges.
