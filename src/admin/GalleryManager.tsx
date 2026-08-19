import React, { useState } from 'react';
import { Plus, Trash2, Upload, Link2, Sparkles, ArrowUp, ArrowDown, Check, AlertTriangle, X } from 'lucide-react';
import { EventData, GalleryItem } from '../types';

interface GalleryManagerProps {
  event: EventData;
  onSave: (updated: EventData) => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ event, onSave }) => {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(event.gallery || []);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (newList: GalleryItem[]) => {
    setGalleryList(newList);
    onSave({ ...event, gallery: newList });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      url: newUrl.trim(),
      caption: newCaption.trim() || 'Dokumentasi Acara',
      alt: newCaption.trim() || 'Foto Dokumentasi',
      order: galleryList.length + 1,
    };

    const updated = [...galleryList, newItem];
    handleSaveAll(updated);
    setNewUrl('');
    setNewCaption('');
    setShowAddModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newItem: GalleryItem = {
            id: `gal-${Date.now()}`,
            url: reader.result,
            caption: newCaption.trim() || file.name.replace(/\.[^/.]+$/, ''),
            alt: file.name,
            order: galleryList.length + 1,
          };
          const updated = [...galleryList, newItem];
          handleSaveAll(updated);
          setShowAddModal(false);
          setNewCaption('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    const updated = galleryList.filter((item) => item.id !== deletingId);
    handleSaveAll(updated);
    setDeletingId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= galleryList.length) return;

    const copy = [...galleryList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    handleSaveAll(copy);
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    const updated = galleryList.map((item) => (item.id === id ? { ...item, caption } : item));
    handleSaveAll(updated);
  };

  const itemToDelete = galleryList.find((g) => g.id === deletingId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-400/20">
        <div>
          <h3 className="text-lg font-bold text-amber-100">Manajemen Galeri Dokumentasi</h3>
          <p className="text-xs text-emerald-200/70">
            Upload foto atau gunakan URL gambar untuk dokumentasi kegiatan
          </p>
        </div>

        <button
          id="btn-add-gallery-photo"
          type="button"
          onClick={() => setShowAddModal(!showAddModal)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddModal ? 'Tutup Form' : 'Tambah Foto Baru'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-900/90 border border-emerald-400 text-emerald-100 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Galeri berhasil diperbarui!</span>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="p-5 rounded-2xl bg-emerald-900/70 border border-amber-400/30 space-y-4 animate-in fade-in">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Tambah Foto ke Galeri
          </h4>

          <form onSubmit={handleAddImage} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-amber-200 mb-1">
                Keterangan / Caption Foto
              </label>
              <input
                type="text"
                placeholder="Contoh: Penampilan Hadroh Santri"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-amber-200">
                  Opsi 1: Masukkan URL Gambar (https://...)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shrink-0 cursor-pointer shadow-md"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-amber-200">
                  Opsi 2: Upload Langsung dari Perangkat
                </label>
                <label className="w-full py-2 px-3 rounded-xl bg-emerald-950/80 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-900 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Pilih File Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {galleryList.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-emerald-200/60 bg-emerald-950/40 rounded-2xl border border-emerald-800">
            Belum ada foto dalam galeri. Silakan tambahkan foto melalui tombol di atas.
          </div>
        ) : (
          galleryList.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl bg-emerald-950/80 border border-amber-400/20 overflow-hidden shadow-md group hover:border-amber-400/50 transition-all flex flex-col relative"
            >
              <div className="relative aspect-video bg-emerald-900 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.alt || item.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-950/90 text-[10px] font-bold text-amber-300 border border-amber-400/30 shadow">
                  #{index + 1}
                </div>

                <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 bg-emerald-950/85 p-1 rounded-xl border border-amber-400/30 shadow-lg backdrop-blur-sm">
                  <button
                    type="button"
                    title="Pindah ke Atas/Kiri"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded-lg text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/80 disabled:opacity-25 cursor-pointer transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Pindah ke Bawah/Kanan"
                    disabled={index === galleryList.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded-lg text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/80 disabled:opacity-25 cursor-pointer transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Hapus Foto"
                    id={`btn-delete-photo-${item.id}`}
                    onClick={() => setDeletingId(item.id)}
                    className="p-1 rounded-lg bg-rose-900/80 hover:bg-rose-700 text-rose-200 hover:text-white cursor-pointer transition-all shadow border border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-950 flex-1 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] text-emerald-300/70 mb-0.5">Caption:</label>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-900/70 border border-amber-400/20 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal for Delete */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-emerald-950 border border-amber-400/40 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-base text-amber-100">Hapus Foto Galeri?</h4>
              <p className="text-xs text-emerald-200/70 mt-1">
                Foto {itemToDelete?.caption ? `"${itemToDelete.caption}"` : 'ini'} akan dihapus dari dokumentasi kegiatan.
              </p>
            </div>

            {itemToDelete && (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-amber-400/20 bg-emerald-900">
                <img
                  src={itemToDelete.url}
                  alt={itemToDelete.caption}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

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
                id="btn-confirm-delete-photo"
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

