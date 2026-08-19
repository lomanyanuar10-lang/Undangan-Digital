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
  Sparkles,
  Link2,
} from 'lucide-react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

export const SecurityManager: React.FC = () => {
  const [currentMasterPass, setCurrentMasterPass] = useState(storageService.getMasterPassword());
  const [newMasterPass, setNewMasterPass] = useState('');
  const [masterPassSaved, setMasterPassSaved] = useState(false);

  // New Admin creation from inside dashboard
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminCreateLoading, setAdminCreateLoading] = useState(false);
  const [adminCreateSuccess, setAdminCreateSuccess] = useState('');
  const [adminCreateError, setAdminCreateError] = useState('');

  const [copiedLink, setCopiedLink] = useState('');

  const adminSecretUrl = `${window.location.origin}/#admin`;
  const guestPublicUrl = window.location.origin;

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
            <span>Keamanan &amp; Akun Admin</span>
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            Kelola hak akses pengelola dan tautan rahasia panel kontrol
          </p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200 shadow-md">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-100">Perbedaan Halaman Tamu &amp; Halaman Admin</h4>
          <p className="text-emerald-200/80 leading-relaxed">
            Halaman publik undangan yang dibagikan ke tamu <strong>TIDAK memiliki tombol admin</strong> sama sekali. Panel Pengelola ini hanya dapat dibuka melalui tautan rahasia admin di bawah.
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
                value={guestPublicUrl}
                className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-600/40 text-emerald-100 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(guestPublicUrl, 'guest')}
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
