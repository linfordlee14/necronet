'use client';

/**
 * LoadingSpinner Component
 * Spooky ghost animation with customizable curator message
 */

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ 
  message = '🎃 Ghost curator analyzing...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8" role="status" aria-live="polite">
      {/* Floating ghost with eerie glow */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-necro-purple/20 blur-xl animate-pulse" />
        
        {/* Ghost emoji with float animation */}
        <div className={`${sizeClasses[size]} animate-ghost-float relative z-10`}>
          👻
        </div>
        
        {/* Spinning spectral ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-necro-green/30 border-t-necro-green rounded-full animate-ghost-spin" />
        </div>
      </div>
      
      {/* Curator message */}
      <p className="text-necro-muted text-center animate-pulse">
        {message}
      </p>
    </div>
  );
}
