'use client';

/**
 * ShareButtons Component
 * Social sharing with curator-voiced messages
 * Features: Twitter/X, LinkedIn, Email, Copy Link
 */

import { useState } from 'react';
import type { Artifact } from '@/lib/types';

interface ShareButtonsProps {
  artifact: Artifact;
  exhibitUrl: string;
}

export function ShareButtons({ artifact, exhibitUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Curator-voiced share text
  const shareTitle = `🎃 Check out this resurrected artifact: "${artifact.name}"`;
  const shareDescription = `I just discovered "${artifact.name}" in the NecroNet museum - a ${artifact.artifact_type} artifact brought back from digital death! 👻`;
  const hashtags = 'NecroNet,DigitalPreservation,Kiroween';

  // Generate Twitter/X share URL
  const getTwitterUrl = () => {
    const text = encodeURIComponent(`${shareTitle}\n\n${shareDescription}`);
    const url = encodeURIComponent(exhibitUrl);
    const tags = encodeURIComponent(hashtags);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${tags}`;
  };

  // Generate LinkedIn share URL
  const getLinkedInUrl = () => {
    const url = encodeURIComponent(exhibitUrl);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  };

  // Generate Email mailto link
  const getEmailUrl = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(
      `${shareDescription}\n\nVisit the exhibit: ${exhibitUrl}\n\n🎃 Spread the spooky love. Share this resurrected artifact!`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(exhibitUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Open share window
  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="bg-necro-card border border-necro-muted/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📢</span>
        <div>
          <h3 className="font-semibold text-necro-text">Share This Artifact</h3>
          <p className="text-necro-muted text-sm">
            🎃 Spread the spooky love!
          </p>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Twitter/X */}
        <button
          onClick={() => openShareWindow(getTwitterUrl())}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20
            text-[#1DA1F2] border border-[#1DA1F2]/30
            transition-all hover:scale-105
          "
          aria-label="Share on Twitter/X"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-sm font-medium">Twitter/X</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => openShareWindow(getLinkedInUrl())}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20
            text-[#0A66C2] border border-[#0A66C2]/30
            transition-all hover:scale-105
          "
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className="text-sm font-medium">LinkedIn</span>
        </button>

        {/* Email */}
        <a
          href={getEmailUrl()}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-necro-purple/10 hover:bg-necro-purple/20
            text-necro-purple border border-necro-purple/30
            transition-all hover:scale-105
          "
          aria-label="Share via Email"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">Email</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            transition-all hover:scale-105
            ${copied
              ? 'bg-necro-green/20 text-necro-green border border-necro-green/30'
              : 'bg-necro-surface hover:bg-necro-card text-necro-muted border border-necro-muted/30'
            }
          `}
          aria-label="Copy link to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span className="text-sm font-medium">Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Preview of share text */}
      <div className="mt-4 pt-4 border-t border-necro-muted/20">
        <p className="text-necro-muted/60 text-xs">
          Preview: &quot;{shareTitle}&quot;
        </p>
      </div>
    </div>
  );
}

/**
 * Generate share URLs for external use
 * Useful for property testing
 */
export function generateTwitterShareUrl(artifact: Artifact, exhibitUrl: string): string {
  const shareTitle = `🎃 Check out this resurrected artifact: "${artifact.name}"`;
  const shareDescription = `I just discovered "${artifact.name}" in the NecroNet museum - a ${artifact.artifact_type} artifact brought back from digital death! 👻`;
  const hashtags = 'NecroNet,DigitalPreservation,Kiroween';
  
  const text = encodeURIComponent(`${shareTitle}\n\n${shareDescription}`);
  const url = encodeURIComponent(exhibitUrl);
  const tags = encodeURIComponent(hashtags);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${tags}`;
}

export function generateLinkedInShareUrl(exhibitUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(exhibitUrl)}`;
}

export function generateEmailShareUrl(artifact: Artifact, exhibitUrl: string): string {
  const shareTitle = `🎃 Check out this resurrected artifact: "${artifact.name}"`;
  const shareDescription = `I just discovered "${artifact.name}" in the NecroNet museum - a ${artifact.artifact_type} artifact brought back from digital death! 👻`;
  
  const subject = encodeURIComponent(shareTitle);
  const body = encodeURIComponent(
    `${shareDescription}\n\nVisit the exhibit: ${exhibitUrl}\n\n🎃 Spread the spooky love. Share this resurrected artifact!`
  );
  return `mailto:?subject=${subject}&body=${body}`;
}
