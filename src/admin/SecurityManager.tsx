import React, { useState } from 'react';
import {
  ShieldCheck,
  Key,
  UserPlus,
  Lock,
  Mail,
  Copy,
  Check,
  AlertTriangle,
  Link2,
  Share2,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

export const SecurityManager: React.FC = () => {
  const event = storageService.getEvent('maulid-1448');
  const [guestName, setGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const [currentMasterPass, setCurrentMasterPass] = useState(storageService.getMasterPassword());
  const [newMasterPass, setNewMasterPass] = useState('');
  const [masterPassSaved, setMasterPassSaved] = useState(false);

  // New Admin creation from inside dashboard
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminCreateLoading, setAdminCreateLoading] = useState(false);
  const [adminCreateSuccess, setAdminCreateSuccess] = useState('');
  const [adminCreateError, setAdminCreateError] = useState('');

  const adminSecretUrl = `${window.location.origin}/#admin`;
  const guestPublicBaseUrl = window.location.origin;

  const getGuestInvitationUrl = (guest?: string) => {
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
    const link = getGuestInvitationUrl(guest);
    const kepadaYth = guest && guest.trim() ? `Kepada Yth: *${guest.trim()}*\n\n` : '';

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

  const handleCopyGuestLink = () => {
    const url = getGuestInvitationUrl(guestName);
    navigator.clipboard?.writeText(url);
    setCopiedLink('guest-custom');
    setTimeout(() => setCopiedLink(''), 2500);
  };

  const handleCopyFullWaText = () => {
    const text = getWhatsAppMessage(guestName);
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleUpdateMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterPass.trim() || newMasterPass.trim().length < 4) {
      alert('Sandi master minimal 4 karakter.');
      return;
    }
    storageService.setMasterPassword(newMasterPass.trim());
    setCurrentMasterPass(newMasterPass.trim());
    setNewMasterPass('');
    setMasterPassSaved(true);
    setTimeout(() => setMasterPassSaved(false), 3000);
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCreateError('');
    setAdminCreateSuccess('');
    setAdminCreateLoading(true);

    try {
      await authService.registerWithEmail(newAdminEmail.trim(), newAdminPassword);
      setAdminCreateSuccess(`Akun admin baru (${newAdminEmail}) berhasil dibuat dan terdaftar di Firebase!`);
      setNewAdminEmail('');
      setNewAdminPassword('');
    } catch (err: any) {
      const msg = authService.getErrorMessage(err);
      setAdminCreateError(msg);
    } finally {
      setAdminCreateLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-400/20">
        <div>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Keamanan, Akun &amp; Bagikan Undangan</span>
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            Alat pembuat undangan khusus tamu, tautan rahasia admin, dan manajemen hak akses
          </p>
        </div>
      </div>

      {/* Card 0: Generator Bagikan Undangan ke Tamu (Moved from Guest view to Admin only) */}
      <div className="rounded-3xl border border-amber-400/35 bg-emerald-950/90 p-6 sm:p-7 backdrop-blur-md shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-title text-base sm:text-lg font-bold text-amber-100">
                Generator Undangan Khusus Tamu (WhatsApp)
              </h3>
              <p className="text-xs text-emerald-200/80">
                Khusus Panitia: Buat link personal dengan nama tamu dan kirim langsung via WhatsApp
              </p>
            </div>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-900 border border-amber-400/30 text-amber-300 font-semibold self-start sm:self-auto">
            Hanya di Panel Admin
          </span>
        </div>

        {/* Input Nama Tamu */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ketik Nama Tamu (Opsional):</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Bapak H. Ridwan / Ibu Fatimah / Keluarga Besar Alumni"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 placeholder-emerald-400/40 text-sm focus:outline-none focus:border-amber-400 shadow-inner"
          />
          <p className="text-[11px] text-emerald-300/70 italic">
            {guestName.trim()
              ? `Tautan akan otomatis disesuaikan menyapa: "${guestName.trim()}" di halaman pembuka.`
              : 'Jika dikosongkan, tautan akan membuka undangan umum tanpa nama khusus.'}
          </p>
        </div>

        {/* Buttons Action */}
        <div className="space-y-3 pt-1">
          <button
            id="btn-admin-share-whatsapp"
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>BAGIKAN LANGSUNG KE WHATSAPP</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              id="btn-admin-copy-link"
              onClick={handleCopyGuestLink}
              className="py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-amber-400/30 text-amber-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {copiedLink === 'guest-custom' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Tautan Tamu Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Salin Tautan Khusus Tamu</span>
                </>
              )}
            </button>

            <button
              id="btn-admin-copy-wa-text"
              onClick={handleCopyFullWaText}
              className="py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-amber-400/30 text-amber-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Format WA Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Salin Format Pesan WA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Tautan */}
        <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-amber-400/20 text-xs space-y-1">
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
            Tautan Tamu yang Dihasilkan:
          </span>
          <p className="font-mono text-emerald-100 break-all bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-700/40 text-[11px]">
            {getGuestInvitationUrl(guestName)}
          </p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200 shadow-md">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-100">Perbedaan Halaman Tamu &amp; Halaman Admin</h4>
          <p className="text-emerald-200/80 leading-relaxed">
            Halaman publik undangan yang dibagikan ke tamu <strong>TIDAK memiliki form bagikan nama</strong> maupun tombol admin sama sekali. Panel Pengelola ini hanya dapat dibuka melalui tautan rahasia admin di bawah.
          </p>
        </div>
      </div>

      {/* Card 1: URL Separation */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          <span>Tautan Halaman Undangan &amp; Admin</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Public Link */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-200">🟢 Tautan untuk Dibagikan ke Tamu:</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200">Publik</span>
            </div>
            <p className="text-[11px] text-emerald-300/70">
              Tautan ini bebas dari tombol atau menu admin apapun.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={guestPublicBaseUrl}
                className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-600/40 text-emerald-100 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(guestPublicBaseUrl, 'guest')}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedLink === 'guest' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'guest' ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Admin Secret Link */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200">🔒 Tautan Rahasia Panel Admin:</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900 text-amber-200">Rahasia</span>
            </div>
            <p className="text-[11px] text-amber-300/70">
              Simpan dan buka tautan ini khusus oleh Anda / Panitia.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={adminSecretUrl}
                className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-amber-400/40 text-amber-200 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(adminSecretUrl, 'admin')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedLink === 'admin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'admin' ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Master Passcode Settings */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <Key className="w-4 h-4" />
          <span>Kata Sandi Master Panitia</span>
        </h4>
        <p className="text-xs text-emerald-200/70">
          Sandi master digunakan sebagai alternatif masuk instan jika Anda tidak ingin menggunakan email/password.
        </p>

        <form onSubmit={handleUpdateMasterPassword} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs text-emerald-300 mb-1">
              Sandi Master Saat Ini: <strong className="text-amber-300 font-mono">{currentMasterPass}</strong>
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan sandi master baru..."
              value={newMasterPass}
              onChange={(e) => setNewMasterPass(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Simpan Sandi Master Baru</span>
            </button>
            {masterPassSaved && (
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Sandi master berhasil diperbarui!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Card 3: Register New Admin (Controlled from Inside Dashboard Only) */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Admin Baru (Khusus Pemilik)</span>
        </h4>
        <p className="text-xs text-emerald-200/70">
          Anda dapat mendaftarkan rekan panitia tambahan ke Firebase Authentication secara aman dari dalam dashboard ini.
        </p>

        {adminCreateError && (
          <div className="p-3 rounded-xl bg-rose-950 border border-rose-500 text-rose-200 text-xs">
            {adminCreateError}
          </div>
        )}

        {adminCreateSuccess && (
          <div className="p-3 rounded-xl bg-emerald-900 border border-emerald-400 text-emerald-100 text-xs">
            {adminCreateSuccess}
          </div>
        )}

        <form onSubmit={handleCreateNewAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Admin Baru</span>
            </label>
            <input
              type="email"
              required
              placeholder="panitia@email.com"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Kata Sandi (Min 6 Karakter)</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={adminCreateLoading}
              className="py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{adminCreateLoading ? 'Mendaftarkan ke Firebase...' : 'Daftarkan Admin Tambahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
