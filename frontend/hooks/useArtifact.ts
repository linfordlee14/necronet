'use client';

/**
 * useArtifact Hook
 * Fetches single artifact with automatic polling for migration status
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getArtifact, pollMigrationStatus } from '@/lib/api';
import type { Artifact, ApiError } from '@/lib/types';

interface UseArtifactReturn {
  artifact: Artifact | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArtifact(id: string): UseArtifactReturn {
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef(false);

  const fetchArtifact = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await getArtifact(id);
      setArtifact(result);

      // Start polling if artifact is still migrating
      if (result.status === 'migrating' && !pollingRef.current) {
        pollingRef.current = true;
        
        try {
          await pollMigrationStatus(id, (updated) => {
            setArtifact(updated);
          });
        } catch (pollError) {
          // Polling timeout or error - artifact state is already set
          console.warn('Polling ended:', pollError);
        } finally {
          pollingRef.current = false;
        }
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || '👻 Failed to load artifact.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtifact();
    
    // Cleanup polling on unmount
    return () => {
      pollingRef.current = false;
    };
  }, [fetchArtifact]);

  const refetch = useCallback(() => {
    pollingRef.current = false;
    fetchArtifact();
  }, [fetchArtifact]);

  return { artifact, loading, error, refetch };
}
