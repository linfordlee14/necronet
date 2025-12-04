/**
 * NecroNet Frontend Type Definitions
 * TypeScript interfaces for artifact management and API communication
 */

// Artifact status - tracks migration pipeline state
export type ArtifactStatus = 'uploaded' | 'migrating' | 'ready' | 'failed';

// Artifact type - determines rendering strategy
export type ArtifactType = 'flash' | 'html' | 'image' | 'archive' | 'other';

// Core artifact interface - matches backend ArtifactResponse
export interface Artifact {
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

// Upload progress tracking for UI feedback
export interface UploadProgress {
  percent: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Migration plan from API - used for status display
export interface MigrationPlan {
  artifact_id: string;
  artifact_type: ArtifactType;
  strategy: string;
  steps: string[];
  estimated_duration_seconds: number;
}

// API response for artifact list endpoint
export interface ArtifactsListResponse {
  artifacts: Artifact[];
  total: number;
}

// Typed API error for consistent error handling
export interface ApiError {
  detail: string;
  status: number;
}

// File validation result
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Allowed file extensions for upload
export const ALLOWED_EXTENSIONS = [
  '.swf',
  '.html',
  '.htm',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.zip',
] as const;

// Maximum file size (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Type badge colors mapping
export const TYPE_BADGE_CLASSES: Record<ArtifactType, string> = {
  flash: 'badge-flash',
  html: 'badge-html',
  image: 'badge-image',
  archive: 'badge-html',
  other: 'badge-html',
};

// Status badge classes mapping
export const STATUS_BADGE_CLASSES: Record<ArtifactStatus, string> = {
  uploaded: 'badge-migrating',
  migrating: 'badge-migrating',
  ready: 'badge-ready',
  failed: 'badge-failed',
};

// Status display text with curator voice
export const STATUS_DISPLAY: Record<ArtifactStatus, string> = {
  uploaded: '📤 Uploaded',
  migrating: '🔄 Resurrecting...',
  ready: '✅ Ready',
  failed: '❌ Failed',
};

// Type display text
export const TYPE_DISPLAY: Record<ArtifactType, string> = {
  flash: '⚡ Flash',
  html: '📄 HTML',
  image: '🖼️ Image',
  archive: '📦 Archive',
  other: '📁 Other',
};
