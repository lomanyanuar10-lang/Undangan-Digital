import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Save, Clock, Check, Music, BookOpen, Mic, HeartHandshake } from 'lucide-react';
import { EventData, ScheduleItem } from '../types';

interface ScheduleManagerProps {
  event: EventData;
  onSave: (updated: EventData) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ event, onSave }) => {
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>(event.schedule || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<ScheduleItem, 'id'>>({
    time: '07.30',
    title: '',
    description: '',
    icon: 'Music',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (newList: ScheduleItem[]) => {
    setScheduleList(newList);
    onSave({ ...event, schedule: newList });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.time.trim()) return;

    const itemToAdd: ScheduleItem = {
      id: `sch-${Date.now()}`,
      time: newItem.time.trim(),
      title: newItem.title.trim(),
      description: newItem.description?.trim() || '',
      icon: newItem.icon || 'Music',
    };

    const updated = [...scheduleList, itemToAdd];
    handleSaveAll(updated);
    setNewItem({ time: '', title: '', description: '', icon: 'Music' });
    setShowAddForm(false);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    const updated = scheduleList.filter((item) => item.id !== deletingId);
    handleSaveAll(updated);
    setDeletingId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= scheduleList.length) return;

    const copy = [...scheduleList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    handleSaveAll(copy);
  };

  const handleUpdateItem = (id: string, updatedFields: Partial<ScheduleItem>) => {
    const updated = scheduleList.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    handleSaveAll(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-400/20">
        <div>
          <h3 className="text-lg font-bold text-amber-100">Manajemen Susunan Acara</h3>
          <p className="text-xs text-emerald-200/70">
            Tambah, edit waktu, urutkan, dan kelola agenda kegiatan Maulid
          </p>
        </div>

        <button
          id="btn-add-schedule-item"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Sesi Acara'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-900/90 border border-emerald-400 text-emerald-100 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Susunan acara berhasil diperbarui!</span>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="p-5 rounded-2xl bg-emerald-900/70 border border-amber-400/30 space-y-4 animate-in fade-in"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Tambah Sesi Kegiatan Baru
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-amber-200 mb-1">
                Waktu (Jam)
              </label>
              <input
                type="text"
                required
                placeholder="Misal: 08.00"
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-amber-200 mb-1">
                Nama Kegiatan
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Pembacaan Kitab Maulid"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-amber-200 mb-1">
              Keterangan / Deskripsi (Opsional)
            </label>
            <input
              type="text"
              placeholder="Misal: Pembacaan dipimpin oleh Ustadz..."
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md"
            >
              Tambahkan
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {scheduleList.length === 0 ? (
          <p className="text-xs text-center text-emerald-200/60 py-6">
            Belum ada susunan acara. Silakan tambahkan sesi baru di atas.
          </p>
        ) : (
          scheduleList.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl bg-emerald-950/80 border border-amber-400/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md hover:border-amber-400/40 transition-all"
            >
              {editingId === item.id ? (
                /* Inline Edit Form */
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      defaultValue={item.time}
                      id={`edit-time-${item.id}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-900 border border-amber-400/40 text-emerald-50 text-xs"
                    />
                    <input
                      type="text"
                      defaultValue={item.title}
                      id={`edit-title-${item.id}`}
                      className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-emerald-900 border border-amber-400/40 text-emerald-50 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    defaultValue={item.description || ''}
                    id={`edit-desc-${item.id}`}
                    placeholder="Deskripsi kegiatan..."
                    className="w-full px-3 py-1.5 rounded-lg bg-emerald-900 border border-amber-400/40 text-emerald-50 text-xs"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const timeEl = document.getElementById(`edit-time-${item.id}`) as HTMLInputElement;
                        const titleEl = document.getElementById(`edit-title-${item.id}`) as HTMLInputElement;
                        const descEl = document.getElementById(`edit-desc-${item.id}`) as HTMLInputElement;
                        handleUpdateItem(item.id, {
                          time: timeEl.value,
                          title: titleEl.value,
                          description: descEl.value,
                        });
                      }}
                      className="px-3 py-1 rounded bg-amber-500 text-emerald-950 text-xs font-bold"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 rounded bg-emerald-900 text-emerald-300 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-400 font-bold text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-900 border border-amber-400/30 text-amber-300 font-bold text-xs">
                          {item.time} WIB
                        </span>
                        <h4 className="font-bold text-amber-100 text-sm">{item.title}</h4>
                      </div>
                      {item.description && (
                        <p className="text-xs text-emerald-200/70 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      title="Geser ke atas"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      title="Geser ke bawah"
                      disabled={index === scheduleList.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => setEditingId(item.id)}
                      className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Hapus Sesi Acara"
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal for Delete */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-emerald-950 border border-amber-400/40 p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <h4 className="font-bold text-base text-amber-100">Hapus Sesi Acara?</h4>
              <p className="text-xs text-emerald-200/70 mt-1">
                Agenda ini akan dihapus dari susunan jadwal acara Maulid.
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
