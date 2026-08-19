import React, { useEffect, useState } from 'react';
import { MailOpen, Sparkles } from 'lucide-react';
import { EventData } from '../types';
import { BismillahCalligraphy, CrescentStarIcon, GoldIslamicDivider, LanternSilhouette } from './IslamicOrnaments';

interface OpeningCoverProps {
  event: EventData;
  isOpen: boolean;
  onOpen: () => void;
}

export const OpeningCover: React.FC<OpeningCoverProps> = ({ event, isOpen, onOpen }) => {
  const [recipientName, setRecipientName] = useState<string>('');

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const to = urlParams.get('to') || urlParams.get('kepada') || urlParams.get('nama') || '';
      if (to) {
        setRecipientName(to.trim());
      }
    } catch {
      // url param read safe fallback
    }
  }, []);

  if (isOpen) return null;

  return (
    <div
      id="opening-cover"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 p-4 sm:p-6 overflow-hidden transition-all duration-700 select-none"
      style={{
        backgroundImage: event.themeConfig.backgroundImageUrl
          ? `linear-gradient(to bottom, rgba(2,44,34,0.92), rgba(6,78,59,0.85)), url(${event.themeConfig.backgroundImageUrl})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Ambient background particles & Islamic pattern */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-arabesque-mesh pointer-events-none" />

      {/* Hanging Decorative Lanterns */}
      <div className="absolute top-0 left-6 sm:left-12 pointer-events-none">
        <LanternSilhouette className="w-10 sm:w-14 h-28 sm:h-36 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
      </div>
      <div className="absolute top-0 right-6 sm:right-12 pointer-events-none">
        <LanternSilhouette className="w-8 sm:w-12 h-24 sm:h-32 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
      </div>

      {/* Center Card */}
      <div className="relative w-full max-w-md mx-auto my-auto rounded-3xl border border-amber-400/30 bg-emerald-950/85 p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl shadow-black/60 flex flex-col items-center">
        {/* Top School Logos or Default Mosque Emblem */}
        {(() => {
          const activeLogos = (event.schoolLogos || []).filter((l) => l && l.trim());
          if (activeLogos.length > 0) {
            return (
              <div className="relative mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-xs sm:max-w-sm px-3.5 py-2 rounded-2xl bg-emerald-900/70 border border-amber-400/35 backdrop-blur-md shadow-lg shadow-black/40">
                {activeLogos.map((logoUrl, idx) => (
                  <div
                    key={idx}
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-amber-400/40 overflow-hidden"
                  >
                    <img
                      src={logoUrl}
                      alt={`Logo Sekolah ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            );
          }
          return (
            <div className="relative mb-3 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-900/80 border border-amber-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse-slow">
                <CrescentStarIcon className="w-9 h-9 text-amber-400" />
              </div>
            </div>
          );
        })()}

        {/* Bismillah */}
        <BismillahCalligraphy className="mb-3" />

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-3">
          Undangan Resmi
        </span>

        <h1 className="font-title text-xl sm:text-2xl font-bold text-amber-100 leading-snug drop-shadow-md">
          {event.title}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-emerald-200/90 italic font-medium max-w-xs">
          "{event.theme}"
        </p>

        <GoldIslamicDivider className="my-3" />

        {/* Date & Venue Preview */}
        <div className="text-xs text-emerald-100/80 space-y-1 mb-4">
          <p className="font-semibold text-amber-300">{event.dateStr}</p>
          <p className="line-clamp-2 text-emerald-200/70">{event.venueName}</p>
        </div>

        {/* Recipient Box */}
        <div className="w-full rounded-2xl bg-emerald-900/60 border border-amber-400/20 p-3 sm:p-4 mb-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-amber-200/70">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="text-base sm:text-lg font-bold text-amber-300 mt-0.5 truncate px-2">
            {recipientName || 'Tamu Undangan Yang Berbahagia'}
          </p>
          <p className="text-[10px] text-emerald-200/60 mt-1">
            *Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        {/* Open Button */}
        <button
          id="btn-open-invitation"
          onClick={onOpen}
          className="group relative w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-emerald-950 font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <MailOpen className="w-5 h-5 text-emerald-950 transition-transform group-hover:rotate-12 duration-300" />
          <span>BUKA UNDANGAN</span>
          <Sparkles className="w-4 h-4 text-emerald-900 animate-spin-slow" />
        </button>
      </div>
    </div>
  );
};
