import React from 'react';
import { EventData } from '../types';
import { CrescentStarIcon, GoldIslamicDivider } from './IslamicOrnaments';

interface FooterSectionProps {
  event: EventData;
  onOpenAdmin?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ event }) => {
  return (
    <footer className="relative bg-emerald-950 border-t border-amber-400/20 pt-10 pb-28 px-4 text-center">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Emblem or School Logos */}
        {(() => {
          const activeLogos = (event.schoolLogos || []).filter((l) => l && l.trim());
          if (activeLogos.length > 0) {
            return (
              <div className="mb-3.5 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
                {activeLogos.map((logoUrl, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-amber-400/40 overflow-hidden"
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
            <div className="w-12 h-12 rounded-full bg-emerald-900/80 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
              <CrescentStarIcon className="w-7 h-7" />
            </div>
          );
        })()}

        <h3 className="font-title text-base sm:text-lg font-bold text-amber-200">
          {event.title}
        </h3>

        <p className="text-xs text-emerald-200/80 mt-1 max-w-sm italic">
          "{event.theme}"
        </p>

        <p className="text-[11px] text-emerald-300/70 mt-2 max-w-xs">
          {event.venueName} &bull; {event.venueAddress}
        </p>

        <GoldIslamicDivider className="my-6 max-w-xs" />

        <p className="text-xs text-emerald-200/60 font-medium">
          &copy; 2026 &bull; Digital Invitation System
        </p>
      </div>
    </footer>
  );
};
