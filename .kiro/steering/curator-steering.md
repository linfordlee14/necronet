---
inclusion: always
---

# NecroNet Development Guidelines

## Project Context
NecroNet resurrects obsolete web artifacts (Flash, GeoCities, classic widgets) into a spooky, interactive museum. Hackathon submission for Resurrection + Most Creative categories.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python), async/await |
| Database | Supabase PostgreSQL with RLS |
| Storage | S3-compatible (AWS S3, DigitalOcean Spaces) |
| Frontend | Next.js + React, Tailwind CSS, dark-mode-first |
| Emulation | Ruffle (Flash), bleach (HTML sanitizer) |
| TTS | ElevenLabs (primary), gTTS (fallback) |

## Code Style

### Python (Backend)
- Use `async def` for all endpoints and background tasks
- Pydantic models for all request/response schemas
- Type hints on all functions
- `snake_case` for functions/variables, `PascalCase` for classes
- Wrap external API calls in try/except with fallbacks

### TypeScript/React (Frontend)
- `camelCase` for functions/variables, `PascalCase` for components
- Tailwind CSS only (no CSS-in-JS)
- Small, reusable components in `frontend/components/`
- Custom hooks in `frontend/hooks/`
- API utilities in `frontend/lib/`

### Database
- Index columns: `artifact_id`, `status`, `created_at`, `artifact_type`
- Table names: `plural_snake_case`
- Always use RLS policies

## Architecture Patterns
- Background tasks for long operations (migration, narration generation)
- Client polls `/api/artifacts/{id}` for status updates
- Stream uploads directly to S3 (never store locally)
- Dependency injection for Supabase/S3 clients

## Curator Voice (Required for All User-Facing Text)
Write all UI copy, error messages, and notifications in a spooky-but-helpful museum curator tone.

**Do:**
- "Drag your digital ghost here... 👻"
- "🎃 Artifact resurrected! Your ghost curator is analyzing..."
- "😢 Alas, this artifact is too corrupted. Try another relic?"

**Don't:**
- Generic: "Upload successful"
- Corporate: "File processing initiated"
- Overly cheerful: "Yay!"

**Commit format:** `emoji type(scope): message` (e.g., `🎃 feat(migration): Auto-detect Flash artifacts`)

## Critical Rules
1. Never hardcode API keys—use environment variables
2. Sanitize all HTML with `bleach` before rendering
3. Validate file uploads (MIME type, size, content)
4. All API responses include `detail` field with curator-voiced message
5. Dark theme is default; respect `prefers-color-scheme`
6. ARIA labels and semantic HTML required for accessibility
7. API endpoints respond in <500ms
8. No `TODO`/`FIXME` comments in submitted code

## API Endpoint Pattern
```
/api/{resource}/{action}
/api/artifacts/upload
/api/artifacts/{id}
/api/artifacts/{id}/migrate
```

## Error Handling
- Log errors with context: `artifact_id`, operation, timestamp
- User-facing errors use curator voice
- External API failures: log warning, use fallback (ElevenLabs → gTTS)

## File Organization
```
backend/main.py          # FastAPI entry point
frontend/app/            # Next.js pages
frontend/components/     # Reusable React components
frontend/hooks/          # Custom React hooks
frontend/lib/            # API client, types, utilities
```
