# Implementation Plan

- [x] 1. Set up Next.js project structure and configuration




  - [ ] 1.1 Initialize Next.js 14 with TypeScript and Tailwind CSS
    - Create package.json with dependencies (next, react, react-dom, tailwindcss)
    - Configure tsconfig.json for strict TypeScript
    - Set up tailwind.config.js with dark theme colors


    - Create app/layout.tsx with dark mode defaults
    - _Requirements: 5.1_


  - [ ] 1.2 Create TypeScript interfaces and types
    - Create `frontend/lib/types.ts` with Artifact, UploadProgress, MigrationPlan, ApiError interfaces
    - Define ArtifactStatus and ArtifactType union types
    - _Requirements: 6.2_
  - [ ] 1.3 Create API client with error handling
    - Create `frontend/lib/api.ts` with uploadArtifact, getArtifact, listArtifacts functions





    - Implement typed error handling with curator-voiced messages
    - Add environment variable support for API_URL
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ]* 1.4 Write property tests for API error handling
    - **Property 11: API Error Handling**
    - **Validates: Requirements 6.1, 6.2, 6.3**



- [ ] 2. Implement file validation and upload utilities
  - [ ] 2.1 Create file validation utility
    - Create `frontend/lib/validation.ts` with validateFile function
    - Implement file type checking (swf, html, htm, png, jpg, jpeg, gif, webp, zip)
    - Implement file size validation (max 50MB)
    - _Requirements: 1.2, 1.6_
  - [x]* 2.2 Write property tests for file validation




    - **Property 1: File Validation Correctness**
    - **Validates: Requirements 1.2**
  - [x] 2.3 Create useUpload custom hook


    - Create `frontend/hooks/useUpload.ts`
    - Implement upload with XMLHttpRequest for progress tracking
    - Handle success/error states with curator messages

    - _Requirements: 1.3, 1.4, 1.5_
  - [ ]* 2.4 Write property tests for upload progress
    - **Property 2: Upload Progress Tracking**


    - **Validates: Requirements 1.3**

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.





- [ ] 4. Build core UI components
  - [ ] 4.1 Create LoadingSpinner component
    - Create `frontend/components/LoadingSpinner.tsx`
    - Implement spooky ghost animation with CSS


    - Accept customizable curator message prop
    - _Requirements: 5.5_
  - [ ] 4.2 Create Header component
    - Create `frontend/components/Header.tsx`
    - Add NecroNet logo and tagline
    - Implement responsive navigation
    - _Requirements: 5.1, 5.2_
  - [ ] 4.3 Create Footer component
    - Create `frontend/components/Footer.tsx`
    - Add GitHub link and "Built with Kiro" badge
    - _Requirements: 5.1_
  - [ ] 4.4 Create Upload component
    - Create `frontend/components/Upload.tsx`
    - Implement drag-drop zone with visual feedback
    - Add file input fallback button
    - Display progress bar during upload
    - Show success/error toasts with curator voice
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 5. Build Gallery and artifact listing
  - [ ] 5.1 Create useArtifacts custom hook
    - Create `frontend/hooks/useArtifacts.ts`
    - Implement pagination with limit/offset
    - Handle loading and error states
    - _Requirements: 3.1_
  - [ ] 5.2 Create Gallery component
    - Create `frontend/components/Gallery.tsx`
    - Implement responsive grid layout
    - Add artifact cards with thumbnail, name, type badge, status
    - Add type filter dropdown
    - Implement empty state with curator voice
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [ ]* 5.3 Write property tests for gallery filtering
    - **Property 8: Type Filter Correctness**
    - **Validates: Requirements 3.6**
  - [ ]* 5.4 Write property tests for pagination
    - **Property 6: Gallery Pagination Correctness**
    - **Validates: Requirements 3.1**
  - [ ]* 5.5 Write property tests for artifact card rendering
    - **Property 7: Artifact Card Rendering Completeness**
    - **Validates: Requirements 3.2**

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Build Exhibit Player and artifact detail view




  - [ ] 7.1 Create useArtifact custom hook with polling
    - Create `frontend/hooks/useArtifact.ts`
    - Implement single artifact fetch
    - Add polling for "migrating" status with backoff
    - _Requirements: 2.6, 6.4_
  - [ ]* 7.2 Write property tests for polling behavior
    - **Property 5: Migration Status Polling Behavior**
    - **Validates: Requirements 2.6**
  - [ ]* 7.3 Write property tests for polling backoff
    - **Property 12: Polling Backoff**
    - **Validates: Requirements 6.4**


  - [ ] 7.4 Create ExhibitPlayer component
    - Create `frontend/components/ExhibitPlayer.tsx`
    - Implement tab interface (Original/Modernized)
    - Add Ruffle embed for Flash artifacts
    - Add sandboxed iframe for HTML artifacts
    - Add zoomable image view for image artifacts
    - Add audio player with transcript for narration
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 7.5 Write property tests for metadata display
    - **Property 3: Artifact Metadata Display Completeness**
    - **Validates: Requirements 2.1**
  - [ ]* 7.6 Write property tests for narration rendering
    - **Property 4: Conditional Narration Rendering**



    - **Validates: Requirements 2.5**


- [ ] 8. Build ShareButtons component
  - [ ] 8.1 Create ShareButtons component
    - Create `frontend/components/ShareButtons.tsx`
    - Implement Twitter/X share with pre-filled tweet
    - Implement LinkedIn share with description
    - Implement Email share with mailto link
    - Add copy link button




    - Include curator voice in share text
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x]* 8.2 Write property tests for share URL generation

    - **Property 9: Share URL Generation**

    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Build page routes




  - [-] 10.1 Create landing page

    - Create `frontend/app/page.tsx`
    - Integrate Header, Upload, Gallery, Footer components

    - Apply dark theme styling

    - _Requirements: 5.1_
  - [ ] 10.2 Create exhibit page
    - Create `frontend/app/artifacts/[id]/page.tsx`
    - Integrate ExhibitPlayer and ShareButtons
    - Add back to gallery link
    - Handle loading and error states
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [ ]* 10.3 Write property tests for image accessibility
    - **Property 10: Image Accessibility**
    - **Validates: Requirements 5.4**

- [ ] 11. Final polish and configuration
  - [ ] 11.1 Create global styles and Tailwind configuration
    - Update `frontend/app/globals.css` with dark theme variables
    - Configure Tailwind with custom colors
    - Add spooky animations and transitions
    - _Requirements: 5.1_
  - [ ] 11.2 Add environment configuration
    - Create `frontend/.env.example` with NEXT_PUBLIC_API_URL
    - Update next.config.js for production builds
    - _Requirements: 6.1_

- [ ] 12. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
