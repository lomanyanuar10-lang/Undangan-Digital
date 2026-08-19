import React, { useState, useEffect } from 'react';
import { HeartHandshake, CheckCircle2, User, Users, MessageSquare, Send, Sparkles, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventData, RsvpResponse, RsvpStatus } from '../types';
import { storageService } from '../services/storageService';
import { GoldIslamicDivider } from './IslamicOrnaments';

interface RsvpSectionProps {
  event: EventData;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ event }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<RsvpStatus>('hadir');
  const [attendees, setAttendees] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rsvpList, setRsvpList] = useState<RsvpResponse[]>([]);

  useEffect(() => {
    setRsvpList(storageService.getRsvps(event.id));

    const handleUpdate = () => {
      setRsvpList(storageService.getRsvps(event.id));
    };

    window.addEventListener('undangan:rsvpUpdated', handleUpdate);
    return () => window.removeEventListener('undangan:rsvpUpdated', handleUpdate);
  }, [event.id]);

  if (!event.isRsvpEnabled) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      storageService.submitRsvp({
        eventId: event.id,
        name: name.trim(),
        status,
        attendees: status === 'hadir' ? attendees : 0,
        message: message.trim(),
      });

      // Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#10b981', '#047857'],
        });
      } catch {
        // Safe confetti fallback
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setMessage('');
    }, 400);
  };

  const getStatusBadge = (s: RsvpStatus) => {
    switch (s) {
      case 'hadir':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Hadir
          </span>
        );
      case 'tidak_hadir':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Tidak Hadir
          </span>
        );
      case 'tentatif':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Tentatif
          </span>
        );
    }
  };

  return (
    <section id="rsvp" className="relative px-4 py-12 bg-emerald-950">
      <div className="w-full max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-900/80 border border-amber-400/30 text-amber-300 mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            Konfirmasi Kehadiran
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-amber-100">
            RSVP & Doa Terbaik
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Mohon konfirmasikan kehadiran Bapak/Ibu demi kelancaran persiapan acara
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-amber-400/30 bg-emerald-950/85 p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-8">
          {isSubmitted ? (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto mb-3 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-200">
                Terima kasih atas konfirmasinya!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xs mx-auto">
                Konfirmasi kehadiran & untaian doa Anda telah berhasil kami catat.
              </p>
              <button
                id="btn-rsvp-again"
                onClick={() => setIsSubmitted(false)}
                className="mt-5 px-5 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/30 text-amber-300 font-semibold text-xs transition-all cursor-pointer"
              >
                Kirim Konfirmasi Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nama Lengkap / Keluarga</span>
                  <span className="text-amber-400">*</span>
                </label>
                <input
                  id="rsvp-input-name"
                  type="text"
                  required
                  placeholder="Contoh: Bapak H. Ahmad / Keluarga Besar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 placeholder-emerald-400/50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              {/* Status Kehadiran */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200 mb-1.5">
                  Status Kehadiran <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('hadir')}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      status === 'hadir'
                        ? 'bg-emerald-600/60 border-amber-400 text-amber-200 shadow-md shadow-emerald-900/50'
                        : 'bg-emerald-900/40 border-amber-400/20 text-emerald-200/70 hover:bg-emerald-900/70'
                    }`}
                  >
                    <span>🌸 Hadir</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('tidak_hadir')}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      status === 'tidak_hadir'
                        ? 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-md'
                        : 'bg-emerald-900/40 border-amber-400/20 text-emerald-200/70 hover:bg-emerald-900/70'
                    }`}
                  >
                    <span>❌ Tidak Hadir</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('tentatif')}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      status === 'tentatif'
                        ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md'
                        : 'bg-emerald-900/40 border-amber-400/20 text-emerald-200/70 hover:bg-emerald-900/70'
                    }`}
                  >
                    <span>⏳ Tentatif</span>
                  </button>
                </div>
              </div>

              {/* Jumlah Tamu (jika hadir) */}
              {status === 'hadir' && (
                <div className="animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Jumlah Orang</span>
                  </label>
                  <select
                    id="rsvp-select-attendees"
                    value={attendees}
                    onChange={(e) => setAttendees(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
                  >
                    <option value={1}>1 Orang (Sendiri)</option>
                    <option value={2}>2 Orang</option>
                    <option value={3}>3 Orang</option>
                    <option value={4}>4 Orang</option>
                    <option value={5}>5+ Orang (Rombongan / Keluarga)</option>
                  </select>
                </div>
              )}

              {/* Pesan / Doa */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Untaian Doa & Ucapan</span>
                </label>
                <textarea
                  id="rsvp-textarea-message"
                  rows={3}
                  placeholder="Tuliskan ucapan selamat atau doa untuk majelis berkah ini..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 placeholder-emerald-400/50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-rsvp"
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>KONFIRMASI KEHADIRAN</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Wishes & RSVP Wall */}
        <div className="rounded-3xl border border-amber-400/25 bg-emerald-950/70 p-5 sm:p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-400/20">
            <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Daftar Ucapan & Kehadiran ({rsvpList.length})</span>
            </h4>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {rsvpList.length === 0 ? (
              <p className="text-xs text-center text-emerald-200/60 py-4">
                Belum ada ucapan. Jadilah yang pertama memberikan konfirmasi & doa!
              </p>
            ) : (
              rsvpList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-emerald-900/50 border border-amber-400/15 p-3.5 space-y-1.5 transition-all hover:bg-emerald-900/70"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-800 border border-amber-400/40 flex items-center justify-center text-[11px] font-bold text-amber-300">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-amber-100 truncate max-w-[140px] sm:max-w-[200px]">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(item.status)}
                      {item.status === 'hadir' && item.attendees > 0 && (
                        <span className="text-[10px] text-amber-300/80 font-medium">
                          ({item.attendees} pax)
                        </span>
                      )}
                    </div>
                  </div>

                  {item.message && (
                    <p className="text-xs text-emerald-100/90 pl-9 italic leading-relaxed">
                      "{item.message}"
                    </p>
                  )}

                  <div className="text-[9px] text-emerald-300/50 pl-9 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
