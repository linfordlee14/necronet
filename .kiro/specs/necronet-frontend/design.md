# Design Document

## Overview

NecroNet Frontend is a Next.js 14 application using the App Router, React 18, TypeScript, and Tailwind CSS. The design prioritizes a dark, spooky museum aesthetic with the "Ghost Curator" persona woven throughout all user interactions. The architecture follows a component-based approach with custom hooks for data fetching and state management.

## Architecture

```mermaid
graph TB
    subgraph "Next.js App Router"
        LP[Landing Page<br/>app/page.tsx]
        EP[Exhibit Page<br/>app/artifacts/[id]/page.tsx]
    end
    
    subgraph "Components"
        Upload[Upload.tsx]
        Gallery[Gallery.tsx]
        ExhibitPlayer[ExhibitPlayer.tsx]
        ShareButtons[ShareButtons.tsx]
        LoadingSpinner[LoadingSpinner.tsx]
        Header[Header.tsx]
        Footer[Footer.tsx]
    end
    
    subgraph "Hooks"
        useUpload[useUpload]
        useArtifacts[useArtifacts]
        useArtifact[useArtifact]
    end
    
    subgraph "API Layer"
        ApiClient[api.ts]
    end
    
    subgraph "Backend"
        FastAPI[FastAPI Server]
    end
    
    LP --> Upload
    LP --> Gallery
    EP --> ExhibitPlayer
    EP --> ShareButtons
    
    Upload --> useUpload
    Gallery --> useArtifacts
    ExhibitPlayer --> useArtifact
    
    useUpload --> ApiClient
    useArtifacts --> ApiClient
    useArtifact --> ApiClient
    
    ApiClient --> FastAPI
```

## Components and Interfaces

### Page Components

#### Landing Page (`app/page.tsx`)
- Header with NecroNet logo and tagline
- Upload component (hero section)
- Gallery component (below fold)
- Footer with GitHub link

#### Exhibit Page (`app/artifacts/[id]/page.tsx`)
- Artifact metadata header
- ExhibitPlayer (hero)
- Narration section
- ShareButtons (sticky footer)
- Back to gallery link

### UI Components

#### Upload.tsx
```typescript
interface UploadProps {
  onUploadComplete?: (artifact: Artifact) => void;
}
```
- Drag-drop zone with ghost emoji placeholder
- File input fallback button
- Progress bar (0-100%)
- Toast notifications (success/error)
- File validation (type, size)

#### ExhibitPlayer.tsx
```typescript
interface ExhibitPlayerProps {
  artifact: Artifact;
}
```
- Tab interface: "Original" | "Modernized"
- Flash: Ruffle embed (`<ruffle-embed>` web component)
- HTML: Sandboxed iframe
- Image: Zoomable gallery view
- Narration: Audio player + transcript

#### Gallery.tsx
```typescript
interface GalleryProps {
  initialArtifacts?: Artifact[];
}
```
- Grid layout (responsive: 1-4 columns)
- Artifact cards with thumbnail, name, type badge, status
- Filter dropdown (All, Flash, HTML, Image)
- Pagination controls
- Empty state with curator voice

#### ShareButtons.tsx
```typescript
interface ShareButtonsProps {
  artifact: Artifact;
  exhibitUrl: string;
}
```
- Twitter/X button
- LinkedIn button
- Email button
- Copy link button

#### LoadingSpinner.tsx
```typescript
interface LoadingSpinnerProps {
  message?: string;
}
```
- Animated ghost spinner (CSS)
- Customizable curator message

#### Header.tsx
- NecroNet logo (text-based)
- Tagline: "Resurrecting Dead Tech"
- Navigation (Home, Gallery)

#### Footer.tsx
- GitHub link
- "Built with Kiro" badge
- Copyright

## Data Models

### TypeScript Interfaces (`lib/types.ts`)

