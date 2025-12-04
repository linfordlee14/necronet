'use client';

/**
 * Gallery Component
 * Museum gallery displaying artifacts as tombstone-style plaques
 * Features: filtering, pagination, status badges
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useArtifacts } from '@/hooks/useArtifacts';
import { LoadingSpinner } from './LoadingSpinner';
import type { Artifact, ArtifactType } from '@/lib/types';
import { 
  TYPE_BADGE_CLASSES, 
  STATUS_BADGE_CLASSES, 
  STATUS_DISPLAY, 
  TYPE_DISPLAY 
} from '@/lib/types';

interface GalleryProps {
  initialArtifacts?: Artifact[];
}

type FilterType = 'all' | ArtifactType;

export function Gallery({ initialArtifacts }: GalleryProps) {
  const { artifacts, loading, error, refetch, loadMore, hasMore } = useArtifacts(20);
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter artifacts by type
  const filteredArtifacts = useMemo(() => {
    const items = initialArtifacts || artifacts;
    if (filter === 'all') return items;
    return items.filter((a) => a.artifact_type === filter);
  }, [artifacts, initialArtifacts, filter]);

  // Loading state
  if (loading && artifacts.length === 0) {
    return (
      <div className="py-12">
        <LoadingSpinner message="🎃 Summoning artifacts from the crypt..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="text-4xl mb-4">💀</div>
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={refetch} className="btn-secondary">
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (filteredArtifacts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-6xl mb-4 animate-ghost-float">📜</div>
        <h3 className="text-xl font-semibold text-necro-text mb-2">
          No artifacts yet
        </h3>
        <p className="text-necro-muted">
          Be the first to resurrect dead tech!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-necro-muted text-sm">Filter:</span>
        {(['all', 'flash', 'html', 'image'] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`
              px-3 py-1 rounded-full text-sm transition-all
              ${filter === type 
                ? 'bg-necro-purple text-white' 
                : 'bg-necro-surface text-necro-muted hover:bg-necro-card hover:text-necro-text'
              }
            `}
          >
            {type === 'all' ? '👁️ All' : TYPE_DISPLAY[type]}
          </button>
        ))}
      </div>

      {/* Artifact grid - tombstone style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArtifacts.map((artifact) => (
          <ArtifactCard key={artifact.artifact_id} artifact={artifact} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? '🔮 Loading...' : '👻 Summon More Artifacts'}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * ArtifactCard Component
 * Individual tombstone-style museum plaque
 */
function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const formattedDate = new Date(artifact.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      href={`/artifacts/${artifact.artifact_id}`}
      className="group block"
    >
      <article className="
        relative overflow-hidden rounded-xl 
        bg-gradient-to-b from-necro-card to-necro-surface
        border border-necro-muted/20
        transition-all duration-300
        hover:border-necro-purple/50 hover:shadow-[0_0_30px_rgba(157,78,221,0.2)]
        hover:-translate-y-1
      ">
        {/* Tombstone top arch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-necro-surface rounded-b-full opacity-50" />
        
        {/* Content */}
        <div className="relative p-6 pt-8">
          {/* Type icon */}
          <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">
            {artifact.artifact_type === 'flash' && '⚡'}
            {artifact.artifact_type === 'html' && '📄'}
            {artifact.artifact_type === 'image' && '🖼️'}
            {artifact.artifact_type === 'archive' && '📦'}
            {artifact.artifact_type === 'other' && '📁'}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-necro-text text-center truncate mb-2 group-hover:text-necro-green transition-colors">
            {artifact.name}
          </h3>

          {/* Badges */}
          <div className="flex justify-center gap-2 mb-3">
            <span className={`badge ${TYPE_BADGE_CLASSES[artifact.artifact_type]}`}>
              {TYPE_DISPLAY[artifact.artifact_type]}
            </span>
            <span className={`badge ${STATUS_BADGE_CLASSES[artifact.status]}`}>
              {STATUS_DISPLAY[artifact.status]}
            </span>
          </div>

          {/* Date - like a tombstone inscription */}
          <p className="text-necro-muted/60 text-xs text-center">
            Resurrected {formattedDate}
          </p>

          {/* Narration indicator */}
          {artifact.ghost_narration_url && (
            <div className="absolute top-3 right-3">
              <span className="text-lg" title="Ghost narration available">🔊</span>
            </div>
          )}
        </div>

        {/* Bottom decorative line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-necro-purple/50 to-transparent" />
      </article>
    </Link>
  );
}
