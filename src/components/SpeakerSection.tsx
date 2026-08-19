import React, { useState } from 'react';
import { Mic, UserCheck, Sparkles, Award } from 'lucide-react';
import { EventData } from '../types';
import { GoldIslamicDivider, MosqueArchFrame } from './IslamicOrnaments';

interface SpeakerSectionProps {
  event: EventData;
}

export const SpeakerSection: React.FC<SpeakerSectionProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative px-4 py-12 bg-gradient-to-b from-emerald-950 via-emerald-900/60 to-emerald-950">
      <div className="w-full max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/80 border border-amber-400/30 text-amber-300 mb-2">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            Tausiyah Maulid
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-amber-100">
            Penceramah Utama
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Menghadirkan narasumber tausiyah agama yang kharismatik
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        {/* Speaker Card Frame */}
        <MosqueArchFrame className="max-w-md mx-auto text-center flex flex-col items-center">
          {/* Photo with Gold Ring */}
          <div className="relative mb-5 mt-2">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.35)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-emerald-950 flex items-center justify-center border-2 border-emerald-900">
                {event.speakerPhotoUrl && !imageError ? (
                  <img
                    src={event.speakerPhotoUrl}
                    alt={event.speakerName}
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-amber-400/70 p-4">
                    <UserCheck className="w-16 h-16 stroke-[1.5]" />
                    <span className="text-[10px] uppercase tracking-wider mt-1 text-amber-300">
                      Ustadz
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Badge on photo */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-emerald-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Muballigh</span>
            </div>
          </div>

          {/* Speaker Name & Title */}
          <h3 className="font-title text-xl sm:text-2xl font-bold text-amber-200">
            {event.speakerName}
          </h3>

          <p className="text-base sm:text-lg font-semibold text-amber-400/90 mt-0.5">
            {event.speakerTitle}
          </p>

          {event.speakerBio && (
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-3 max-w-sm leading-relaxed">
              {event.speakerBio}
            </p>
          )}

          {/* Quotation / Motivation */}
          <div className="mt-5 pt-4 border-t border-amber-400/20 w-full">
            <p className="text-xs text-amber-300/90 italic flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>"Mari bersama mempererat ukhuwah & meneladani akhlak mulia Nabi SAW"</span>
            </p>
          </div>
        </MosqueArchFrame>
      </div>
    </section>
  );
};
