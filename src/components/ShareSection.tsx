import React, { useState } from 'react';
import { Share2, CalendarPlus, Copy, Check, MessageCircle, Download, ExternalLink, Sparkles, UserPlus } from 'lucide-react';
import { EventData } from '../types';
import { GoldIslamicDivider } from './IslamicOrnaments';

interface ShareSectionProps {
  event: EventData;
}

export const ShareSection: React.FC<ShareSectionProps> = ({ event }) => {
  const [guestName, setGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const getInvitationUrl = (guest?: string) => {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      if (guest && guest.trim()) {
        return `${baseUrl}?to=${encodeURIComponent(guest.trim())}`;
      }
      return baseUrl;
    } catch {
      return window.location.href;
    }
  };

  const getWhatsAppMessage = (guest?: string) => {
    const link = getInvitationUrl(guest);
    const kepadaYth = guest ? `Kepada Yth: *${guest}*\n\n` : '';

    return `Assalamu'alaikum Warahmatullahi Wabarakatuh.

${kepadaYth}Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam:

*${event.title}*

Tema:
_"${event.theme}"_

📅 *${event.dateStr}*
⏰ *Pukul ${event.timeStr}*
📍 *${event.venueName}*
(${event.venueAddress})

Pembicara: *${event.speakerName} ${event.speakerTitle}*

Untuk informasi susunan acara, lokasi maps, dan konfirmasi kehadiran (RSVP), silakan buka tautan undangan digital kami:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk mempererat tali silaturahim serta meneladani akhlak Rasulullah SAW.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
  };

  const handleShareWhatsApp = () => {
    const text = getWhatsAppMessage(guestName);
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    const url = getInvitationUrl(guestName);
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Undangan Resmi: ${event.title} - ${event.theme}`,
          url,
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleShareWhatsApp();
    }
  };

  const handleCopyLink = () => {
    const url = getInvitationUrl(guestName);
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyFullText = () => {
    const text = getWhatsAppMessage(guestName);
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `Tema: ${event.theme}\nPenceramah: ${event.speakerName} ${event.speakerTitle}\nInfo Lengkap: ${getInvitationUrl()}`
    );
    const location = encodeURIComponent(`${event.venueName}, ${event.venueAddress}`);
    // Start: 2026-09-01T07:30:00 -> 20260901T003000Z (UTC format: WIB is UTC+7)
    // 07:30 WIB = 00:30 UTC
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
    <section className="relative px-4 py-12 bg-emerald-950">
      <div className="w-full max-w-xl mx-auto space-y-8">
        {/* Card 1: Add to Calendar */}
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
              <span>Download (.ICS) Apple/Outlook</span>
            </button>
          </div>
        </div>

        {/* Card 2: Share Invitation */}
        <div className="rounded-3xl border border-amber-400/30 bg-emerald-950/85 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-title text-lg sm:text-xl font-bold text-amber-100 mb-1">
              Bagikan Undangan Ini
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-sm mx-auto">
              Kirimkan kabar gembira dan undangan silaturahim kepada kerabat & sahabat
            </p>
          </div>

          {/* Custom Guest Name Input for Personalized Link */}
          <div className="mb-5 rounded-2xl bg-emerald-900/50 border border-amber-400/20 p-3.5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-200 mb-1 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>Buat Undangan Khusus Atas Nama (Opsional):</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Bapak H. Ridwan / Ibu Fatimah"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-amber-400/30 text-emerald-50 placeholder-emerald-400/40 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-2.5">
            <button
              id="btn-share-whatsapp"
              onClick={handleShareWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>BAGIKAN KE WHATSAPP</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="btn-copy-invitation-link"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/30 text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Tautan Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Salin Tautan</span>
                  </>
                )}
              </button>

              <button
                id="btn-copy-invitation-text"
                onClick={handleCopyFullText}
                className="py-2.5 px-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/30 text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Teks Disalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Salin Format WA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
