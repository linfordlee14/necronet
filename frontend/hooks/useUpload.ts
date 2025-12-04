'use client';

/**
 * useUpload Hook
 * Handles file upload with progress tracking and validation
 * Returns upload function, progress state, and reset function
 */

import { useState, useCallback } from 'react';
import { uploadArtifact } from '@/lib/api';
import { validateFile } from '@/lib/validation';
import type { Artifact, UploadProgress, ApiError } from '@/lib/types';

interface UseUploadReturn {
  upload: (file: File) => Promise<Artifact | null>;
  progress: UploadProgress;
  reset: () => void;
  artifact: Artifact | null;
}

const initialProgress: UploadProgress = {
  percent: 0,
  status: 'idle',
};

export function useUpload(): UseUploadReturn {
  const [progress, setProgress] = useState<UploadProgress>(initialProgress);
  const [artifact, setArtifact] = useState<Artifact | null>(null);

  const reset = useCallback(() => {
    setProgress(initialProgress);
    setArtifact(null);
  }, []);

  const upload = useCallback(async (file: File): Promise<Artifact | null> => {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      setProgress({
        percent: 0,
        status: 'error',
        error: validation.error,
      });
      return null;
    }

    // Start upload
    setProgress({ percent: 0, status: 'uploading' });
    setArtifact(null);

    try {
      const result = await uploadArtifact(file, (percent) => {
        setProgress({ percent, status: 'uploading' });
      });

      setProgress({ percent: 100, status: 'success' });
      setArtifact(result);
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setProgress({
        percent: 0,
        status: 'error',
        error: apiError.detail || '😢 Upload failed. Please try again.',
      });
      return null;
    }
  }, []);

  return { upload, progress, reset, artifact };
}
