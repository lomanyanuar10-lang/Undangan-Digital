import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { EventData } from '../types';
import { GoldIslamicDivider, MosqueArchFrame } from './IslamicOrnaments';

interface IslamicQuoteSectionProps {
  event: EventData;
}

export const IslamicQuoteSection: React.FC<IslamicQuoteSectionProps> = ({ event }) => {
  return (
    <section className="relative px-4 py-12 bg-gradient-to-b from-emerald-950 via-emerald-900/60 to-emerald-950">
      <div className="w-full max-w-xl mx-auto">
        <MosqueArchFrame className="text-center p-6 sm:p-10">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Quote className="w-6 h-6 rotate-180" />
          </div>

          <h3 className="font-title text-lg sm:text-xl font-bold text-amber-200 mb-2">
            Mari Bersama Meneladani Akhlak Rasulullah ﷺ
          </h3>

          <GoldIslamicDivider className="my-4" />

          {/* Arabic Ayah Calligraphy */}
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 drop-shadow-md leading-relaxed my-3 px-2">
            لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ لِّمَن كَانَ يَرْجُو اللَّهَ وَالْيَوْمَ الْآخِرَ وَذَكَرَ اللَّهَ كَثِيرًا
          </p>

          {/* Indonesian Translation */}
          <p className="text-xs sm:text-sm text-emerald-100/90 italic font-serif-islamic max-w-lg mx-auto leading-relaxed mt-4">
            "{event.islamicQuote || 'Sesungguhnya telah ada pada diri Rasulullah suri teladan yang baik bagi kalian.'}"
          </p>

          {/* Surah Reference Tag */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-900/80 border border-amber-400/30 text-amber-300 text-xs font-bold mt-5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{event.islamicQuoteSource || 'QS. Al-Ahzab: 21'}</span>
          </div>
        </MosqueArchFrame>
      </div>
    </section>
  );
};
