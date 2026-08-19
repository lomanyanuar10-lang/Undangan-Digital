import React from 'react';
import { CalendarPlus, Download, ExternalLink } from 'lucide-react';
import { EventData } from '../types';

interface ShareSectionProps {
  event: EventData;
}

export const ShareSection: React.FC<ShareSectionProps> = ({ event }) => {
  const getInvitationUrl = () => {
    try {
      return window.location.origin + window.location.pathname;
    } catch {
      return window.location.href;
    }
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `Tema: ${event.theme}\nPenceramah: ${event.speakerName} ${event.speakerTitle}\nInfo Lengkap: ${getInvitationUrl()}`
    );
    const location = encodeURIComponent(`${event.venueName}, ${event.venueAddress}`);
    // Start: 2026-09-01T07:30:00 -> 20260901T003000Z (UTC format: WIB is UTC+7)
    const dates = '20260901T003000Z/20260901T050000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Download .ics file
  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Digital Invitation//Maulid Nabi 1448 H//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:Tema: ${event.theme} | Penceramah: ${event.speakerName} ${event.speakerTitle}`,
      `LOCATION:${event.venueName}, ${event.venueAddress}`,
      'DTSTART:20260901T003000Z',
      'DTEND:20260901T050000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Maulid-Nabi-1448H.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="calendar" className="relative px-4 py-10 bg-emerald-950">
      <div className="w-full max-w-lg mx-auto">
        {/* Add to Calendar Card */}
        <div className="rounded-3xl border border-amber-400/30 bg-emerald-950/85 p-6 sm:p-8 backdrop-blur-md shadow-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <CalendarPlus className="w-6 h-6" />
          </div>

          <h3 className="font-title text-lg sm:text-xl font-bold text-amber-100 mb-1">
            Simpan Jadwal ke Kalender
          </h3>
          <p className="text-xs text-emerald-200/80 mb-5 max-w-sm mx-auto">
            Pasang pengingat di gawai Anda agar tidak melewatkan majelis berkah ini
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              id="btn-google-calendar"
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/30 text-amber-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Google Calendar</span>
            </a>

            <button
              id="btn-download-ics"
              onClick={handleDownloadIcs}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download (.ICS)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
