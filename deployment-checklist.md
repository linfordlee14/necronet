# NecroNet — Deployment Checklist for Kiroween Submission

**Deadline**: Dec 5, 2025, 2:00 PM PST

---

## Phase 1: Pre-Deployment (Days 0–1)

### Repository Setup
- [ ] Create public GitHub repo: `github.com/linfordlee14/necronet`
- [ ] Add OSI-approved LICENSE (MIT or Apache 2.0)
- [ ] Add .gitignore (Python + Node.js)
- [ ] Initialize /.kiro folder with specs, steering, hooks, MCP files
  - [ ] `/.kiro/specs/resurrection.spec.md`
  - [ ] `/.kiro/steering/curator.steering.md`
  - [ ] `/.kiro/hooks/artifact_ingest_hook.json`
  - [ ] `/.kiro/hooks/pipeline_quality_hook.json`
  - [ ] `/.kiro/mcp/emulation_control_mcp.md`
- [ ] Add comprehensive README.md (see template below)

### Backend Setup
- [ ] Create `backend/` directory with FastAPI app
- [ ] Create `backend/requirements.txt` (all dependencies)
- [ ] Create `backend/.env.example` (no secrets)
- [ ] Create `backend/Dockerfile` (production-ready)
- [ ] Create `database_schema.sql` (Supabase init script)
- [ ] Set up Supabase PostgreSQL (project created, tables initialized)
  - [ ] Run `database_schema.sql` in Supabase SQL Editor
  - [ ] Enable Row Level Security on `artifacts` table
  - [ ] Create anon + auth policies
- [ ] Configure S3-compatible storage (AWS S3 or DigitalOcean Spaces)
  - [ ] Create bucket `necronet-artifacts`
  - [ ] Set CORS policy (allow Vercel domain)
  - [ ] Configure public read access (or use signed URLs)
- [ ] Set up environment variables for backend
  - [ ] `SUPABASE_URL`, `SUPABASE_KEY`
  - [ ] `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
  - [ ] `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` (optional)

### Frontend Setup
- [ ] Create `frontend/` directory with Next.js app
- [ ] Create `frontend/package.json` (all dependencies)
- [ ] Set up Tailwind CSS (dark mode enabled)
- [ ] Build components:
  - [ ] Upload form
  - [ ] Artifact gallery
  - [ ] Exhibit player (Ruffle embed, iframe, narration)
  - [ ] Share buttons
- [ ] Configure environment variables for frontend
  - [ ] `NEXT_PUBLIC_API_URL` (backend URL)

### Demo Artifacts Prep
- [ ] Acquire/create Flash .swf demo (test for Ruffle compatibility)
  - [ ] Use public domain demo OR create simple test .swf
  - [ ] Test locally with Ruffle (https://ruffle.rs)
- [ ] Create GeoCities-style HTML demo (1990s layout)
  - [ ] Include quirky fonts, bright colors, nested tables (authentic)
  - [ ] Ensure mobile-responsive (CSS fallback)
- [ ] Test both artifacts locally (upload → migration → playback)

---

## Phase 2: Local Testing (Day 1)

### Backend Testing
- [ ] Install Python 3.11 + pip dependencies
- [ ] Set up .env file with test credentials
- [ ] Run `python main.py` (check for syntax errors)
- [ ] Test endpoints:
  - [ ] `GET /health` → should return 200
  - [ ] `POST /api/artifacts/upload` → test file upload
  - [ ] `GET /api/artifacts/{id}` → test retrieval
  - [ ] `GET /api/artifacts` → test listing
- [ ] Run pytest (if tests written)
- [ ] Check logs for errors (should be clean)

### Frontend Testing
- [ ] Install Node.js 18 + npm dependencies
- [ ] Run `npm run dev` (check for build errors)
- [ ] Test pages:
  - [ ] Landing page (upload form visible)
  - [ ] Upload flow (drag-drop, file selection)
  - [ ] Gallery page (list artifacts)
  - [ ] Exhibit page (Ruffle embed, narration player)
- [ ] Mobile responsiveness (test on 320px, 768px, 1440px widths)
- [ ] Dark mode (should be default)
- [ ] Accessibility (Tab through keyboard, check contrast)

### Full E2E Test (Locally)
- [ ] Upload demo Flash artifact
- [ ] Check backend logs (type detection, migration plan generation)
- [ ] Wait for migration to complete (should see "ready" status)
- [ ] Visit exhibit page → should show Ruffle embed or iframe
- [ ] Play narration → should hear ElevenLabs audio (or fallback)
- [ ] Click share button → should generate social card
- [ ] **Everything should work without errors**

---

## Phase 3: Deployment (Days 1–2)

### Render Backend Deployment
- [ ] Create Render account (if not already)
- [ ] Create new Web Service on Render
  - [ ] Connect GitHub repo
  - [ ] Set build command: `pip install -r backend/requirements.txt`
  - [ ] Set start command: `python backend/main.py`
  - [ ] Configure environment variables (Supabase, AWS, ElevenLabs keys)
  - [ ] Set port to 8000
- [ ] Deploy (Render auto-deploys on push to `main`)
- [ ] Check deployment logs for errors
- [ ] Test live backend:
  - [ ] `curl https://necronet-backend.render.com/health`
  - [ ] Should return `{"status": "alive", ...}`
