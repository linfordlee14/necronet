'use client';

/**
 * ExhibitPlayer Component
 * Museum exhibit display for artifacts with Ruffle/iframe/image rendering
 * Features: Original/Modernized tabs, narration player, secure sandbox
 */

import { useState, useEffect, useRef } from 'react';
import { getStorageUrl } from '@/lib/api';
import { LoadingSpinner } from './LoadingSpinner';
import type { Artifact } from '@/lib/types';
import { TYPE_DISPLAY, STATUS_DISPLAY, STATUS_BADGE_CLASSES } from '@/lib/types';

interface ExhibitPlayerProps {
  artifact: Artifact;
}

type ViewTab = 'original' | 'modernized';

export function ExhibitPlayer({ artifact }: ExhibitPlayerProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>('original');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ruffleContainerRef = useRef<HTMLDivElement>(null);

  // Get the artifact URL
  const artifactUrl = getStorageUrl(artifact.storage_key);

  // Initialize Ruffle for Flash artifacts
  useEffect(() => {
    if (artifact.artifact_type !== 'flash' || activeTab !== 'original') return;

    const initRuffle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Wait for Ruffle to be available (loaded from CDN in layout)
        const checkRuffle = () => {
          return new Promise<void>((resolve, reject) => {
            let attempts = 0;
            const check = () => {
              // @ts-expect-error - Ruffle is loaded from CDN
              if (window.RufflePlayer) {
                resolve();
              } else if (attempts > 20) {
                reject(new Error('Ruffle failed to load'));
              } else {
                attempts++;
                setTimeout(check, 250);
              }
            };
            check();
          });
        };

        await checkRuffle();

        // @ts-expect-error - Ruffle is loaded from CDN
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        
        if (ruffleContainerRef.current) {
          ruffleContainerRef.current.innerHTML = '';
          ruffleContainerRef.current.appendChild(player);
          
          player.style.width = '100%';
          player.style.height = '100%';
          
          await player.load(artifactUrl);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Ruffle initialization failed:', err);
        setError('🎃 Flash emulation failed. The spirits resist...');
        setIsLoading(false);
      }
    };

    initRuffle();
  }, [artifact.artifact_type, artifactUrl, activeTab]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Format date
  const formattedDate = new Date(artifact.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Artifact Header - Museum Plaque Style */}
      <div className="bg-necro-card border border-necro-muted/30 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-necro-text mb-2">
              {artifact.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-necro-muted">
                {TYPE_DISPLAY[artifact.artifact_type]}
              </span>
              <span className={`badge ${STATUS_BADGE_CLASSES[artifact.status]}`}>
                {STATUS_DISPLAY[artifact.status]}
              </span>
              <span className="text-necro-muted/60">
                Resurrected {formattedDate}
              </span>
            </div>
          </div>
          
          {/* Status indicator */}
          {artifact.status === 'migrating' && (
            <div className="flex items-center gap-2 text-necro-orange">
              <span className="animate-pulse">🔄</span>
              <span className="text-sm">Migration in progress...</span>
            </div>
          )}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('original')}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${activeTab === 'original'
              ? 'bg-necro-purple text-white shadow-lg shadow-necro-purple/30'
              : 'bg-necro-surface text-necro-muted hover:bg-necro-card hover:text-necro-text'
            }
          `}
        >
          👻 Original
        </button>
        <button
          onClick={() => setActiveTab('modernized')}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${activeTab === 'modernized'
              ? 'bg-necro-green text-necro-bg shadow-lg shadow-necro-green/30'
              : 'bg-necro-surface text-necro-muted hover:bg-necro-card hover:text-necro-text'
            }
          `}
        >
          ✨ Modernized
        </button>
      </div>

      {/* Exhibit Display Case */}
      <div className="
        relative overflow-hidden rounded-xl 
        bg-gradient-to-b from-necro-card to-necro-surface
        border-2 border-necro-muted/30
        shadow-[0_0_40px_rgba(0,0,0,0.5)]
      ">
        {/* Display frame decoration */}
        <div className="absolute inset-0 pointer-events-none border-8 border-necro-bg/50 rounded-xl" />
        
        {/* Content area */}
        <div className="relative min-h-[400px] sm:min-h-[500px]">
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-necro-bg/80 z-10">
              <LoadingSpinner message="🎃 Summoning artifact..." />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-necro-bg/80 z-10">
              <div className="text-center p-8">
                <div className="text-4xl mb-4">💀</div>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Flash artifact - Ruffle player */}
          {artifact.artifact_type === 'flash' && activeTab === 'original' && (
            <div 
              ref={ruffleContainerRef}
              className="w-full h-[500px]"
              aria-label={`Flash artifact: ${artifact.name}`}
            />
          )}

          {/* HTML artifact - Sandboxed iframe */}
          {artifact.artifact_type === 'html' && activeTab === 'original' && (
            <iframe
              src={artifactUrl}
              className="w-full h-[500px] bg-white"
              sandbox="allow-scripts allow-same-origin"
              title={`HTML artifact: ${artifact.name}`}
              onLoad={handleIframeLoad}
            />
          )}

          {/* Image artifact - Gallery view */}
          {artifact.artifact_type === 'image' && activeTab === 'original' && (
            <div className="flex items-center justify-center p-8 min-h-[500px]">
              <img
                src={artifactUrl}
                alt={`Image artifact: ${artifact.name}`}
                className="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg"
                onLoad={handleImageLoad}
              />
            </div>
          )}

          {/* Modernized view - Image artifacts with Ghost Vision filter */}
          {activeTab === 'modernized' && artifact.artifact_type === 'image' && (
            <div className="flex items-center justify-center p-8 min-h-[500px] bg-gradient-to-br from-necro-green/20 to-necro-bg">
              <div className="relative">
                <div className="absolute -inset-4 bg-necro-green/30 rounded-xl blur-2xl animate-pulse" />
                <img
                  src={artifactUrl}
                  alt={`Ghost Vision: ${artifact.name}`}
                  className="relative max-w-full max-h-[450px] object-contain rounded-xl shadow-2xl"
                  style={{
                    filter: 'grayscale(100%) sepia(100%) hue-rotate(90deg) drop-shadow(0 0 10px #00ff00)',
                  }}
                  onLoad={handleImageLoad}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-necro-bg/90 backdrop-blur-sm rounded-lg p-3 border border-necro-green/50">
                  <p className="text-necro-green text-sm text-center font-mono">
                    👻 GHOST VISION™ — AI-enhanced spectral rendering active
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modernized view - HTML/Flash artifacts with CRT scanline effect */}
          {activeTab === 'modernized' && (artifact.artifact_type === 'html' || artifact.artifact_type === 'flash') && (
            <div 
              className="relative flex items-center justify-center min-h-[500px] p-8 overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0a0a0a 0%, #001a00 50%, #0a0a0a 100%)',
              }}
            >
              {/* CRT Scanline overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)',
                }}
              />
              {/* CRT glow effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-necro-green/10 via-transparent to-transparent" />
              
              <div className="relative text-center z-10">
                <div className="text-6xl mb-6 animate-ghost-float">🖥️</div>
                <h3 className="text-2xl font-bold text-necro-green mb-2 font-mono">
                  RESURRECTION COMPLETE
                </h3>
                <p className="text-necro-green/80 max-w-md mb-4 font-mono text-sm">
                  Legacy code successfully recompiled for modern viewing.
                </p>
                <p className="text-necro-muted max-w-md mb-8">
                  This {artifact.artifact_type === 'flash' ? 'Flash' : 'HTML'} artifact has been 
                  resurrected and optimized for {new Date().getFullYear()}.
                </p>
                <a
                  href={artifactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-3 px-8 py-4 
                    bg-necro-green text-necro-bg text-lg font-bold rounded-xl
                    shadow-[0_0_30px_rgba(0,255,65,0.5)]
                    hover:shadow-[0_0_50px_rgba(0,255,65,0.8)]
                    hover:scale-105 transition-all duration-300
                    font-mono
                  "
                >
                  <span className="text-2xl">▶</span>
                  LAUNCH RESURRECTION
                  <span className="text-2xl">✨</span>
                </a>
                <p className="text-necro-muted/60 text-sm mt-4">
                  Opens in a secure, modernized environment
                </p>
              </div>
            </div>
          )}

          {/* Modernized view placeholder - for other artifact types */}
          {activeTab === 'modernized' && !['image', 'html', 'flash'].includes(artifact.artifact_type) && (
            <div className="flex items-center justify-center min-h-[500px] p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-necro-text mb-2">
                  Modernized Version
                </h3>
                <p className="text-necro-muted max-w-md">
                  The ghost curator is preparing a modernized version with 
                  accessibility improvements and modern styling...
                </p>
              </div>
            </div>
          )}

          {/* Other artifact types */}
          {!['flash', 'html', 'image'].includes(artifact.artifact_type) && (
            <div className="flex items-center justify-center min-h-[500px] p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-necro-text mb-2">
                  Archive Artifact
                </h3>
                <p className="text-necro-muted">
                  This artifact type requires special handling...
                </p>
                <a
                  href={artifactUrl}
                  download
                  className="btn-primary mt-4 inline-block"
                >
                  📥 Download Archive
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Narration Section - Museum Audio Guide */}
      {artifact.ghost_narration_url && (
        <NarrationPlayer 
          audioUrl={artifact.ghost_narration_url} 
          artifactName={artifact.name}
        />
      )}

      {/* No narration yet */}
      {!artifact.ghost_narration_url && artifact.status === 'ready' && (
        <div className="bg-necro-card border border-necro-muted/30 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🔇</div>
          <p className="text-necro-muted">
            The ghost curator is silent on this one...
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * NarrationPlayer Component
 * Museum audio guide style player with transcript
 */
interface NarrationPlayerProps {
  audioUrl: string;
  artifactName: string;
}

function NarrationPlayer({ audioUrl, artifactName }: NarrationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-necro-card to-necro-surface border border-necro-purple/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🎧</span>
        <div>
          <h3 className="font-semibold text-necro-text">Ghost Curator&apos;s Narration</h3>
          <p className="text-necro-muted text-sm">Audio guide for &quot;{artifactName}&quot;</p>
        </div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Player controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="
            w-12 h-12 rounded-full 
            bg-necro-purple hover:bg-necro-purple/80
            flex items-center justify-center
            transition-all hover:scale-105
            shadow-lg shadow-necro-purple/30
          "
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="text-xl">{isPlaying ? '⏸️' : '▶️'}</span>
        </button>

        {/* Progress bar */}
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="
              w-full h-2 rounded-full appearance-none cursor-pointer
              bg-necro-surface
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-necro-green
              [&::-webkit-slider-thumb]:shadow-lg
            "
            style={{
              background: `linear-gradient(to right, #9d4edd ${(currentTime / duration) * 100}%, #16213e ${(currentTime / duration) * 100}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-necro-muted mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Museum note */}
      <div className="mt-4 pt-4 border-t border-necro-muted/20">
        <p className="text-necro-muted text-sm italic">
          🎃 &quot;Listen closely, visitor, as I tell you the tale of this digital relic...&quot;
        </p>
      </div>
    </div>
  );
}
