# NecroNet — 3-Minute Demo Script (Beat-by-Beat)

**Total Runtime**: 3:00 (tight, judge-focused)

---

## Scene 1: Title Card + Hook (0:00–0:10)
**Duration**: 10 seconds

**Visual**: Fade in on dark background with eerie purple/green neon text:
```
🎃 NecroNet 🎃
Resurrecting Dead Tech into a Haunted Museum
```

**Audio**: Spooky ambient sound (low minor chords, subtle ghost whisper)

**Voiceover** (warm, witty, in curator voice):
> "Welcome to NecroNet, where obsolete web artifacts get a second life... and a ghost narrator to tell their stories."

**On-screen text**: "Kiroween 2025 Submission — Resurrection Category"

---

## Scene 2: Problem + Solution (0:10–0:30)
**Duration**: 20 seconds

**Visual**: Quick montage of dead tech (Flash logo, GeoCities layout, 2000s widget screenshots) with red "X" overlay, then fade to NecroNet museum landing page (dark, spooky, welcoming)

**Voiceover**:
> "Flash is dead. GeoCities is gone. But the web artifacts that defined the early internet? They shouldn't be forgotten.
> 
> NecroNet automates resurrection: upload any old artifact, and our AI curator resurrects it into an interactive museum exhibit."

**On-screen callouts**:
- "Problem: Dead tech = lost history"
- "Solution: NecroNet automates migration + narration"

**Visual transition**: Zoom into NecroNet landing page showing upload form

---

## Scene 3: Live Demo — Upload + Migration (0:30–1:20)
**Duration**: 50 seconds

**Visual 1** (0:30–0:45): Upload in action
- Click "Upload your digital ghost" button
- Drag-and-drop Flash .swf file (demo: `classic_game.swf`)
- Show success toast: "🎃 Artifact resurrected! Ghost curator analyzing..."
- Progress bar shows upload → S3 storage

**Voiceover**:
> "Step 1: Upload. Drop a Flash file, HTML page, or image. The backend detects type, stores in S3, and triggers the migration pipeline."

**Visual 2** (0:45–1:05): Live Ruffle embed playback
- Show museum exhibit page with original Flash game running in Ruffle (WebAssembly emulator)
- Click play button on Flash mini-game → shows it's playable in modern browser
- Briefly show "Modernized Version" tab (shows before/after)

**Voiceover**:
> "Step 2: Emulation. For Flash, we use Ruffle—a WebAssembly emulator that brings Flash back to the web safely. You can play it right here."

**Visual 3** (1:05–1:20): Ghost narration playing
- Show museum exhibit page with narration player active
- Ghost narration audio playing (real ElevenLabs audio, ~15 seconds trimmed)
- Show transcript below audio player (typed out)
- Audio text reads: "This Flash game was released in 2003 during the golden age of Newgrounds. Features: infinite replayability, pixel-perfect platforming, a chiptune soundtrack that still slaps. Museum note: The original devs are likely on LinkedIn now. 🎃"

**Voiceover**:
> "Step 3: Narration. Our AI curator generates a spooky 90-second backstory + analysis. Listen to the ghost's tale..."

---

## Scene 4: Code Tour — /.kiro Folder + Kiro Usage (1:20–1:50)
**Duration**: 30 seconds

**Visual**: Split screen
- **Left**: File explorer showing /.kiro folder structure
  ```
  .kiro/
  ├── specs/
  │   └── resurrection.spec.md
  ├── steering/
  │   ├── curator.steering.md
  │   └── ...
  ├── hooks/
  │   ├── artifact_ingest_hook.json
  │   └── pipeline_quality_hook.json
  └── mcp/
      └── emulation_control_mcp.md
  ```
  
- **Right**: Kiro IDE showing agent message + generated code
  - Agent prompt (visible in Kiro):
    ```
    "When a user uploads a Flash .swf, detect type, 
    generate migration plan, propose Ruffle embed code"
    ```
  - Kiro response (generated code, visible):
    ```html
    <div id="ruffle"></div>
    <script src="https://...ruffle.js"></script>
    <script>
      const ruffle = window.RufflePlayer.newest();
      ruffle.createPlayer().load("./artifact.swf");
    </script>
    ```

