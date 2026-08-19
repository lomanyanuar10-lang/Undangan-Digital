import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Sparkles, ZoomIn } from 'lucide-react';
import { EventData, GalleryItem } from '../types';
import { GoldIslamicDivider } from './IslamicOrnaments';

interface GallerySectionProps {
  event: EventData;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ event }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const galleryList: GalleryItem[] = event.gallery || [];

  const openLightbox = (index: number) => {
    setSelectedIdx(index);
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + galleryList.length) % galleryList.length);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % galleryList.length);
    }
  };

  return (
    <section id="galeri" className="relative px-4 py-12 bg-emerald-950">
      <div className="w-full max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/80 border border-amber-400/30 text-amber-300 mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            Dokumentasi
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-amber-100">
            Galeri Kegiatan
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Momen khidmat dan kebersamaan perayaan Maulid Nabi
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        {/* Gallery Grid */}
        {galleryList.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-emerald-900/40 border border-emerald-800 p-6">
            <ImageIcon className="w-12 h-12 text-amber-400/50 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-200/80">
              Galeri kegiatan akan segera diperbarui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {galleryList.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-emerald-900/60 border border-amber-400/25 cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.03] hover:border-amber-400/60 hover:shadow-xl"
              >
                <img
                  src={item.url}
                  alt={item.alt || item.caption || `Galeri ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="flex items-center justify-between text-amber-300">
                    <p className="text-[11px] font-semibold truncate pr-2">{item.caption || item.alt}</p>
                    <ZoomIn className="w-4 h-4 shrink-0" />
                  </div>
                </div>

                {/* Subtle corner badge */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-950/70 border border-amber-400/40 flex items-center justify-center opacity-75 group-hover:opacity-100">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {selectedIdx !== null && galleryList[selectedIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-emerald-950/80 border border-amber-400/40 text-amber-300 flex items-center justify-center hover:bg-emerald-900 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          {galleryList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-emerald-950/80 border border-amber-400/40 text-amber-300 flex items-center justify-center hover:bg-emerald-900 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-emerald-950/80 border border-amber-400/40 text-amber-300 flex items-center justify-center hover:bg-emerald-900 transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-3xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryList[selectedIdx].url}
              alt={galleryList[selectedIdx].alt || galleryList[selectedIdx].caption}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain border border-amber-400/30 shadow-2xl"
            />
            {galleryList[selectedIdx].caption && (
              <div className="mt-4 px-6 py-2 rounded-xl bg-emerald-950/90 border border-amber-400/30 text-center max-w-lg">
                <p className="text-xs sm:text-sm text-amber-200 font-medium">
                  {galleryList[selectedIdx].caption}
                </p>
                <p className="text-[10px] text-emerald-300/70 mt-0.5">
                  Foto {selectedIdx + 1} dari {galleryList.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
