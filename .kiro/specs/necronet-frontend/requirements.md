# Requirements Document

## Introduction

NecroNet Frontend is a Next.js + React + TypeScript web application that provides a spooky museum experience for resurrecting obsolete web artifacts. Users can upload legacy files (Flash .swf, GeoCities HTML, images), view them in an interactive exhibit with AI-generated ghost narration, and share their discoveries. The UI follows a dark, haunted museum aesthetic with the "Ghost Curator" persona throughout all copy.

## Glossary

- **Artifact**: A legacy web file (Flash .swf, HTML, image) uploaded for resurrection
- **Ghost Curator**: The AI-powered narrator persona that provides spooky commentary
- **Exhibit**: A single artifact's display page with playback, narration, and sharing
- **Gallery**: The collection view showing all uploaded artifacts
- **Ruffle**: WebAssembly-based Flash emulator for playing .swf files in modern browsers
- **Migration**: The process of converting/emulating legacy artifacts for modern playback
- **Narration**: AI-generated audio commentary about an artifact's history

## Requirements

### Requirement 1

**User Story:** As a visitor, I want to upload obsolete web artifacts, so that I can resurrect and preserve dead tech in the museum.

#### Acceptance Criteria

1. WHEN a user drags a file onto the upload zone THEN the Upload component SHALL display visual feedback indicating the drop target is active
2. WHEN a user selects a file via drag-drop or file browser THEN the Upload component SHALL validate file type (swf, html, htm, png, jpg, jpeg, gif, webp, zip) and size (max 50MB)
3. WHEN a valid file is selected THEN the Upload component SHALL display a progress bar showing upload percentage
4. WHEN the upload completes successfully THEN the Upload component SHALL display a success toast with curator voice ("🎃 Artifact resurrected!")
5. WHEN the upload fails THEN the Upload component SHALL display an error toast with curator voice ("😢 This artifact seems corrupted...")
6. WHEN a user attempts to upload an invalid file type THEN the Upload component SHALL reject the file and display a validation error

### Requirement 2

**User Story:** As a visitor, I want to view artifacts in an interactive exhibit, so that I can experience the resurrected content with context and narration.

#### Acceptance Criteria

1. WHEN a user navigates to an exhibit page THEN the ExhibitPlayer component SHALL fetch and display artifact metadata (name, type, status, created date)
2. WHEN viewing a Flash artifact THEN the ExhibitPlayer component SHALL embed Ruffle player from CDN and load the .swf file
3. WHEN viewing an HTML artifact THEN the ExhibitPlayer component SHALL render content in a sandboxed iframe
4. WHEN viewing an image artifact THEN the ExhibitPlayer component SHALL display the image in a gallery view with zoom capability
5. WHEN ghost narration is available THEN the ExhibitPlayer component SHALL display an audio player with play/pause controls and a transcript below
6. WHEN the artifact status is "migrating" THEN the ExhibitPlayer component SHALL poll the API every 2 seconds until status changes to "ready" or "failed"

### Requirement 3

**User Story:** As a visitor, I want to browse all artifacts in a gallery, so that I can discover and explore the museum collection.

#### Acceptance Criteria

1. WHEN a user visits the landing page THEN the Gallery component SHALL fetch and display artifacts with pagination (20 per page)
2. WHEN artifacts are displayed THEN the Gallery component SHALL show thumbnail, name, type badge, and status indicator for each artifact
3. WHEN a user clicks an artifact card THEN the Gallery component SHALL navigate to that artifact's exhibit page
4. WHEN no artifacts exist THEN the Gallery component SHALL display an empty state with curator voice ("📜 No artifacts yet. Be the first to resurrect dead tech!")
5. WHEN artifacts are loading THEN the Gallery component SHALL display a loading spinner with curator voice ("🎃 Ghost curator analyzing...")
6. WHEN a user filters by artifact type THEN the Gallery component SHALL display only artifacts matching the selected type (Flash, HTML, Image)

### Requirement 4

**User Story:** As a visitor, I want to share resurrected artifacts on social media, so that I can spread awareness of digital preservation.

#### Acceptance Criteria

1. WHEN a user clicks the Twitter/X share button THEN the ShareButtons component SHALL open a new window with pre-filled tweet containing artifact title and exhibit URL
2. WHEN a user clicks the LinkedIn share button THEN the ShareButtons component SHALL open a new window with pre-filled post containing artifact description and exhibit URL
3. WHEN a user clicks the Email share button THEN the ShareButtons component SHALL open mailto link with pre-filled subject and body containing artifact details
4. WHEN generating share text THEN the ShareButtons component SHALL include curator voice ("🎃 Check out this resurrected artifact...")

### Requirement 5

**User Story:** As a visitor, I want a spooky, accessible dark-themed interface, so that I can enjoy the museum experience on any device.

#### Acceptance Criteria

1. WHEN the application loads THEN the UI SHALL render with dark mode as default (charcoal background, green/purple accents, white text)
2. WHEN viewing on mobile devices (width < 768px) THEN the UI SHALL adapt layout responsively without horizontal scrolling
3. WHEN interactive elements receive focus THEN the UI SHALL display visible focus indicators meeting WCAG 2.1 AA contrast requirements
4. WHEN images are displayed THEN the UI SHALL include descriptive alt text for screen readers
5. WHEN loading states occur THEN the LoadingSpinner component SHALL display a spooky animated spinner

### Requirement 6

**User Story:** As a developer, I want a well-structured API client and type system, so that I can maintain and extend the frontend reliably.

#### Acceptance Criteria

1. WHEN making API requests THEN the api client SHALL handle network errors gracefully and return typed responses
2. WHEN API responses are received THEN the api client SHALL validate response structure against TypeScript interfaces
3. WHEN an API call fails THEN the api client SHALL provide meaningful error messages for UI display
4. WHEN polling for migration status THEN the api client SHALL implement exponential backoff to prevent server overload
