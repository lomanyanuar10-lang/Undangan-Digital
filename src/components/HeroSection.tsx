import React from 'react';
import { Calendar, MapPin, Sparkles, Share2, CalendarPlus } from 'lucide-react';
import { EventData } from '../types';
import { BismillahCalligraphy, CrescentStarIcon, GoldIslamicDivider, LanternSilhouette } from './IslamicOrnaments';

interface HeroSectionProps {
  event: EventData;
  onOpenCalendar: () => void;
  onOpenRsvp?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event, onOpenCalendar, onOpenRsvp }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[90dvh] sm:min-h-screen flex flex-col justify-center items-center text-center px-4 py-12 overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950"
    >
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-arabesque-mesh pointer-events-none" />

      {/* Floating lanterns */}
      <div className="absolute top-2 left-4 sm:left-10 pointer-events-none">
        <LanternSilhouette className="w-8 sm:w-10 h-20 sm:h-28 opacity-80" />
      </div>
      <div className="absolute top-4 right-4 sm:right-10 pointer-events-none">
        <LanternSilhouette className="w-7 sm:w-9 h-18 sm:h-24 opacity-80" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Optional School Logos at Top */}
        {(() => {
          const activeLogos = (event.schoolLogos || []).filter((l) => l && l.trim());
          if (activeLogos.length > 0) {
            return (
              <div className="mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-xs sm:max-w-md px-3.5 py-2 rounded-2xl bg-emerald-900/70 border border-amber-400/35 backdrop-blur-md shadow-xl">
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
          return null;
        })()}

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/60 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-4 shadow-lg backdrop-blur-md">
          <CrescentStarIcon className="w-4 h-4 text-amber-400" />
          <span>UNDANGAN RESMI PERINGATAN HARI BESAR ISLAM</span>
        </div>

        {/* Bismillah */}
        <BismillahCalligraphy className="mb-4" />

        {/* Event Title */}
        <h1 className="font-title text-2xl sm:text-4xl font-extrabold text-amber-100 leading-tight tracking-wide drop-shadow-md">
          {event.title}
        </h1>

        <GoldIslamicDivider className="my-4" />

        {/* Event Theme */}
        <div className="rounded-2xl bg-emerald-950/70 border border-amber-400/30 p-4 sm:p-5 mb-6 backdrop-blur-sm max-w-md w-full">
          <p className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-widest mb-1">
            TEMA ACARA
          </p>
          <p className="text-sm sm:text-base text-emerald-100 font-medium italic">
            "{event.theme}"
          </p>
        </div>

        {/* Date & Location Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md text-xs sm:text-sm text-emerald-100/90 mb-8">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/20 w-full sm:w-auto justify-center">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium text-amber-200">{event.dateStr}</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/20 w-full sm:w-auto justify-center">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate max-w-[240px] font-medium">{event.venueName}</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm">
          <button
            id="btn-hero-calendar"
            onClick={onOpenCalendar}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-amber-400/30 text-amber-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-amber-400" />
            <span>Simpan Jadwal</span>
          </button>
          <button
            id="btn-hero-rsvp"
            onClick={onOpenRsvp || onOpenCalendar}
            className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            <span>RSVP Kehadiran</span>
          </button>
        </div>
      </div>
    </section>
  );
};
