/**
 * NecroNet API Client
 * Handles all communication with the FastAPI backend
 * Includes curator-voiced error messages and typed responses
 */

import type { Artifact, ArtifactsListResponse, ApiError, MigrationPlan } from './types';

// API base URL from environment or default to localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Curator-voiced error messages
const ERROR_MESSAGES = {
  network: '😢 The spirits are restless... Connection lost. Please try again.',
  notFound: '👻 This artifact has vanished into the void...',
  server: '🎃 Something corrupted in the crypt. Try again?',
  timeout: '⏳ The ghost curator is taking too long...',
  unknown: '😢 An unknown force disrupted the resurrection...',
};

/**
 * Create a typed API error from response
 */
async function createApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return {
      detail: data.detail || ERROR_MESSAGES.unknown,
      status: response.status,
    };
  } catch {
    return {
      detail: response.status === 404 ? ERROR_MESSAGES.notFound : ERROR_MESSAGES.server,
      status: response.status,
    };
  }
}

/**
 * Upload an artifact file with progress tracking
 * Uses XMLHttpRequest for progress events
 */
export async function uploadArtifact(
  file: File,
  onProgress?: (percent: number) => void
): Promise<Artifact> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const artifact = JSON.parse(xhr.responseText) as Artifact;
          resolve(artifact);
        } catch {
          reject({ detail: ERROR_MESSAGES.server, status: xhr.status } as ApiError);
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject({ detail: error.detail || ERROR_MESSAGES.server, status: xhr.status } as ApiError);
        } catch {
          reject({ detail: ERROR_MESSAGES.server, status: xhr.status } as ApiError);
        }
      }
    });

    // Handle network errors
    xhr.addEventListener('error', () => {
      reject({ detail: ERROR_MESSAGES.network, status: 0 } as ApiError);
    });

    // Handle timeout
    xhr.addEventListener('timeout', () => {
      reject({ detail: ERROR_MESSAGES.timeout, status: 0 } as ApiError);
    });

    // Send request
    xhr.open('POST', `${API_BASE}/api/artifacts/upload`);
    xhr.timeout = 120000; // 2 minute timeout for large files
    xhr.send(formData);
  });
}

/**
 * Get a single artifact by ID
 */
export async function getArtifact(id: string): Promise<Artifact> {
  try {
    const response = await fetch(`${API_BASE}/api/artifacts/${id}`);
    
    if (!response.ok) {
      throw await createApiError(response);
    }
    
    return await response.json() as Artifact;
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      throw error;
    }
    throw { detail: ERROR_MESSAGES.network, status: 0 } as ApiError;
  }
}

/**
 * List artifacts with pagination
 */
export async function listArtifacts(
  limit: number = 20,
  offset: number = 0
): Promise<ArtifactsListResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    const response = await fetch(`${API_BASE}/api/artifacts?${params}`);
    
    if (!response.ok) {
      throw await createApiError(response);
    }
    
    return await response.json() as ArtifactsListResponse;
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      throw error;
    }
    throw { detail: ERROR_MESSAGES.network, status: 0 } as ApiError;
  }
}

/**
 * Get migration plan for an artifact type
 */
export async function getMigrationPlan(
  name: string,
  artifactType: string
): Promise<MigrationPlan> {
  try {
    const response = await fetch(`${API_BASE}/api/artifacts/migrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, artifact_type: artifactType }),
    });
    
    if (!response.ok) {
      throw await createApiError(response);
    }
    
    return await response.json() as MigrationPlan;
  } catch (error) {
    if ((error as ApiError).status !== undefined) {
      throw error;
    }
    throw { detail: ERROR_MESSAGES.network, status: 0 } as ApiError;
  }
}

/**
 * Poll for migration status with backoff
 * Polls every 2 seconds initially, with exponential backoff up to 10 seconds
 */
export async function pollMigrationStatus(
  id: string,
  onStatusChange: (artifact: Artifact) => void,
  maxAttempts: number = 60
): Promise<Artifact> {
  let attempts = 0;
  let interval = 2000; // Start at 2 seconds
  const maxInterval = 10000; // Max 10 seconds

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const artifact = await getArtifact(id);
        onStatusChange(artifact);

        // Check if migration is complete
        if (artifact.status === 'ready' || artifact.status === 'failed') {
          resolve(artifact);
          return;
        }

        // Continue polling if still migrating
        attempts++;
        if (attempts >= maxAttempts) {
          reject({ detail: ERROR_MESSAGES.timeout, status: 0 } as ApiError);
          return;
        }

        // Exponential backoff (increase by 1.5x each time, capped at maxInterval)
        interval = Math.min(interval * 1.5, maxInterval);
        setTimeout(poll, interval);
      } catch (error) {
        reject(error);
      }
    };

    // Start polling
    poll();
  });
}

/**
 * Build S3 URL from storage key
 * Hardcoded for demo: necronet-artifacts-linford in eu-north-1
 */
export function getStorageUrl(storageKey: string): string {
  // Hardcoded for demo
  const bucket = 'necronet-artifacts-linford';
  const region = 'eu-north-1';
  
  return `https://${bucket}.s3.${region}.amazonaws.com/${storageKey}`;
}