- [ ] Update `NEXT_PUBLIC_API_URL` in frontend to point to live backend

### Vercel Frontend Deployment
- [ ] Create Vercel account (if not already)
- [ ] Connect GitHub repo (frontend folder)
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `.next`
- [ ] Configure environment variables (API URL)
- [ ] Deploy (Vercel auto-deploys on push)
- [ ] Check deployment logs
- [ ] Test live frontend:
  - [ ] Visit `https://necronet.vercel.app`
  - [ ] Should load landing page (no errors)
  - [ ] Upload flow should work

### Verify Demo Artifacts Are Live
- [ ] Upload demo Flash artifact via frontend
- [ ] Check Supabase (should see artifact in `artifacts` table)
- [ ] Check S3 (should see .swf file in `necronet-artifacts` bucket)
- [ ] Wait for migration to complete (poll `/api/artifacts/{id}`)
- [ ] Get exhibit URL: `https://necronet.vercel.app/artifacts/{artifact_id}`
- [ ] Test Ruffle embed → Flash should play
- [ ] Test narration player → audio should play
- [ ] **Both demo artifacts must be 100% playable**

---

## Phase 4: Video Recording (Day 2)

### Recording Setup
- [ ] Use OBS or ScreenFlow to record screen
- [ ] Record at 1080p, 30fps
- [ ] Have Kiro IDE open (to show /.kiro folder + agent messages)
- [ ] Have both demo artifact URLs ready
- [ ] Test audio (use microphone + browser audio)

### Recording Checklist
- [ ] Follow `/demo_script_3min.md` beat-by-beat
- [ ] Hit all key moments:
  - [ ] Title card (0:00–0:10)
  - [ ] Problem statement (0:10–0:30)
  - [ ] Live demo: upload → Ruffle → narration (0:30–1:20)
  - [ ] Developer tour: /.kiro folder visible (1:20–1:50)
  - [ ] Feature tour: gallery, share, tech stack (1:50–2:20)
  - [ ] Call-to-action: live links on screen (2:20–2:50)
  - [ ] Closing credits (2:50–3:00)
- [ ] Exact runtime: **3:00** (judges will dock points for being over)
- [ ] Captions: Add lowercase captions (YouTube auto-caption + manual review)
- [ ] Audio: Natural voiceover + narration audio + ambient music

### Upload Video
- [ ] Upload to YouTube (unlisted or public)
- [ ] Title: "NecroNet — Kiroween 2025 Submission (3-minute demo)"
- [ ] Description:
  ```
  🎃 NecroNet: Resurrecting Dead Tech into a Haunted Museum
  
  GitHub: https://github.com/linfordlee14/necronet
  Live Demo: https://necronet.vercel.app
  API Docs: https://necronet-backend.render.com/docs
  
  Category: Resurrection (Primary) + Most Creative (Bonus)
  Built with Kiro specs, steering, hooks, MCP
  ```
- [ ] Tags: #Kiroween #Hackathon #Resurrection #Kiro #WebDevelopment
- [ ] Make video public (or share unlisted link with judges)
- [ ] Copy video URL for Devpost

---

## Phase 5: Devpost Submission (Day 3)

