import React, { useState } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { BismillahCalligraphy, GoldIslamicDivider } from '../components/IslamicOrnaments';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToInvitation: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'quick-pass';

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToInvitation,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetStatus = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStatus();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await authService.loginWithEmail(email, password);
        setSuccessMessage('Berhasil masuk! Mengarahkan ke Dashboard...');
        setTimeout(() => onLoginSuccess(), 400);
      } else if (mode === 'register') {
        await authService.registerWithEmail(email, password);
        setSuccessMessage('Akun admin berhasil didaftarkan dan Anda sudah masuk!');
        setTimeout(() => onLoginSuccess(), 600);
      } else if (mode === 'forgot-password') {
        await authService.sendPasswordReset(email);
        setSuccessMessage(`Tautan reset kata sandi telah dikirimkan ke email: ${email}. Silakan periksa kotak masuk/spam Anda.`);
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      const friendlyMsg = authService.getErrorMessage(err);
      setError(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    resetStatus();
    setIsLoading(true);

    setTimeout(() => {
      const ok = storageService.loginAdmin(quickPassword);
      if (ok) {
        setSuccessMessage('Berhasil masuk dengan sandi admin.');
        setTimeout(() => onLoginSuccess(), 300);
      } else {
        setError('Kata sandi admin tidak sesuai. Coba sandi default: admin1448 atau admin');
      }
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50 selection:bg-amber-400 selection:text-emerald-950">
      <div className="w-full max-w-md rounded-3xl border border-amber-400/30 bg-emerald-950/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
        {/* Back Button */}
        <button
          onClick={onBackToInvitation}
          className="absolute top-5 left-5 text-emerald-300/80 hover:text-amber-300 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mt-3 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Lock className="w-7 h-7" />
          </div>
          <BismillahCalligraphy className="mb-2" />
          <h2 className="font-title text-xl font-bold text-amber-100">
            Panel Pengelola Undangan
          </h2>
          <p className="text-xs text-emerald-200/70 mt-1">
            Masuk dengan Akun Firebase Authentication untuk mengelola acara
          </p>
          <GoldIslamicDivider className="mt-3" />
        </div>

        {/* Mode Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-emerald-900/60 border border-amber-400/20 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              resetStatus();
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'login'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-amber-200 hover:bg-emerald-800/40'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              resetStatus();
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'register'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-amber-200 hover:bg-emerald-800/40'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('quick-pass');
              resetStatus();
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'quick-pass'
                ? 'bg-amber-500 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-amber-200 hover:bg-emerald-800/40'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sandi Master</span>
          </button>
        </div>

        {/* Alert Feedback */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs flex flex-col gap-2 shadow-md">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
            {mode === 'login' && (
              <div className="flex items-center gap-2 pt-1 border-t border-rose-900/60">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-[11px] cursor-pointer transition-all shadow"
                >
                  Daftar Akun Baru &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('quick-pass');
                    setError('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-semibold text-[11px] border border-amber-400/30 cursor-pointer transition-all"
                >
                  Gunakan Sandi Master
                </button>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-900/90 border border-emerald-400/50 text-emerald-100 text-xs flex items-start gap-2.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMessage}</div>
          </div>
        )}

        {/* Firebase Email & Password Form (Login / Register / Forgot Password) */}
        {mode !== 'quick-pass' ? (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Admin</span>
              </label>
              <input
                id="admin-email-input"
                type="email"
                required
                autoFocus
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 placeholder-emerald-400/40 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kata Sandi</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot-password');
                        resetStatus();
                      }}
                      className="text-[11px] text-amber-300/80 hover:text-amber-200 underline cursor-pointer"
                    >
                      Lupa sandi?
                    </button>
                  )}
                </div>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  placeholder="Minimal 6 karakter..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 placeholder-emerald-400/40 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            )}

            <button
              id="btn-admin-submit"
              type="submit"
              disabled={isLoading || !email || (mode !== 'forgot-password' && !password)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Memproses ke Firebase...</span>
              ) : mode === 'login' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>MASUK DENGAN FIREBASE</span>
                </>
              ) : mode === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>BUAT AKUN ADMIN BARU</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>KIRIM LINK RESET PASSWORD</span>
                </>
              )}
            </button>

            {mode === 'forgot-password' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetStatus();
                }}
                className="w-full text-center text-xs text-emerald-300 hover:text-amber-200 mt-2 underline cursor-pointer"
              >
                Kembali ke Form Masuk
              </button>
            )}

            <div className="pt-2 text-center text-[11px] text-emerald-400/70 leading-relaxed border-t border-emerald-900/60">
              💡 <span>Otentikasi aman tersinkronisasi dengan Firebase Authentication pada proyek </span>
              <strong className="text-amber-300">loman-digital-invitation</strong>
            </div>
          </form>
        ) : (
          /* Quick Password / Master Passcode Fallback */
          <form onSubmit={handleQuickPasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Kata Sandi Master Admin</span>
              </label>
              <input
                id="admin-quickpass-input"
                type="password"
                required
                autoFocus
                placeholder="Masukkan sandi master..."
                value={quickPassword}
                onChange={(e) => setQuickPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 placeholder-emerald-400/40 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <p className="text-[11px] text-emerald-400/60 mt-1.5 italic">
                Sandi bawaan: <code className="text-amber-300 font-mono">admin1448</code> atau <code className="text-amber-300 font-mono">admin</code>
              </p>
            </div>

            <button
              id="btn-admin-quick-login"
              type="submit"
              disabled={isLoading || !quickPassword}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>MASUK DENGAN SANDI MASTER</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
