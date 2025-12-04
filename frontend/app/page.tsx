'use client';

/**
 * NecroNet Landing Page
 * Museum entrance with upload portal and artifact gallery
 */

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Upload } from '@/components/Upload';
import { Gallery } from '@/components/Gallery';
import type { Artifact } from '@/lib/types';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh gallery when new artifact is uploaded
  const handleUploadComplete = useCallback((artifact: Artifact) => {
    console.log('🎃 New artifact uploaded:', artifact.name);
    // Trigger gallery refresh
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-necro-purple/10 via-transparent to-necro-green/5 pointer-events-none" />
          <div className="absolute top-20 left-10 w-64 h-64 bg-necro-purple/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-necro-green/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-necro-text">🎃 NecroNet</span>
              </h1>
              <p className="text-xl sm:text-2xl text-necro-purple font-medium mb-2">
                Resurrecting Dead Tech
              </p>
              <p className="text-necro-muted max-w-2xl mx-auto">
                Upload obsolete web artifacts. AI resurrects them. 
                Experience the museum of digital ghosts.
              </p>
            </div>

            {/* Upload Portal */}
            <Upload onUploadComplete={handleUploadComplete} />
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-12 sm:py-16 bg-necro-surface/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-necro-text">
                  👻 Museum Gallery
                </h2>
                <p className="text-necro-muted mt-1">
                  Browse resurrected artifacts from the digital crypt
                </p>
              </div>
            </div>

            <Gallery key={refreshKey} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-necro-text text-center mb-12">
              ✨ How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="card text-center">
                <div className="text-4xl mb-4">📤</div>
                <h3 className="text-lg font-semibold text-necro-text mb-2">
                  1. Upload Artifact
                </h3>
                <p className="text-necro-muted text-sm">
                  Drag your Flash .swf, HTML pages, or images into the portal
                </p>
              </div>

              {/* Step 2 */}
              <div className="card text-center">
                <div className="text-4xl mb-4">🔮</div>
                <h3 className="text-lg font-semibold text-necro-text mb-2">
                  2. AI Resurrection
                </h3>
                <p className="text-necro-muted text-sm">
                  Our ghost curator analyzes and migrates your artifact
                </p>
              </div>

              {/* Step 3 */}
              <div className="card text-center">
                <div className="text-4xl mb-4">🎧</div>
                <h3 className="text-lg font-semibold text-necro-text mb-2">
                  3. Experience & Share
                </h3>
                <p className="text-necro-muted text-sm">
                  Play the artifact with narration and share with the world
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Formats */}
        <section className="py-12 sm:py-16 bg-necro-surface/30">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-xl font-semibold text-necro-text mb-6">
              📜 Supported Artifact Types
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="badge badge-flash px-4 py-2">⚡ Flash (.swf)</span>
              <span className="badge badge-html px-4 py-2">📄 HTML (.html, .htm)</span>
              <span className="badge badge-image px-4 py-2">🖼️ Images (.png, .jpg, .gif, .webp)</span>
              <span className="badge badge-html px-4 py-2">📦 Archives (.zip)</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
