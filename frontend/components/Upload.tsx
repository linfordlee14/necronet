'use client';

/**
 * Upload Component
 * Spooky drag-drop portal for resurrecting artifacts
 * Features: drag-drop zone, progress bar, success/error toasts
 */

import { useState, useCallback, useRef } from 'react';
import { useUpload } from '@/hooks/useUpload';
import { validateFile, formatFileSize } from '@/lib/validation';
import type { Artifact } from '@/lib/types';

interface UploadProps {
  onUploadComplete?: (artifact: Artifact) => void;
}

export function Upload({ onUploadComplete }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, reset, artifact } = useUpload();

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const validation = validateFile(file);
    if (validation.valid) {
      setSelectedFile(file);
      reset();
    } else {
      // Show validation error
      setSelectedFile(null);
      alert(validation.error);
    }
  }, [reset]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    const result = await upload(selectedFile);
    if (result && onUploadComplete) {
      onUploadComplete(result);
      setSelectedFile(null);
    }
  }, [selectedFile, upload, onUploadComplete]);

  // Reset everything
  const handleReset = useCallback(() => {
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [reset]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone - The Portal */}
      <div
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500
          ${isDragging 
            ? 'border-necro-green bg-necro-green/10 scale-105 shadow-[0_0_40px_rgba(0,255,65,0.3)]' 
            : 'border-necro-muted/50 bg-necro-card/50 hover:border-necro-purple/50 hover:bg-necro-card'
          }
          ${progress.status === 'uploading' ? 'pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload artifact"
        onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        {/* Spooky background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-necro-purple/5 to-necro-green/5 pointer-events-none" />
        
        {/* Tombstone-style content */}
        <div className="relative p-8 sm:p-12 text-center">
          {/* Ghost icon */}
          <div className={`text-6xl mb-4 ${isDragging ? 'animate-bounce' : 'animate-ghost-float'}`}>
            {progress.status === 'success' ? '✅' : progress.status === 'error' ? '💀' : '👻'}
          </div>

          {/* Main text */}
          {progress.status === 'idle' && !selectedFile && (
            <>
              <h3 className="text-xl font-semibold text-necro-text mb-2">
                Drag your digital ghost here...
              </h3>
              <p className="text-necro-muted text-sm mb-4">
                or click to browse the crypt
              </p>
              <p className="text-necro-muted/60 text-xs">
                Accepts: .swf, .html, .htm, images, .zip (max 50MB)
              </p>
            </>
          )}

          {/* Selected file info */}
          {selectedFile && progress.status === 'idle' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-necro-surface rounded-lg">
                <span className="text-2xl">📜</span>
                <div className="text-left">
                  <p className="text-necro-text font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-necro-muted text-xs">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleUpload(); }}
                  className="btn-primary"
                >
                  🎃 Resurrect Artifact
                </button>
                <button
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleReset(); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Upload progress */}
          {progress.status === 'uploading' && (
            <div className="space-y-4">
              <p className="text-necro-green font-medium">
                🔮 Channeling artifact... {progress.percent}%
              </p>
              <div className="progress-bar max-w-xs mx-auto">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Success state */}
          {progress.status === 'success' && artifact && (
            <div className="space-y-4">
              <p className="text-necro-green font-medium">
                ✅ Artifact resurrected! Welcome to the museum.
              </p>
              <p className="text-necro-muted text-sm">
                The ghost curator is now analyzing your relic...
              </p>
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleReset(); }}
                className="btn-secondary"
              >
                Upload Another
              </button>
            </div>
          )}

          {/* Error state */}
          {progress.status === 'error' && (
            <div className="space-y-4">
              <p className="text-red-400 font-medium">
                {progress.error || '😢 Something went wrong...'}
              </p>
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleReset(); }}
                className="btn-secondary"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".swf,.html,.htm,.png,.jpg,.jpeg,.gif,.webp,.zip"
          onChange={handleInputChange}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
