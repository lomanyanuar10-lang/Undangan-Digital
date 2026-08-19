import React, { useState } from 'react';
import { Users, Search, Download, Trash2, CheckCircle2, UserCheck, UserX, Clock, MessageSquare } from 'lucide-react';
import { RsvpResponse, RsvpStatus } from '../types';
import { storageService } from '../services/storageService';

interface RsvpManagerProps {
  eventId: string;
  rsvps: RsvpResponse[];
  onRefresh: () => void;
}

export const RsvpManager: React.FC<RsvpManagerProps> = ({ eventId, rsvps, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = rsvps.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const confirmDelete = () => {
    if (!deletingId) return;
    storageService.deleteRsvp(eventId, deletingId);
    onRefresh();
    setDeletingId(null);
  };

  const handleExportCsv = () => {
    if (rsvps.length === 0) {
      alert('Belum ada data RSVP untuk diekspor.');
      return;
    }

    const headers = ['ID', 'Nama', 'Status', 'Pax', 'Pesan Doa', 'Tanggal'];
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
    link.setAttribute('download', `RSVP_Undangan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-400/20">
        <div>
          <h3 className="text-lg font-bold text-amber-100">Daftar Konfirmasi Kehadiran (RSVP)</h3>
          <p className="text-xs text-emerald-200/70">
            Total {rsvps.length} tamu telah memberikan konfirmasi
          </p>
        </div>

        <button
          id="btn-export-csv-rsvp"
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Data ke CSV</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama tamu atau doa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-emerald-950/80 border border-amber-400/25 text-emerald-50 placeholder-emerald-400/40 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-amber-500 text-emerald-950 font-bold'
                : 'bg-emerald-900/60 border border-amber-400/20 text-emerald-200 hover:bg-emerald-900'
            }`}
          >
            Semua ({rsvps.length})
          </button>
          <button
            onClick={() => setFilterStatus('hadir')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'hadir'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-900/60 border border-amber-400/20 text-emerald-200 hover:bg-emerald-900'
            }`}
          >
            Hadir ({rsvps.filter((r) => r.status === 'hadir').length})
          </button>
          <button
            onClick={() => setFilterStatus('tentatif')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'tentatif'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-emerald-900/60 border border-amber-400/20 text-emerald-200 hover:bg-emerald-900'
            }`}
          >
            Tentatif ({rsvps.filter((r) => r.status === 'tentatif').length})
          </button>
          <button
            onClick={() => setFilterStatus('tidak_hadir')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'tidak_hadir'
                ? 'bg-rose-700 text-white font-bold'
                : 'bg-emerald-900/60 border border-amber-400/20 text-emerald-200 hover:bg-emerald-900'
            }`}
          >
            Tidak Hadir ({rsvps.filter((r) => r.status === 'tidak_hadir').length})
          </button>
        </div>
      </div>

      {/* Table / List */}
      <div className="rounded-2xl border border-amber-400/25 bg-emerald-950/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-emerald-900/90 text-amber-300 font-bold uppercase tracking-wider border-b border-amber-400/30 text-[10px]">
              <tr>
                <th className="px-4 py-3">Nama Tamu</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Pax</th>
                <th className="px-4 py-3">Pesan & Doa</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-emerald-300/60">
                    Tidak ada data konfirmasi kehadiran yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-900/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-amber-100 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-amber-300">
                      {item.status === 'hadir' ? `${item.attendees} orang` : '-'}
                    </td>
                    <td className="px-4 py-3 max-w-xs text-emerald-200/90 italic">
                      {item.message ? `"${item.message}"` : '-'}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-emerald-300/60 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        title="Hapus konfirmasi"
                        onClick={() => setDeletingId(item.id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-emerald-950 border border-amber-400/40 p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <h4 className="font-bold text-base text-amber-100">Hapus Data RSVP?</h4>
              <p className="text-xs text-emerald-200/70 mt-1">
                Data konfirmasi kehadiran tamu ini akan dihapus dari sistem dan Firestore.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="py-2.5 px-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
