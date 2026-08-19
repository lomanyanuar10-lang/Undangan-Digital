import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Building2 } from 'lucide-react';
import { EventData } from '../types';
import { GoldIslamicDivider } from './IslamicOrnaments';

interface EventInfoSectionProps {
  event: EventData;
}

export const EventInfoSection: React.FC<EventInfoSectionProps> = ({ event }) => {
  return (
    <section id="acara" className="relative px-4 py-12 bg-emerald-950">
      <div className="w-full max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/80 border border-amber-400/30 text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Informasi Pelaksanaan
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-amber-100">
            Waktu & Tempat Acara
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-md mx-auto">
            Rangkaian perayaan Maulid Nabi Muhammad SAW 1448 H diselenggarakan pada:
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Tanggal */}
          <div className="rounded-2xl bg-emerald-900/60 border border-amber-400/25 p-5 backdrop-blur-md shadow-lg flex items-start gap-4 transition-all hover:border-amber-400/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/80">
                Hari & Tanggal
              </p>
              <h4 className="text-base font-bold text-amber-100 mt-0.5">{event.dateStr}</h4>
              <p className="text-xs text-emerald-200/70 mt-1">12 Rabiul Awal 1448 H</p>
            </div>
          </div>

          {/* Card 2: Waktu */}
          <div className="rounded-2xl bg-emerald-900/60 border border-amber-400/25 p-5 backdrop-blur-md shadow-lg flex items-start gap-4 transition-all hover:border-amber-400/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/80">
                Waktu Acara
              </p>
              <h4 className="text-base font-bold text-amber-100 mt-0.5">{event.timeStr}</h4>
              <p className="text-xs text-emerald-200/70 mt-1">Harap hadir 15 menit sebelum acara</p>
            </div>
          </div>

          {/* Card 3: Lokasi */}
          <div className="rounded-2xl bg-emerald-900/60 border border-amber-400/25 p-5 backdrop-blur-md shadow-lg flex items-start gap-4 transition-all hover:border-amber-400/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/80">
                Tempat Pelaksanaan
              </p>
              <h4 className="text-base font-bold text-amber-100 mt-0.5">{event.venueName}</h4>
              <p className="text-xs text-emerald-200/70 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 inline" />
                <span>{event.venueAddress}</span>
              </p>
            </div>
          </div>

          {/* Card 4: Tema */}
          <div className="rounded-2xl bg-emerald-900/60 border border-amber-400/25 p-5 backdrop-blur-md shadow-lg flex items-start gap-4 transition-all hover:border-amber-400/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/80">
                Tema Kegiatan
              </p>
              <h4 className="text-sm font-bold text-amber-100 mt-0.5 italic">
                "{event.theme}"
              </h4>
              <p className="text-xs text-emerald-200/70 mt-1">
                Membangun generasi beradab & berkarakter islami
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
