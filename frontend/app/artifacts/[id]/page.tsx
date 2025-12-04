'use client';

/**
 * Artifact Exhibit Page
 * Individual artifact display with player, narration, and sharing
 */

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ExhibitPlayer } from '@/components/ExhibitPlayer';
import { ShareButtons } from '@/components/ShareButtons';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useArtifact } from '@/hooks/useArtifact';

export default function ExhibitPage() {
  // Get artifact ID from URL params
  const params = useParams();
  const id = params.id as string;
  
  const { artifact, loading, error } = useArtifact(id);

  // Generate exhibit URL for sharing
  const exhibitUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/artifacts/${id}`
    : '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back link */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-necro-muted hover:text-necro-green transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Museum
          </Link>

          {/* Loading state */}
          {loading && (
            <div className="py-20">
              <LoadingSpinner message="🎃 Summoning artifact from the crypt..." size="lg" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">💀</div>
              <h2 className="text-2xl font-bold text-necro-text mb-2">
                Artifact Not Found
              </h2>
              <p className="text-necro-muted mb-6">{error}</p>
              <Link href="/" className="btn-primary">
                Return to Museum
              </Link>
            </div>
          )}

          {/* Artifact display */}
          {artifact && (
            <div className="space-y-8">
              {/* Exhibit Player */}
              <ExhibitPlayer artifact={artifact} />

              {/* Share Section */}
              <ShareButtons artifact={artifact} exhibitUrl={exhibitUrl} />

              {/* Artifact Details */}
              <div className="bg-necro-card border border-necro-muted/30 rounded-xl p-6">
                <h3 className="font-semibold text-necro-text mb-4 flex items-center gap-2">
                  <span>📋</span> Artifact Details
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-necro-muted">Artifact ID</dt>
                    <dd className="text-necro-text font-mono text-xs mt-1 break-all">
                      {artifact.artifact_id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-necro-muted">Type</dt>
                    <dd className="text-necro-text mt-1">{artifact.artifact_type}</dd>
                  </div>
                  <div>
                    <dt className="text-necro-muted">Status</dt>
                    <dd className="text-necro-text mt-1">{artifact.status}</dd>
                  </div>
                  <div>
                    <dt className="text-necro-muted">Storage Key</dt>
                    <dd className="text-necro-text font-mono text-xs mt-1 break-all">
                      {artifact.storage_key}
                    </dd>
                  </div>
                  {artifact.error_message && (
                    <div className="sm:col-span-2">
                      <dt className="text-red-400">Error</dt>
                      <dd className="text-red-300 mt-1">{artifact.error_message}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Navigation */}
              <div className="flex justify-center pt-4">
                <Link 
                  href="/"
                  className="btn-secondary"
                >
                  👻 Explore More Artifacts
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
