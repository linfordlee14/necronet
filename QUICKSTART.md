# NecroNet — Quick Start Guide (Copy-Paste Ready)

**TL;DR**: Everything you need to build, deploy, and submit NecroNet by Dec 5, 2:00 PM PST.

---

## 🚀 Step 1: Initialize Repository (5 minutes)

```bash
# Create GitHub repo
git init necronet
cd necronet

# Create folder structure
mkdir -p backend frontend .kiro/{specs,steering,hooks,mcp} scripts

# Copy all files from this guide into their respective folders
# (See file list at end of this guide)

# Create .gitignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
venv/
.env
.env.local

# Node
node_modules/
.next/
dist/
.vercel

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF

# Create LICENSE (MIT)
curl https://opensource.org/licenses/MIT > LICENSE

# Initialize git
git add .
git commit -m "🎃 initial commit: NecroNet scaffold"
git remote add origin https://github.com/linfordlee14/necronet
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Set Up Supabase (10 minutes)

```bash
# 1. Go to https://supabase.com → sign up → create project
# 2. Save project URL + anon key
# 3. Go to SQL Editor
# 4. Copy-paste database_schema.sql + run
# 5. Verify tables created:
#    - artifacts (with RLS policies)
#    - migration_logs

# Test connection
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/artifacts" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Should return: {"artifacts": []}
```

---

## 💾 Step 3: Set Up AWS S3 (10 minutes)

```bash
# 1. Go to https://aws.amazon.com → console
# 2. Create S3 bucket: necronet-artifacts
# 3. Set bucket policy (public read):
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::necronet-artifacts/*"
    }
  ]
}
# 4. Enable CORS:
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST"],
    "AllowedOrigins": ["https://necronet.vercel.app"],
    "ExposeHeaders": ["x-amz-request-id"],
    "MaxAgeSeconds": 3000
  }
]
# 5. Generate IAM credentials (access key + secret)
# 6. Save credentials to .env
```

---

## ⚙️ Step 4: Configure Environment Variables

### Backend (.env)
```bash
cat > backend/.env << 'EOF'
# Supabase
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_ANON_KEY

# AWS S3
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_S3_BUCKET=necronet-artifacts
AWS_S3_REGION=us-east-1

# ElevenLabs (optional; set to empty for fallback to gTTS)
ELEVENLABS_API_KEY=YOUR_API_KEY
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# FastAPI
PORT=8000
ENVIRONMENT=development
EOF

chmod 600 backend/.env
```

### Frontend (.env.local)
```bash
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

---

## 🔧 Step 5: Install Dependencies

### Backend
```bash
cd backend
pip install -r requirements.txt
# Should install: fastapi, uvicorn, supabase, boto3, python-dotenv, etc.
```

### Frontend
```bash
cd frontend
npm install
# Should install: react, next, tailwindcss, etc.
```

---

## 🧪 Step 6: Test Locally

### Start Backend
```bash
cd backend
python main.py
# Should print: "Uvicorn running on http://0.0.0.0:8000"
# Visit http://localhost:8000/docs for API docs
```

### Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
# Should print: "▲ Next.js X.X ready on http://localhost:3000"
```

### Test Upload
```bash
# 1. Visit http://localhost:3000
# 2. Click "Upload your digital ghost"
# 3. Drag a demo Flash file (.swf) or HTML page
# 4. Should see:
#    - Upload success toast
#    - Artifact appears in gallery
#    - Status shows "uploaded" → "migrating" → "ready"
# 5. Click artifact → should show exhibit page
# 6. Ruffle should play (for Flash) or iframe loads (for HTML)
# 7. Narration player should show audio URL (or gTTS fallback)
```

---

## 🎬 Step 7: Record 3-Minute Demo Video

```bash
# Open OBS (or ScreenFlow for Mac)
# 1. Capture screen + microphone
# 2. Record at 1080p, 30fps
# 3. Follow demo_script_3min.md beat-by-beat
# 4. Keep runtime exactly 3:00 (no longer!)
# 5. Export as MP4

# Upload to YouTube
# 1. Go to https://youtube.com/upload
# 2. Upload MP4
# 3. Title: "NecroNet — Kiroween 2025 Submission (3-minute demo)"
# 4. Description:
#    - GitHub: https://github.com/linfordlee14/necronet
#    - Live Demo: https://necronet.vercel.app
#    - API Docs: https://necronet-backend.render.com/docs
# 5. Tags: #Kiroween #Hackathon #Resurrection #Kiro
# 6. Make public (or share unlisted link with judges)
# 7. Copy video URL for Devpost
```

---

## 🚀 Step 8: Deploy Backend to Render

```bash
# 1. Go to https://render.com → sign up
# 2. Click "New" → "Web Service"
# 3. Connect GitHub repo
# 4. Fill in:
#    - Name: necronet-backend
#    - Environment: Docker
#    - Build Command: (leave default)
#    - Start Command: (leave default)
# 5. Scroll down → "Environment"
#    - Add SUPABASE_URL
#    - Add SUPABASE_KEY
#    - Add AWS_ACCESS_KEY_ID
#    - Add AWS_SECRET_ACCESS_KEY
#    - Add ELEVENLABS_API_KEY (optional)
# 6. Click "Deploy"
# 7. Wait ~5 minutes for deployment
# 8. Copy backend URL (e.g., https://necronet-backend.render.com)
# 9. Update frontend .env.local: NEXT_PUBLIC_API_URL=https://necronet-backend.render.com
```

---

## 🌐 Step 9: Deploy Frontend to Vercel

```bash
# 1. Go to https://vercel.com → sign up
# 2. Click "New Project" → import GitHub repo
# 3. Select "frontend" folder (if monorepo)
# 4. Fill in:
#    - Framework: Next.js
#    - Build Command: npm run build
# 5. Scroll down → "Environment Variables"
#    - Add NEXT_PUBLIC_API_URL=https://necronet-backend.render.com
# 6. Click "Deploy"
# 7. Wait ~3 minutes for deployment
# 8. Copy frontend URL (e.g., https://necronet.vercel.app)
# 9. Test live: https://necronet.vercel.app
#    - Should upload, migrate, and display exhibits
#    - Both demo artifacts must be playable
```

---

## 📝 Step 10: Prepare Devpost Submission

```bash
# 1. Go to https://kiroween.devpost.com
# 2. Click "Submit Entry"
# 3. Fill in:
#    Project Name: NecroNet
#    Tagline: Resurrecting Dead Tech into a Haunted Museum
#    Category: Resurrection
#    Bonus: Most Creative + Best Startup Idea (optional)

# 4. Copy-paste from devpost_submission.md:
#    - Short description (280 chars)
#    - Long description (full details)

# 5. Add links:
#    - GitHub: https://github.com/linfordlee14/necronet
#    - Live Demo: https://necronet.vercel.app
#    - Demo Video: (YouTube link)
#    - API Docs: https://necronet-backend.render.com/docs

# 6. Upload screenshot (museum landing page)

# 7. Proofread everything

# 8. Click "Submit Entry"
#    - Should be before Dec 5, 2:00 PM PST
#    - Screenshot confirmation for your records
```

---

## ✅ Pre-Submission Checklist

- [ ] GitHub repo public + has /.kiro folder visible
- [ ] README.md complete + explains Kiro usage
- [ ] LICENSE file present (MIT or Apache 2.0)
- [ ] Backend deployed on Render (live + healthy)
- [ ] Frontend deployed on Vercel (live + loading)
- [ ] Both demo artifacts 100% playable
  - [ ] Flash .swf runs in Ruffle
  - [ ] HTML page loads in iframe
  - [ ] Both have ghost narration
- [ ] 3-minute demo video uploaded to YouTube (exactly 3:00)
- [ ] Devpost submission complete + proofread
- [ ] All live links working + accessible
- [ ] No secrets in repo (.env.example only)

---

## 📦 File Checklist

Make sure all these files exist in your repo:

**Backend**
- [ ] `backend/main.py` — FastAPI entry point
- [ ] `backend/requirements.txt` — Python dependencies
- [ ] `backend/.env.example` — Environment template
- [ ] `backend/Dockerfile` — Docker config
- [ ] `backend/tests/` — Unit tests (at least test_upload.py)

**Frontend**
- [ ] `frontend/package.json` — Node dependencies
- [ ] `frontend/app/page.tsx` — Landing page
- [ ] `frontend/app/artifacts/[id].tsx` — Exhibit page
- [ ] `frontend/components/*.tsx` — Reusable components
- [ ] `frontend/.env.example` — Environment template

**Kiro** (Critical!)
- [ ] `.kiro/specs/resurrection.spec.md`
- [ ] `.kiro/steering/curator.steering.md`
- [ ] `.kiro/hooks/artifact_ingest_hook.json`
- [ ] `.kiro/hooks/pipeline_quality_hook.json`
- [ ] `.kiro/mcp/emulation_control_mcp.md`

**Documentation**
- [ ] `README.md` — Project overview
- [ ] `database_schema.sql` — Supabase schema
- [ ] `demo_script_3min.md` — Video recording script
- [ ] `devpost_submission.md` — Devpost copy
- [ ] `deployment-checklist.md` — Launch checklist
- [ ] `LICENSE` — MIT License
- [ ] `.gitignore` — Git exclusions

---

## 🐛 Common Issues & Fixes

### Issue: S3 upload fails (403 Forbidden)
**Fix**: Check AWS credentials + bucket policy. Verify CORS headers.

### Issue: Ruffle CDN blocked (CORS error)
**Fix**: Ensure Ruffle CDN URL correct. Check browser console. Test locally first.

### Issue: Supabase connection error
**Fix**: Verify URL + key. Check RLS policies. Run database_schema.sql.

### Issue: ElevenLabs narration missing
**Fix**: Check API key. Verify fallback to gTTS working. Check rate limits.

### Issue: Frontend can't reach backend
**Fix**: Verify NEXT_PUBLIC_API_URL correct. Check CORS headers. Check Render deployment.

---

## 🎯 Timeline

- **Today (Dec 2)**: Repository + initial code + deployment setup
- **Tomorrow (Dec 3)**: Backend + frontend tests + demo artifacts playable locally
- **Tomorrow Evening (Dec 3)**: Deploy to Render + Vercel + record demo video
- **Dec 4**: Devpost submission + final testing + promotion
- **Dec 5 before 2:00 PM PST**: Submission deadline ⏰

---

## 🎃 Final Tips

1. **Test everything locally first** — Don't assume it'll work on production
2. **Keep /.kiro folder visible** — Judges absolutely want to see this
3. **Maintain curator voice** — Keep it spooky-but-helpful everywhere
4. **Demo video must be exactly 3:00** — Judges will dock points for overtime
5. **Both artifacts must be playable** — Not just screenshots or descriptions
6. **Follow the checklist** — Don't skip any step

---

## 📞 Need Help?

- **FastAPI docs**: https://fastapi.tiangolo.com
- **Next.js docs**: https://nextjs.org/docs
- **Supabase docs**: https://supabase.com/docs
- **Kiro docs**: https://kiro.dev/docs
- **Ruffle docs**: https://github.com/ruffle-rs/ruffle

---

**🎃 You got this, Linford! NecroNet is going to be incredible. 👻**

Good luck with the submission! 🚀
