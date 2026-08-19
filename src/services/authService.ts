import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const authService = {
  // Login using Firebase Email and Password
  async loginWithEmail(email: string, password: string):Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    localStorage.setItem('undangan_admin_authenticated', 'true');
    localStorage.setItem('undangan_admin_email', userCredential.user.email || '');
    return userCredential.user;
  },

  // Register a new Admin account using Firebase Email and Password
  async registerWithEmail(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    localStorage.setItem('undangan_admin_authenticated', 'true');
    localStorage.setItem('undangan_admin_email', userCredential.user.email || '');
    return userCredential.user;
  },

  // Send Password Reset link via Email
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  // Sign out
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    localStorage.removeItem('undangan_admin_authenticated');
    localStorage.removeItem('undangan_admin_email');
  },

  // Check current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Listen to Auth State Changes
  subscribeToAuth(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('undangan_admin_authenticated', 'true');
        localStorage.setItem('undangan_admin_email', user.email || '');
      } else {
        // Only clear if not using legacy password bypass
      }
      callback(user);
    });
  },

  // Helper translation for Firebase Auth error codes to user-friendly Indonesian
  getErrorMessage(error: any): string {
    const code = error?.code || '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email atau kata sandi tidak cocok. Jika Anda belum pernah mendaftar di Firebase proyek ini, silakan klik tab "Daftar" untuk mendaftarkan akun admin baru, atau gunakan tab "Sandi Master".';
      case 'auth/email-already-in-use':
        return 'Email ini sudah terdaftar. Silakan pilih tab "Masuk" untuk login.';
      case 'auth/invalid-email':
        return 'Format email tidak valid. Masukkan email yang benar (contoh: admin@gmail.com).';
      case 'auth/weak-password':
        return 'Kata sandi terlalu pendek. Gunakan minimal 6 karakter.';
      case 'auth/operation-not-allowed':
        return 'Metode login Email/Password belum diaktifkan di Firebase Console. Buka Firebase Console > Authentication > Sign-in method > aktifkan Email/Password.';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat atau reset kata sandi.';
      case 'auth/network-request-failed':
        return 'Gagal terhubung ke server Firebase. Periksa koneksi internet Anda.';
      default:
        return error?.message || 'Terjadi kesalahan saat otentikasi. Silakan coba lagi.';
    }
  },
};