**Voiceover**:
> "Here's where Kiro makes it special. We use **specs** to define all requirements. **Steering** pins the spooky curator persona. **Hooks** automate type detection + code generation. **MCP** orchestrates emulators.
> 
> This spec-driven approach means artifacts migrate automatically. Kiro agents write the code. Judges see the /.kiro folder and know we're using Kiro's full power."

**On-screen highlight**: Bold box around /.kiro folder

---

## Scene 5: Full Feature Tour (1:50–2:20)
**Duration**: 30 seconds

**Visual 1** (1:50–2:00): Gallery page
- Show museum gallery listing all uploaded artifacts
- Filter by type (Flash, HTML, Image, Archive)
- Each artifact has status badge (✅ Ready, 🔄 Migrating, ❌ Failed)
- Click on Demo 2 (GeoCities HTML page)

**Voiceover**:
> "The museum gallery shows all resurrected artifacts. Each one has a ghost curator narration, playable in modern browsers, and shareable on social media."

**Visual 2** (2:00–2:10): GeoCities HTML exhibit
- Show GeoCities-style page (original layout preserved, but modern CSS fallback)
- Modernized version (side-by-side comparison)
- Show share buttons (Twitter/X, LinkedIn, email)

**Voiceover**:
> "For HTML, we sanitize dangerous code, apply modern CSS, and preserve the nostalgic layout. Every artifact is shareable—spread the spooky love."

**Visual 3** (2:10–2:20): Real-time tech callouts
- Show tech stack in corner:
  ```
  FastAPI + Supabase PostgreSQL
  Ruffle + bleach + ElevenLabs TTS
  React + Next.js (Vercel)
  Deployed on Render
  ```

**Voiceover**:
> "The tech stack is production-grade: FastAPI backend, Supabase for data, S3 for storage, ElevenLabs for narration. All automated via Kiro."

---

## Scene 6: Call-to-Action (2:20–2:50)
**Duration**: 30 seconds

**Visual**: Show live demo links on-screen
```
🎃 Live Demo: https://necronet.vercel.app
📂 GitHub Repo: https://github.com/linfordlee14/necronet
```

**Voiceover**:
> "Visit the live demo to explore the museum yourself. Upload your own artifact and watch it resurrect in real-time.
> 
> The repo is fully open-source with documentation, tests, and a complete /.kiro folder showing our Kiro usage.
> 
> We use Kiro's specs, agent hooks, steering, and MCP to automate the entire pipeline—from artifact ingestion to museum publication."

**On-screen callouts**:
- ✅ Spec-driven development
- ✅ Agent hooks for automation
- ✅ Steering for curator voice
- ✅ MCP for emulation control

---

## Scene 7: Closing (2:50–3:00)
**Duration**: 10 seconds

**Visual**: Fade to museum landing page with "NecroNet" title
- Overlay: "Resurrecting Dead Tech | Kiroween 2025 | Resurrection Category"

**Audio**: Spooky ambient fades

**Voiceover**:
> "NecroNet: Where dead tech comes back to haunt. Vote for us. 🎃"

**On-screen text**:
```
Thank you, judges! 👻
Category: Resurrection (Primary) + Most Creative (Bonus)
Kiro integration: /.kiro specs, steering, hooks, MCP
```

---

## Technical Notes (For Production)

### Recording Setup
- **Screen capture**: OBS or ScreenFlow (1080p, 30fps)
- **Audio**: Use your own voice (natural, warm, witty) + narration audio played from browser
- **Pacing**: Fast cuts (1–3 seconds per visual) to keep pace
- **Captions**: Add lowercase captions for accessibility (YouTube auto-captions + manual review)

### Demo Artifacts (Must Be Live)
- Demo 1: Flash mini-game running in Ruffle (e.g., `https://necronet.vercel.app/artifacts/demo-flash-id`)
- Demo 2: GeoCities HTML page (e.g., `https://necronet.vercel.app/artifacts/demo-html-id`)
- Both must be 100% functional

### Backup Plan
- If demo breaks during recording: Have pre-recorded screenshots + fallback narration explaining the features
- Keep 2–3 recordings (best take wins)

### Upload Instructions
- Platform: YouTube (unlisted or public)
- Title: "NecroNet — Kiroween 2025 Submission (3-minute demo)"
- Description: GitHub repo link + live demo links
- Tags: #Kiroween #Hackathon #Resurrection #Kiro
