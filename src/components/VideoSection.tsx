import React from 'react';
import { Video, Sparkles, ExternalLink } from 'lucide-react';
import { EventData } from '../types';
import { GoldIslamicDivider } from './IslamicOrnaments';
import { getYouTubeEmbedUrl } from '../utils/videoUtils';

interface VideoSectionProps {
  event: EventData;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ event }) => {
  if (!event.isVideoEnabled || !event.videoUrl || !event.videoUrl.trim()) return null;

  const embedUrl = getYouTubeEmbedUrl(event.videoUrl);

  if (!embedUrl) return null;

  return (
    <section className="relative px-4 py-12 bg-gradient-to-b from-emerald-950 to-emerald-900/50">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/80 border border-amber-400/30 text-amber-300 mb-2">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            Tayangan Khusus
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-amber-100">
            Video Cuplikan Acara
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Menyimak tausiyah dan dokumentasi video
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-amber-400/30 bg-emerald-950 shadow-2xl">
          <iframe
            title="Video Acara Maulid"
            src={embedUrl}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="text-center mt-3">
          <a
            href={event.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-amber-300/80 hover:text-amber-200 underline transition-colors"
          >
            <span>Buka video langsung di YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
