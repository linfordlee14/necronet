/**
 * NecroNet File Validation
 * Validates uploaded files for type and size constraints
 * Returns curator-voiced error messages
 */

import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE, type ValidationResult } from './types';

// Curator-voiced validation error messages
const VALIDATION_ERRORS = {
  noFile: '👻 No artifact detected. Please select a file.',
  invalidType: '📜 Only ancient relics accepted (swf, html, images, zip)',
  tooLarge: '🎃 This artifact is too heavy for our museum (max 50MB)',
  emptyFile: '👻 This artifact appears to be empty...',
};

/**
 * Get file extension from filename (lowercase, with dot)
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Check if file extension is in allowed list
 */
export function isAllowedExtension(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ALLOWED_EXTENSIONS.includes(ext as typeof ALLOWED_EXTENSIONS[number]);
}

/**
 * Check if file size is within limit
 */
export function isWithinSizeLimit(size: number): boolean {
  return size > 0 && size <= MAX_FILE_SIZE;
}

/**
 * Validate a file for upload
 * Returns validation result with curator-voiced error message if invalid
 */
export function validateFile(file: File | null | undefined): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: VALIDATION_ERRORS.noFile };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: VALIDATION_ERRORS.emptyFile };
  }

  // Check file size
  if (!isWithinSizeLimit(file.size)) {
    return { valid: false, error: VALIDATION_ERRORS.tooLarge };
  }

  // Check file extension
  if (!isAllowedExtension(file.name)) {
    return { valid: false, error: VALIDATION_ERRORS.invalidType };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get artifact type from file extension
 */
export function getArtifactTypeFromFile(filename: string): string {
  const ext = getFileExtension(filename);
  
  if (ext === '.swf') return 'flash';
  if (['.html', '.htm'].includes(ext)) return 'html';
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) return 'image';
  if (['.zip', '.tar', '.gz'].includes(ext)) return 'archive';
  return 'other';
}