```typescript
// Artifact status enum
type ArtifactStatus = 'uploaded' | 'migrating' | 'ready' | 'failed';

// Artifact type enum
type ArtifactType = 'flash' | 'html' | 'image' | 'archive' | 'other';

// Core artifact interface
interface Artifact {
  artifact_id: string;
  name: string;
  artifact_type: ArtifactType;
  storage_key: string;
  created_at: string;
  status: ArtifactStatus;
  ghost_narration_url: string | null;
  error_message: string | null;
  description?: string;
  original_url?: string;
}

// Upload progress tracking
interface UploadProgress {
  percent: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Migration plan from API
interface MigrationPlan {
  artifact_id: string;
  artifact_type: ArtifactType;
  strategy: string;
  steps: string[];
  estimated_duration_seconds: number;
}

// API response wrappers
interface ArtifactsListResponse {
  artifacts: Artifact[];
  total: number;
}

// API error response
interface ApiError {
  detail: string;
  status: number;
}
```

### API Client (`lib/api.ts`)

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Upload artifact with progress callback
async function uploadArtifact(
  file: File,
  onProgress?: (percent: number) => void
): Promise<Artifact>;

// Get single artifact by ID
async function getArtifact(id: string): Promise<Artifact>;

// List artifacts with pagination
async function listArtifacts(
  limit?: number,
  offset?: number
): Promise<ArtifactsListResponse>;

// Poll for migration status
async function pollMigrationStatus(
  id: string,
  onStatusChange: (artifact: Artifact) => void,
  maxAttempts?: number
): Promise<Artifact>;
```

### Custom Hooks (`hooks/`)

```typescript
// useUpload - handles file upload with progress
function useUpload(): {
  upload: (file: File) => Promise<Artifact>;
  progress: UploadProgress;
  reset: () => void;
};

