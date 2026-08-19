import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Building } from 'lucide-react';
import { EventData } from '../types';
import { GoldIslamicDivider } from './IslamicOrnaments';

interface LocationSectionProps {
  event: EventData;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ event }) => {
  const [copied, setCopied] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  const handleCopyAddress = () => {
    const fullText = `${event.venueName}, ${event.venueAddress}`;
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenMaps = () => {
    const targetUrl =
      event.mapsUrl ||
      `https://maps.google.com/?q=${encodeURIComponent(`${event.venueName} ${event.venueAddress}`)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="lokasi" className="relative px-4 py-12 bg-gradient-to-b from-emerald-950 via-emerald-900/50 to-emerald-950">
      <div className="w-full max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/80 border border-amber-400/30 text-amber-300 mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Petunjuk Arah
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-amber-100">
            Lokasi Acara
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Komplek Pendidikan Terpadu
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        {/* Location Details Card */}
        <div className="rounded-3xl border border-amber-400/30 bg-emerald-950/80 p-5 sm:p-7 backdrop-blur-md shadow-2xl space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Building className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-100">{event.venueName}</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 leading-relaxed">
                {event.venueAddress}
              </p>
            </div>
          </div>

          {/* Google Maps Interactive Container */}
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-amber-400/25 bg-emerald-900/60 shadow-inner">
            {!embedError && event.mapsEmbedUrl ? (
              <iframe
                title="Google Maps Location"
                src={event.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={() => setEmbedError(true)}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-emerald-950 to-emerald-900">
                <MapPin className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
                <p className="font-semibold text-amber-200 text-sm">{event.venueName}</p>
                <p className="text-xs text-emerald-200/70 mt-1 max-w-xs">{event.venueAddress}</p>
                <button
                  onClick={handleOpenMaps}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-amber-500 text-emerald-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Buka Peta</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              id="btn-copy-address"
              onClick={handleCopyAddress}
              className="w-full px-4 py-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800/80 border border-amber-400/30 text-amber-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Alamat Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Salin Alamat Lengkap</span>
                </>
              )}
            </button>

            <button
              id="btn-open-google-maps"
              onClick={handleOpenMaps}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>📍 BUKA GOOGLE MAPS</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
