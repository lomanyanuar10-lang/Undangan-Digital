import React from 'react';
import { Eye, Users, UserCheck, UserX, Clock, Download, RefreshCw, Smartphone, Share2, Sparkles } from 'lucide-react';
import { EventData, RsvpResponse, VisitorStats } from '../types';
import { storageService } from '../services/storageService';

interface AdminDashboardProps {
  event: EventData;
  stats: VisitorStats;
  rsvps: RsvpResponse[];
  onOpenPreview: () => void;
  onResetDefault: () => void;
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  event,
  stats,
  rsvps,
  onOpenPreview,
  onResetDefault,
  setActiveTab,
}) => {
  const hadirCount = rsvps.filter((r) => r.status === 'hadir').length;
  const tidakHadirCount = rsvps.filter((r) => r.status === 'tidak_hadir').length;
  const tentatifCount = rsvps.filter((r) => r.status === 'tentatif').length;
  const totalPaxHadir = rsvps
    .filter((r) => r.status === 'hadir')
    .reduce((sum, r) => sum + (r.attendees || 1), 0);

  const handleExportCsv = () => {
    if (rsvps.length === 0) {
      alert('Belum ada data RSVP untuk diekspor.');
      return;
    }

    const headers = ['ID', 'Nama', 'Status', 'Jumlah Orang (Pax)', 'Pesan / Doa', 'Tanggal RSVP'];
    const rows = rsvps.map((r) => [
      `"${r.id}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.status}"`,
      r.attendees,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RSVP_${event.slug}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-r from-emerald-900/90 via-emerald-950/90 to-emerald-900/90 p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Ringkasan Acara
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100">{event.title}</h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
            {event.dateStr} &bull; {event.venueName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-dash-preview"
            onClick={onOpenPreview}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
          <button
            id="btn-dash-export"
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-amber-400/30 text-amber-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1 */}
        <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pengunjung</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-200">{stats.totalVisits}</p>
            <p className="text-[10px] text-emerald-300/70 mt-0.5">{stats.invitationsOpened} buka undangan</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total RSVP</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-200">{rsvps.length}</p>
            <p className="text-[10px] text-emerald-300/70 mt-0.5">respon tercatat</p>
          </div>
        </div>

        {/* Card 3: Hadir */}
        <div className="rounded-2xl bg-emerald-900/60 border border-emerald-500/40 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Hadir</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{hadirCount}</p>
            <p className="text-[10px] text-emerald-200/80 mt-0.5 font-bold">Total: {totalPaxHadir} Pax (Tamu)</p>
          </div>
        </div>

        {/* Card 4: Tentatif */}
        <div className="rounded-2xl bg-amber-950/40 border border-amber-500/40 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Tentatif</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">{tentatifCount}</p>
            <p className="text-[10px] text-amber-200/70 mt-0.5">menunggu konfirmasi</p>
          </div>
        </div>

        {/* Card 5: Tidak Hadir */}
        <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 p-4 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Berhalangan</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-300">{tidakHadirCount}</p>
            <p className="text-[10px] text-rose-200/70 mt-0.5">tidak dapat hadir</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <button
          onClick={() => setActiveTab('info')}
          className="p-5 rounded-2xl bg-emerald-950/80 border border-amber-400/20 hover:border-amber-400/60 text-left transition-all hover:scale-[1.01] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
            <span className="text-lg">📅</span>
          </div>
          <h4 className="font-bold text-amber-100 text-sm">Informasi Acara</h4>
          <p className="text-xs text-emerald-200/70 mt-1">Ubah judul, tema, penceramah, waktu, dan lokasi</p>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className="p-5 rounded-2xl bg-emerald-950/80 border border-amber-400/20 hover:border-amber-400/60 text-left transition-all hover:scale-[1.01] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
            <span className="text-lg">📋</span>
          </div>
          <h4 className="font-bold text-amber-100 text-sm">Susunan Acara</h4>
          <p className="text-xs text-emerald-200/70 mt-1">Kelola timeline sesi, jam, dan judul agenda</p>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className="p-5 rounded-2xl bg-emerald-950/80 border border-amber-400/20 hover:border-amber-400/60 text-left transition-all hover:scale-[1.01] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
            <span className="text-lg">🖼</span>
          </div>
          <h4 className="font-bold text-amber-100 text-sm">Galeri Kegiatan</h4>
          <p className="text-xs text-emerald-200/70 mt-1">Tambah, hapus foto dokumentasi dan ubah caption</p>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className="p-5 rounded-2xl bg-emerald-950/80 border border-amber-400/20 hover:border-amber-400/60 text-left transition-all hover:scale-[1.01] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
            <span className="text-lg">🎨</span>
          </div>
          <h4 className="font-bold text-amber-100 text-sm">Pengaturan Tema</h4>
          <p className="text-xs text-emerald-200/70 mt-1">Pilih preset tema, warna, font, dan custom background</p>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className="p-5 rounded-2xl bg-emerald-950/80 border border-amber-400/20 hover:border-amber-400/60 text-left transition-all hover:scale-[1.01] cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors">
            <span className="text-lg">🔒</span>
          </div>
          <h4 className="font-bold text-amber-100 text-sm">Keamanan &amp; Akun</h4>
          <p className="text-xs text-emerald-200/70 mt-1">Kelola tautan rahasia admin, sandi master, dan tambah panitia</p>
        </button>
      </div>

      {/* Firestore Cloud Sync Guide Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900/40 border border-amber-400/30 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-lg">🔥</span>
            <div>
              <h4 className="font-bold text-amber-200 text-xs sm:text-sm">Status Sinkronisasi Firebase Firestore</h4>
              <p className="text-[11px] text-emerald-200/70">Proyek: <strong className="text-amber-300 font-mono">loman-digital-invitation</strong></p>
            </div>
          </div>
          <button
            onClick={() => {
              const rules = `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /events/{eventId} {\n      allow read: if true;\n      allow create, update, write: if true;\n      allow delete: if request.auth != null;\n\n      match /rsvps/{rsvpId} {\n        allow read, create, update, write: if true;\n        allow delete: if true;\n      }\n      match /stats/{statId} {\n        allow read, write: if true;\n      }\n    }\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}`;
              navigator.clipboard.writeText(rules);
              alert('Firestore Security Rules berhasil disalin! Silakan tempel di Firebase Console > Firestore Database > Rules.');
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold transition-all shadow cursor-pointer shrink-0"
          >
            📋 Salin Aturan Firestore Rules
          </button>
        </div>
        <p className="text-[11px] text-emerald-300/80 leading-relaxed">
          Jika Anda melihat pesan izin akses (<em>insufficient permissions</em>) saat menyimpan acara, buka <strong>Firebase Console &gt; Firestore Database &gt; Rules</strong>, lalu tempel aturan di atas dan klik <strong>Publish</strong>.
        </p>
      </div>

      {/* Reset & Maintenance Tools */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border border-amber-400/20 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900">
          <div>
            <h5 className="font-bold text-amber-200">Statistik Pengunjung</h5>
            <p className="text-emerald-200/70 text-[11px]">
              Mulai ulang hitungan kunjungan & undangan dibuka ke 0 untuk peluncuran resmi undangan.
            </p>
          </div>
          <button
            id="btn-reset-visitor-stats"
            type="button"
            onClick={() => {
              storageService.resetStats(event.slug);
              alert('Statistik pengunjung berhasil di-reset ke 0.');
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 border border-amber-400/30 text-amber-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Pengunjung ke 0</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-amber-200">Data Acara Bawaan</h5>
            <p className="text-emerald-200/70 text-[11px]">
              Kembalikan susunan acara, lokasi, dan teks ke pengaturan awal Maulid Nabi 1448 H.
            </p>
          </div>
          <button
            id="btn-reset-default-event"
            type="button"
            onClick={onResetDefault}
            className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/30 text-amber-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset ke Data Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