// useArtifacts - fetches paginated artifact list
function useArtifacts(limit?: number, offset?: number): {
  artifacts: Artifact[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

// useArtifact - fetches single artifact with polling
function useArtifact(id: string): {
  artifact: Artifact | null;
  loading: boolean;
  error: string | null;
};
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: File Validation Correctness
*For any* file object with a given type and size, the validation function SHALL return `true` only when the file extension is in the allowed list (swf, html, htm, png, jpg, jpeg, gif, webp, zip) AND the file size is less than or equal to 50MB.
**Validates: Requirements 1.2**

### Property 2: Upload Progress Tracking
*For any* upload operation, the progress percentage SHALL monotonically increase from 0 to 100, and the final status SHALL be either 'success' or 'error'.
**Validates: Requirements 1.3**

### Property 3: Artifact Metadata Display Completeness
*For any* artifact object, the ExhibitPlayer component SHALL render all required fields (name, artifact_type, status, created_at) in the output.
**Validates: Requirements 2.1**

### Property 4: Conditional Narration Rendering
*For any* artifact, the narration player SHALL be rendered if and only if `ghost_narration_url` is non-null and non-empty.
**Validates: Requirements 2.5**

### Property 5: Migration Status Polling Behavior
*For any* artifact with status "migrating", the polling mechanism SHALL continue until status changes to "ready" or "failed", and SHALL stop polling once a terminal status is reached.
**Validates: Requirements 2.6**

### Property 6: Gallery Pagination Correctness
*For any* pagination parameters (limit, offset), the Gallery SHALL display at most `limit` artifacts starting from position `offset`.
**Validates: Requirements 3.1**

### Property 7: Artifact Card Rendering Completeness
*For any* artifact in the gallery, the rendered card SHALL contain the artifact name, type badge, and status indicator.
**Validates: Requirements 3.2**

### Property 8: Type Filter Correctness
*For any* list of artifacts and selected filter type, all displayed artifacts SHALL have `artifact_type` matching the selected filter (or all types if filter is "All").
**Validates: Requirements 3.6**

### Property 9: Share URL Generation
*For any* artifact and exhibit URL, the generated share URLs SHALL contain the artifact title and exhibit URL, and SHALL include curator voice text ("🎃" or "resurrected").
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 10: Image Accessibility
*For any* image element rendered in the application, the element SHALL have a non-empty `alt` attribute.
**Validates: Requirements 5.4**

### Property 11: API Error Handling
*For any* API call that returns an error status (4xx or 5xx), the API client SHALL return a typed error object with a meaningful `detail` message.
**Validates: Requirements 6.1, 6.2, 6.3**

### Property 12: Polling Backoff
*For any* polling sequence, the interval between consecutive polls SHALL not decrease (implementing at minimum constant or exponential backoff).
**Validates: Requirements 6.4**

## Error Handling

### API Errors
- All API calls wrapped in try-catch
- Network errors display curator-voiced message: "😢 The spirits are restless... Connection lost."
- 404 errors: "👻 This artifact has vanished into the void..."
- 500 errors: "🎃 Something corrupted in the crypt. Try again?"
- Timeout errors: "⏳ The ghost curator is taking too long..."

### Upload Errors
- Invalid file type: "📜 Only ancient relics accepted (swf, html, images, zip)"
- File too large: "🎃 This artifact is too heavy for our museum (max 50MB)"
- Upload failed: "😢 This artifact seems corrupted. Try another?"

### Exhibit Errors
- Artifact not found: "👻 This exhibit has been lost to time..."
- Ruffle load failure: "🎃 Flash emulation failed. The spirits resist..."
- Narration unavailable: "🔇 The ghost curator is silent on this one..."

### Empty States
- No artifacts: "📜 No artifacts yet. Be the first to resurrect dead tech!"
- No search results: "👻 No relics match your search..."

## Testing Strategy

### Unit Testing Framework
- **Framework**: Vitest (fast, ESM-native, compatible with React Testing Library)
- **Coverage Target**: 80% for critical paths (upload, API client, hooks)

### Property-Based Testing Framework
- **Framework**: fast-check (JavaScript property-based testing library)
- **Configuration**: Minimum 100 iterations per property test
- **Annotation Format**: `// **Feature: necronet-frontend, Property {N}: {description}**`

### Test Structure
```
frontend/
├── __tests__/
│   ├── components/
│   │   ├── Upload.test.tsx
│   │   ├── Gallery.test.tsx
│   │   ├── ExhibitPlayer.test.tsx
│   │   └── ShareButtons.test.tsx
│   ├── hooks/
│   │   ├── useUpload.test.ts
│   │   ├── useArtifacts.test.ts
│   │   └── useArtifact.test.ts
│   ├── lib/
│   │   ├── api.test.ts
│   │   └── validation.test.ts
│   └── properties/
│       ├── validation.property.test.ts
│       ├── gallery.property.test.ts
│       ├── share.property.test.ts
│       └── api.property.test.ts
```

### Unit Test Coverage
- Component rendering with various props
- Hook state transitions
- API client request/response handling
- Error boundary behavior

### Property Test Coverage
- File validation logic (Property 1)
- Pagination correctness (Property 6)
- Filter correctness (Property 8)
- Share URL generation (Property 9)
- API error handling (Property 11)

## Visual Design

### Color Palette (Tailwind)
```css
/* Dark theme colors */
--bg-primary: #0d0d0d;      /* Near black */
--bg-secondary: #1a1a2e;    /* Dark purple-gray */
--bg-card: #16213e;         /* Dark blue */
--accent-green: #00ff41;    /* Matrix green */
--accent-purple: #9d4edd;   /* Spectral purple */
--accent-orange: #ff6b35;   /* Pumpkin orange */
--text-primary: #e0e0e0;    /* Light gray */
--text-muted: #888888;      /* Muted gray */
```

### Typography
- Headers: System sans-serif, bold, tracking-tight
- Body: System sans-serif, normal weight
- Code/Mono: System monospace for technical details

### Component Styling
- Cards: Dark background with subtle border glow
- Buttons: Gradient backgrounds with hover effects
- Inputs: Dark with green/purple focus rings
- Badges: Colored pills for status/type indicators

### Layout
- Max width: 1280px centered
- Responsive breakpoints: 640px, 768px, 1024px, 1280px
- Grid: CSS Grid for gallery, Flexbox for layouts
