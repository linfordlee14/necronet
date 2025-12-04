'use client';

/**
 * useArtifacts Hook
 * Fetches paginated artifact list with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { listArtifacts } from '@/lib/api';
import type { Artifact, ApiError } from '@/lib/types';

interface UseArtifactsReturn {
  artifacts: Artifact[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useArtifacts(
  limit: number = 20,
  initialOffset: number = 0
): UseArtifactsReturn {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(initialOffset);

  const fetchArtifacts = useCallback(async (reset: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await listArtifacts(limit, currentOffset);
      
      if (reset) {
        setArtifacts(response.artifacts);
        setOffset(limit);
      } else {
        setArtifacts((prev: Artifact[]) => [...prev, ...response.artifacts]);
        setOffset((prev: number) => prev + limit);
      }
      
      setTotal(response.total);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || '😢 Failed to load artifacts.');
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  // Initial fetch
  useEffect(() => {
    fetchArtifacts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(() => {
    setOffset(0);
    fetchArtifacts(true);
  }, [fetchArtifacts]);

  const loadMore = useCallback(() => {
    if (!loading && artifacts.length < total) {
      fetchArtifacts(false);
    }
  }, [loading, artifacts.length, total, fetchArtifacts]);

  const hasMore = artifacts.length < total;

  return { artifacts, loading, error, total, refetch, loadMore, hasMore };
}
