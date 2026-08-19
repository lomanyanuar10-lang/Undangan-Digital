import React from 'react';
import { Settings, ShieldCheck, Heart } from 'lucide-react';
import { EventData } from '../types';
import { BismillahCalligraphy, CrescentStarIcon, GoldIslamicDivider } from './IslamicOrnaments';

interface FooterSectionProps {
  event: EventData;
  onOpenAdmin: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ event, onOpenAdmin }) => {
  return (
    <footer className="relative bg-emerald-950 border-t border-amber-400/20 pt-10 pb-28 px-4 text-center">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Emblem */}
        <div className="w-12 h-12 rounded-full bg-emerald-900/80 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
          <CrescentStarIcon className="w-7 h-7" />
        </div>

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

        {/* Subtle Admin Panel Link */}
        <div className="mt-4">
          <button
            id="btn-footer-admin"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/80 border border-amber-400/20 text-amber-300/60 hover:text-amber-300 text-[11px] font-semibold transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Pengelola (Admin)</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
