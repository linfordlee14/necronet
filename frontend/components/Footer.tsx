'use client';

/**
 * Footer Component
 * GitHub link and Kiro badge
 */

export function Footer() {
  return (
    <footer className="border-t border-necro-muted/20 bg-necro-bg/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tagline */}
          <p className="text-necro-muted text-sm text-center sm:text-left">
            👻 Preserving digital heritage, one ghost at a time.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-necro-muted/60">
              Built with{' '}
              <span className="text-necro-purple">Kiro</span>
              {' '}for Kiroween 🎃
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-necro-muted hover:text-necro-green transition-colors text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
