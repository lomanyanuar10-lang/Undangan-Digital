import React from 'react';

export const BismillahCalligraphy: React.FC<{ className?: string }> = ({ className = 'h-14' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <span className="font-arabic text-2xl sm:text-3xl text-amber-300 drop-shadow-[0_2px_8px_rgba(217,119,6,0.5)] select-none">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </span>
      <span className="text-[11px] tracking-widest uppercase text-amber-200/70 mt-1 font-medium">
        Bismillahir-Rahmanir-Rahim
      </span>
    </div>
  );
};

export const GoldIslamicDivider: React.FC<{ className?: string }> = ({ className = 'my-4' }) => {
  return (
    <div className={`flex items-center justify-center space-x-3 w-full max-w-xs mx-auto ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400" />
      <div className="flex items-center justify-center text-amber-400">
        <svg className="w-4 h-4 text-amber-400 animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
        </svg>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400" />
    </div>
  );
};

export const MosqueArchFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-t-[48px] rounded-b-2xl border border-amber-400/30 bg-gradient-to-b from-emerald-900/90 via-emerald-950/95 to-emerald-950 p-6 sm:p-8 backdrop-blur-md shadow-2xl overflow-hidden ${className}`}
    >
      {/* Top Islamic Arch Archway Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 border-b border-l border-r border-amber-400/40 rounded-b-full bg-emerald-950/60 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/40 rounded-tl" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/40 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/40 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/40 rounded-br" />

      {children}
    </div>
  );
};

export const LanternSilhouette: React.FC<{ className?: string }> = ({ className = 'w-8 h-14' }) => {
  return (
    <svg className={className} viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hanging string */}
      <line x1="20" y1="0" x2="20" y2="16" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Top ring */}
      <circle cx="20" cy="18" r="4" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Cap */}
      <path d="M12 24 L20 18 L28 24 Z" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
      {/* Body glass */}
      <path
        d="M10 24 L6 48 L14 62 L26 62 L34 48 L30 24 Z"
        fill="rgba(251, 191, 36, 0.15)"
        stroke="#fbbf24"
        strokeWidth="1.5"
      />
      {/* Inner glow */}
      <circle cx="20" cy="42" r="6" fill="#fef08a" className="animate-pulse" />
      {/* Base & tassel */}
      <path d="M14 62 L20 70 L26 62 Z" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
      <line x1="20" y1="70" x2="20" y2="78" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="20" cy="78" r="1.5" fill="#fbbf24" />
    </svg>
  );
};

export const CrescentStarIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8 text-amber-400' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.39-4.32-.97-7.58-4.84-7.58-9.61s3.26-8.64 7.58-9.61C15.58 2.5 13.85 2 12 2zm6 4l1.25 2.75L22 10l-2.75 1.25L18 14l-1.25-2.75L14 10l2.75-1.25L18 6z" />
    </svg>
  );
};
