import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { EventData } from '../types';

interface AudioPlayerProps {
  event: EventData;
  autoPlayTriggered: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ event, autoPlayTriggered }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // When opening cover is dismissed and audio is enabled, attempt playback
  useEffect(() => {
    if (autoPlayTriggered && event.isAudioEnabled && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch((err) => {
            console.log('Audio autoplay prevented by browser policy:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlayTriggered, event.isAudioEnabled]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((e) => {
          console.warn('Audio play failed:', e);
          setHasError(true);
        });
    }
  };

  if (!event.isAudioEnabled || !event.audioUrl) return null;

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 select-none">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={event.audioUrl}
        loop
        preload="auto"
        onError={() => setHasError(true)}
      />

      {/* Floating Pill Button */}
      <button
        id="btn-toggle-audio"
        onClick={togglePlay}
        title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        className={`group flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer ${
          isPlaying
            ? 'bg-emerald-900/90 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            : 'bg-emerald-950/80 border-emerald-700/50 text-emerald-300/70 hover:text-emerald-100 hover:border-amber-400/50'
        }`}
      >
        <div className={`relative flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
          <Disc className="w-5 h-5 text-amber-400" />
        </div>

        <span className="hidden sm:inline text-xs font-semibold max-w-[110px] truncate">
          {hasError ? 'Audio Error' : isPlaying ? 'Musik Aktif' : 'Putar Musik'}
        </span>

        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-amber-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-emerald-400/60" />
        )}
      </button>
    </div>
  );
};
