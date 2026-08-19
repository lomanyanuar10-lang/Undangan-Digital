import React from 'react';
import { Clock, Music, BookOpen, Mic, HeartHandshake, Sparkles, CheckCircle } from 'lucide-react';
import { EventData, ScheduleItem } from '../types';
import { GoldIslamicDivider } from './IslamicOrnaments';

interface ScheduleSectionProps {
  event: EventData;
}

const getScheduleIcon = (iconName?: string, index: number = 0) => {
  switch (iconName?.toLowerCase()) {
    case 'music':
    case 'hadroh':
      return <Music className="w-5 h-5 text-amber-400" />;
    case 'bookopen':
    case 'quran':
    case 'maulid':
      return <BookOpen className="w-5 h-5 text-amber-400" />;
    case 'mic':
    case 'tausiyah':
      return <Mic className="w-5 h-5 text-amber-400" />;
    case 'hearthandshake':
    case 'doa':
      return <HeartHandshake className="w-5 h-5 text-amber-400" />;
    default:
      if (index === 0) return <Music className="w-5 h-5 text-amber-400" />;
      if (index === 1) return <BookOpen className="w-5 h-5 text-amber-400" />;
      if (index === 2) return <Mic className="w-5 h-5 text-amber-400" />;
      return <HeartHandshake className="w-5 h-5 text-amber-400" />;
  }
};

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ event }) => {
  const scheduleList: ScheduleItem[] = event.schedule || [];

  return (
    <section id="susunan" className="relative px-4 py-12 bg-emerald-950">
      <div className="w-full max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/80 border border-amber-400/30 text-amber-300 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Agenda Kegiatan
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-amber-100">
            Susunan Acara
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Rangkaian tertib acara perayaan Maulid Nabi 1448 H
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        {/* Timeline Container */}
        {scheduleList.length === 0 ? (
          <div className="text-center py-8 rounded-2xl bg-emerald-900/40 border border-emerald-800 text-emerald-200/70 text-sm">
            Susunan acara akan segera diperbarui.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-500/50 before:to-emerald-800">
            {scheduleList.map((item, index) => (
              <div key={item.id || index} className="relative group">
                {/* Timeline node icon dot */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-950 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-emerald-900/60 border border-amber-400/25 p-4 sm:p-5 backdrop-blur-sm shadow-md hover:border-amber-400/50 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {item.time} WIB
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-200/60 uppercase tracking-wider">
                      Sesi {index + 1}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                      {getScheduleIcon(item.icon, index)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-amber-100">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-emerald-200/70 italic flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Jadwal dapat disesuaikan dengan kondisi di lapangan</span>
          </p>
        </div>
      </div>
    </section>
  );
};