### Prepare Submission
- [ ] Go to https://kiroween.devpost.com
- [ ] Click "Submit Entry"
- [ ] Fill in project details:
  - [ ] **Project Name**: NecroNet
  - [ ] **Short Description** (280 chars): See devpost_submission.md
  - [ ] **Long Description**: Copy from devpost_submission.md
  - [ ] **Category**: Resurrection (Primary)
  - [ ] **Bonus Categories**: Most Creative, Best Startup Idea (optional)

### Add Submission Links
- [ ] **GitHub Repository**: https://github.com/linfordlee14/necronet
- [ ] **Live Demo**: https://necronet.vercel.app
- [ ] **Demo Video**: YouTube link (3 minutes)
- [ ] **API Documentation**: https://necronet-backend.render.com/docs
- [ ] **Devpost Project Photo**: Screenshot of museum landing page

### Final Checks Before Submit
- [ ] /.kiro folder visible in GitHub repo? ✅
- [ ] README.md explains Kiro usage? ✅
- [ ] LICENSE present (MIT or Apache 2.0)? ✅
- [ ] Both demo artifacts 100% playable? ✅
- [ ] Demo video exactly 3:00 long? ✅
- [ ] GitHub + Vercel + Render deployments live? ✅
- [ ] All links working? ✅
- [ ] No secrets in repo (.env.example only)? ✅
- [ ] Devpost submission complete + proofread? ✅

### Submit
- [ ] Click "Submit Entry"
- [ ] **Note submission time**: Should be before Dec 5, 2:00 PM PST
- [ ] **Screenshot confirmation**: Save submission screenshot
- [ ] **Celebrate** 🎃👻

---

## Phase 6: Post-Submission (Day 3+)

### Promotion
- [ ] Share project on LinkedIn (tag Kiro, highlight Kiroween)
- [ ] Share on Twitter/X with #Kiroween #Hackathon #Resurrection
- [ ] Share in tech communities (Dev.to, Hacker News, Reddit)
- [ ] Send to friends/colleagues for voting

### Demo Maintenance
- [ ] Monitor backend logs (Render dashboard)
- [ ] Monitor frontend errors (Vercel analytics)
- [ ] Check Supabase for any issues
- [ ] Keep demo artifacts accessible throughout voting period

### Bonus: Document Learnings
- [ ] Write blog post about building with Kiro
- [ ] Document challenges + solutions
- [ ] Create a "how-to" guide for Kiro beginners
- [ ] Share lessons learned with Kiro community

---

## Troubleshooting (Common Issues)

### Issue: Demo artifact not uploading
**Solution**: Check S3 credentials, bucket permissions, CORS policy. Verify file is < 500MB.

### Issue: Ruffle not loading
**Solution**: Ensure Ruffle CDN URL correct. Check browser console for CORS errors. Test locally first.

### Issue: ElevenLabs narration fails
**Solution**: Check API key + voice ID. Verify TTS fallback is working (should use gTTS). Check rate limits.

### Issue: Vercel/Render deployment fails
**Solution**: Check build logs. Verify environment variables set. Ensure Node/Python versions match locally. Test locally first.

### Issue: Database connection error
**Solution**: Check Supabase URL + key. Verify RLS policies allow queries. Test connection with `curl`.

### Issue: Frontend doesn't call backend
**Solution**: Check `NEXT_PUBLIC_API_URL` environment variable. Verify CORS headers. Check browser Network tab.

---

## Final Reminders

✅ **DO:**
- Deploy early (days before deadline, not hours)
- Test everything locally first
- Keep demo artifacts live + playable
- Highlight /.kiro folder in README + demo video
- Follow demo script exactly (3:00 runtime)
- Maintain curator voice in all copy

❌ **DON'T:**
- Forget .env variables (use .env.example)
- Commit secrets to repo
- Ship untested code to production
- Use placeholder text ("TODO", "implement X")
- Miss the Dec 5, 2:00 PM PST deadline
- Hardcode API keys or passwords

---

## Success Metrics

Judge will evaluate on:
- ✅ **Resurrection category fit**: Dead tech actually plays (not archived)
- ✅ **Kiro integration**: /.kiro visible + clear usage in demo
- ✅ **Code quality**: Production-ready, no TODOs, tests passing
- ✅ **Innovation**: Spooky concept + AI narration + auto-migration
- ✅ **Demo quality**: 3-minute video shows end-to-end flow
- ✅ **Completeness**: Two demo artifacts live + shareable

**If you hit all these, NecroNet will be competitive. 🎃**

Good luck, Linford! 👻
