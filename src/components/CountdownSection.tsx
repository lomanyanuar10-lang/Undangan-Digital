import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Radio, CalendarCheck } from 'lucide-react';
import { EventData } from '../types';
import { GoldIslamicDivider } from './IslamicOrnaments';

interface CountdownSectionProps {
  event: EventData;
  onOpenCalendar: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'upcoming' | 'ongoing' | 'finished';
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ event, onOpenCalendar }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'upcoming',
  });

  useEffect(() => {
    const calculateTime = () => {
      // Event Target time
      const targetDate = new Date(event.dateTimeIso).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      // Event duration assume ~ 5 hours
      const eventEndTime = targetDate + 5 * 60 * 60 * 1000;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: Math.max(0, days),
          hours: Math.max(0, hours),
          minutes: Math.max(0, minutes),
          seconds: Math.max(0, seconds),
          status: 'upcoming',
        });
      } else if (now >= targetDate && now <= eventEndTime) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          status: 'ongoing',
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          status: 'finished',
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [event.dateTimeIso]);

  if (!event.isCountdownEnabled) return null;

  return (
    <section className="relative px-4 py-8 bg-emerald-950/80">
      <div className="w-full max-w-lg mx-auto rounded-3xl border border-amber-400/30 bg-gradient-to-b from-emerald-900/90 to-emerald-950/95 p-6 sm:p-8 backdrop-blur-md shadow-xl text-center">
        {/* Status Header */}
        <div className="flex items-center justify-center gap-2 mb-3 text-amber-300">
          <Clock className="w-5 h-5 text-amber-400 animate-pulse-slow" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-300">
            Hitung Mundur Acara
          </span>
        </div>

        <h3 className="font-title text-lg sm:text-xl font-bold text-amber-100 mb-1">
          Menuju Waktu Peringatan Maulid
        </h3>
        <p className="text-xs text-emerald-200/80 mb-6">
          {event.dateStr} &bull; Pukul {event.timeStr}
        </p>

        {/* Countdown Box */}
        {timeLeft.status === 'upcoming' && (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
            <div className="rounded-2xl bg-emerald-950/90 border border-amber-400/40 p-2.5 sm:p-4 flex flex-col items-center justify-center shadow-inner">
              <span className="font-title text-2xl sm:text-3xl font-extrabold text-amber-300 drop-shadow">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-200/90 mt-1 uppercase tracking-wider">
                Hari
              </span>
            </div>

            <div className="rounded-2xl bg-emerald-950/90 border border-amber-400/40 p-2.5 sm:p-4 flex flex-col items-center justify-center shadow-inner">
              <span className="font-title text-2xl sm:text-3xl font-extrabold text-amber-300 drop-shadow">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-200/90 mt-1 uppercase tracking-wider">
                Jam
              </span>
            </div>

            <div className="rounded-2xl bg-emerald-950/90 border border-amber-400/40 p-2.5 sm:p-4 flex flex-col items-center justify-center shadow-inner">
              <span className="font-title text-2xl sm:text-3xl font-extrabold text-amber-300 drop-shadow">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-200/90 mt-1 uppercase tracking-wider">
                Menit
              </span>
            </div>

            <div className="rounded-2xl bg-emerald-950/90 border border-amber-400/40 p-2.5 sm:p-4 flex flex-col items-center justify-center shadow-inner">
              <span className="font-title text-2xl sm:text-3xl font-extrabold text-amber-400 drop-shadow">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-amber-200/90 mt-1 uppercase tracking-wider">
                Detik
              </span>
            </div>
          </div>
        )}

        {timeLeft.status === 'ongoing' && (
          <div className="rounded-2xl bg-amber-500/20 border border-amber-400 p-4 mb-6 flex items-center justify-center gap-3">
            <Radio className="w-6 h-6 text-amber-400 animate-pulse" />
            <span className="font-bold text-amber-200 text-sm sm:text-base tracking-wider">
              ACARA SEDANG BERLANGSUNG
            </span>
          </div>
        )}

        {timeLeft.status === 'finished' && (
          <div className="rounded-2xl bg-emerald-900/60 border border-emerald-500/40 p-4 mb-6 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-emerald-200 text-sm sm:text-base tracking-wider">
              ACARA TELAH SELESAI
            </span>
          </div>
        )}

        <GoldIslamicDivider className="my-4" />

        {/* Add to Calendar Prompt */}
        <button
          id="btn-countdown-calendar"
          onClick={onOpenCalendar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <CalendarCheck className="w-4 h-4 text-amber-400" />
          <span>Ingatkan Saya di Kalender</span>
        </button>
      </div>
    </section>
  );
};
