import React, { useState } from 'react';
import {
  Save,
  Sparkles,
  User,
  MapPin,
  Calendar,
  Clock,
  Music,
  Video,
  HeartHandshake,
  CheckCircle2,
  Upload,
  Play,
  Building2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { EventData } from '../types';
import { getYouTubeEmbedUrl } from '../utils/videoUtils';

interface EventFormProps {
  event: EventData;
  onSave: (updated: EventData) => void;
}

const SCHOOL_SLOT_LABELS = [
  'Logo 1 (misal: SMP Sulthan)',
  'Logo 2 (misal: SMK Attajir)',
  'Logo 3 (misal: SMK Saradan)',
  'Logo 4 (misal: Yayasan / Lembaga)',
];

export const EventForm: React.FC<EventFormProps> = ({ event, onSave }) => {
  const [formData, setFormData] = useState<EventData>({
    ...event,
    schoolLogos: event.schoolLogos || ['', '', '', ''],
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof EventData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpeakerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleChange('speakerPhotoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const currentLogos = [...(formData.schoolLogos || ['', '', '', ''])];
          while (currentLogos.length < 4) currentLogos.push('');
          currentLogos[index] = reader.result;
          handleChange('schoolLogos', currentLogos);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUrlChange = (index: number, url: string) => {
    const currentLogos = [...(formData.schoolLogos || ['', '', '', ''])];
    while (currentLogos.length < 4) currentLogos.push('');
    currentLogos[index] = url;
    handleChange('schoolLogos', currentLogos);
  };

  const handleRemoveLogo = (index: number) => {
    const currentLogos = [...(formData.schoolLogos || ['', '', '', ''])];
    while (currentLogos.length < 4) currentLogos.push('');
    currentLogos[index] = '';
    handleChange('schoolLogos', currentLogos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentLogosList = formData.schoolLogos || ['', '', '', ''];
  const uploadedLogosCount = currentLogosList.filter((l) => l && l.trim()).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-400/20">
        <div>
          <h3 className="text-lg font-bold text-amber-100">Informasi Utama Acara</h3>
          <p className="text-xs text-emerald-200/70">Perubahan akan langsung terupdate ke Live Preview dan publik</p>
        </div>

        <button
          id="btn-save-event-info"
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-900/90 border border-emerald-400 text-emerald-100 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Informasi acara berhasil disimpan dan disinkronkan secara realtime!</span>
        </div>
      )}

      {/* Grid 0: 4 Optional School/Foundation Logos (Placed at top) */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/35 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Logo Sekolah / Yayasan (4 Slot Opsional)</span>
            </h4>
            <p className="text-[11px] text-emerald-200/80 mt-0.5">
              Logo akan ditampilkan di barisan paling atas undangan. Jika tidak diisi, tampilan akan tetap menggunakan ornamen kubah/bintang bulan bawaan.
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-900 border border-amber-400/30 text-amber-300 font-semibold self-start sm:self-auto">
            {uploadedLogosCount} dari 4 logo terpasang
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {[0, 1, 2, 3].map((idx) => {
            const logoVal = currentLogosList[idx] || '';
            const hasLogo = Boolean(logoVal && logoVal.trim());

            return (
              <div
                key={idx}
                className="rounded-xl bg-emerald-900/40 border border-amber-400/20 p-3.5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-200 truncate">
                      {SCHOOL_SLOT_LABELS[idx]}
                    </span>
                    {hasLogo && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLogo(idx)}
                        title="Hapus logo ini"
                        className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/60 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-full h-24 rounded-lg bg-white/95 border border-amber-400/30 flex items-center justify-center p-2 mb-2.5 overflow-hidden shadow-inner relative group">
                    {hasLogo ? (
                      <img
                        src={logoVal}
                        alt={`Logo ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-emerald-800/50 text-[11px]">
                        <ImageIcon className="w-6 h-6 mb-1 text-emerald-800/40" />
                        <span>(Belum ada logo)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {/* File Upload Button */}
                  <label className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-amber-400/25 cursor-pointer transition-all active:scale-95">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{hasLogo ? 'Ganti File' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(idx, e)}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <input
                    type="url"
                    placeholder="atau tempel URL gambar..."
                    value={logoVal.startsWith('data:') ? '(Gambar terunggah)' : logoVal}
                    onChange={(e) => handleLogoUrlChange(idx, e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-950/90 border border-amber-400/25 text-emerald-100 placeholder-emerald-400/40 text-[11px] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid 1: Basic Event Identity */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Identitas Acara</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Nama Acara <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Tema Acara <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 mb-1">
            Deskripsi / Muqaddimah Undangan
          </label>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>
      </div>

      {/* Grid 2: Date & Time */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Waktu & Tanggal</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Tampilan Tanggal (Teks)
            </label>
            <input
              type="text"
              value={formData.dateStr}
              onChange={(e) => handleChange('dateStr', e.target.value)}
              placeholder="Selasa, 1 September 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Waktu Mulai (Countdown Target ISO)
            </label>
            <input
              type="datetime-local"
              value={formData.dateTimeIso ? formData.dateTimeIso.substring(0, 16) : '2026-09-01T07:30'}
              onChange={(e) => handleChange('dateTimeIso', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Tampilan Jam
            </label>
            <input
              type="text"
              value={formData.timeStr}
              onChange={(e) => handleChange('timeStr', e.target.value)}
              placeholder="07.30 WIB - Selesai"
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Grid 3: Speaker Details */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>Informasi Penceramah</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Nama Penceramah
            </label>
            <input
              type="text"
              value={formData.speakerName}
              onChange={(e) => handleChange('speakerName', e.target.value)}
              placeholder="Ustad Ricky Yakub"
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Gelar / Julukan
            </label>
            <input
              type="text"
              value={formData.speakerTitle}
              onChange={(e) => handleChange('speakerTitle', e.target.value)}
              placeholder="(Jaka Tarub)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-amber-200">
              URL Foto Penceramah
            </label>
            <input
              type="text"
              value={formData.speakerPhotoUrl}
              onChange={(e) => handleChange('speakerPhotoUrl', e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-emerald-900 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-800">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto dari Perangkat</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSpeakerPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Photo Thumbnail preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400/60 bg-emerald-900 flex items-center justify-center shadow-md">
              {formData.speakerPhotoUrl ? (
                <img
                  src={formData.speakerPhotoUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-amber-400/50" />
              )}
            </div>
            <span className="text-[10px] text-emerald-300/70 mt-1">Preview Foto</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 mb-1">
            Profil Singkat / Bio Penceramah
          </label>
          <input
            type="text"
            value={formData.speakerBio || ''}
            onChange={(e) => handleChange('speakerBio', e.target.value)}
            placeholder="Da'i Nasional & Pembina Generasi Muda Qur'ani"
            className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Grid 4: Venue & Location */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>Lokasi & Tempat Acara</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-amber-200 mb-1">
            Nama Tempat / Gedung
          </label>
          <input
            type="text"
            value={formData.venueName}
            onChange={(e) => handleChange('venueName', e.target.value)}
            placeholder="Komplek Pendidikan SMP Sulthan SMK Attajir dan SMK Saradan"
            className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 mb-1">
            Alamat Lengkap
          </label>
          <input
            type="text"
            value={formData.venueAddress}
            onChange={(e) => handleChange('venueAddress', e.target.value)}
            placeholder="Jl. Raya Tonjong No.18"
            className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Google Maps URL (Direct Link)
            </label>
            <input
              type="text"
              value={formData.mapsUrl}
              onChange={(e) => handleChange('mapsUrl', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Google Maps Embed URL (Iframe)
            </label>
            <input
              type="text"
              value={formData.mapsEmbedUrl}
              onChange={(e) => handleChange('mapsEmbedUrl', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Grid 5: Audio, Video & Feature Toggles */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5" />
          <span>Audio, Video & Pengaturan Fitur</span>
        </h4>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Audio Musik URL (.mp3)
            </label>
            <input
              type="text"
              value={formData.audioUrl}
              onChange={(e) => handleChange('audioUrl', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-amber-200">
                Video YouTube URL (Opsional)
              </label>
              <span className="text-[10px] text-emerald-300/70">Mendukung link youtube.com, youtu.be, shorts, atau embed</span>
            </div>
            <input
              type="text"
              value={formData.videoUrl || ''}
              onChange={(e) => handleChange('videoUrl', e.target.value)}
              placeholder="Contoh: https://www.youtube.com/watch?v=f2vj494cW78 atau https://youtu.be/..."
              className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
            />
            {formData.videoUrl && getYouTubeEmbedUrl(formData.videoUrl) && (
              <div className="mt-2.5 p-3 rounded-xl bg-emerald-900/40 border border-amber-400/20">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 mb-2">
                  <Play className="w-3.5 h-3.5" />
                  <span>Pratinjau Video YouTube:</span>
                </div>
                <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-emerald-700 bg-black">
                  <iframe
                    title="Preview YouTube"
                    src={getYouTubeEmbedUrl(formData.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Switches */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-900/60 border border-amber-400/20 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAudioEnabled}
              onChange={(e) => handleChange('isAudioEnabled', e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-emerald-100">Audio Player</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-900/60 border border-amber-400/20 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCountdownEnabled}
              onChange={(e) => handleChange('isCountdownEnabled', e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-emerald-100">Countdown</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-900/60 border border-amber-400/20 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRsvpEnabled}
              onChange={(e) => handleChange('isRsvpEnabled', e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-emerald-100">Form RSVP</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-900/60 border border-amber-400/20 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNavbarEnabled}
              onChange={(e) => handleChange('isNavbarEnabled', e.target.checked)}
              className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-emerald-100">Bottom Navbar</span>
          </label>
        </div>
      </div>
    </form>
  );
};
