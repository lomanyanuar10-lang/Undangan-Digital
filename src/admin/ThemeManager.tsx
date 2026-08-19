import React, { useState } from 'react';
import { Palette, Check, Sparkles, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { EventData, ThemeConfig, ThemePreset } from '../types';

interface ThemeManagerProps {
  event: EventData;
  onSave: (updated: EventData) => void;
}

export const THEME_PRESETS: Record<
  ThemePreset,
  {
    name: string;
    description: string;
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    previewBg: string;
  }
> = {
  emerald: {
    name: 'Islamic Emerald (Bawaan)',
    description: 'Nuansa hijau zamrud islami mewah dengan ornamen emas bercahaya',
    primary: '#064e3b',
    secondary: '#022c22',
    accent: '#d97706',
    bg: '#022c22',
    previewBg: 'from-emerald-950 to-emerald-900',
  },
  gold: {
    name: 'Gold Luxury',
    description: 'Emas berkilau dengan latar belakang gelap megah nan agung',
    primary: '#78350f',
    secondary: '#1c1917',
    accent: '#f59e0b',
    bg: '#1c1917',
    previewBg: 'from-amber-950 via-stone-950 to-amber-900',
  },
  cream: {
    name: 'Cream Elegant',
    description: 'Sentuhan warna krem hangat, bersih, dan menyejukkan mata',
    primary: '#065f46',
    secondary: '#fefce8',
    accent: '#b45309',
    bg: '#fefce8',
    previewBg: 'from-amber-100 to-emerald-50',
  },
  dark: {
    name: 'Dark Islamic',
    description: 'Nuansa malam khidmat berbintang dengan siluet masjid modern',
    primary: '#0f172a',
    secondary: '#020617',
    accent: '#eab308',
    bg: '#020617',
    previewBg: 'from-slate-950 to-emerald-950',
  },
  custom: {
    name: 'Kustomisasi Penuh',
    description: 'Sesuaikan sendiri warna, gambar latar, dan gaya ornamen',
    primary: '#064e3b',
    secondary: '#022c22',
    accent: '#d97706',
    bg: '#022c22',
    previewBg: 'from-emerald-900 to-amber-950',
  },
};

export const ThemeManager: React.FC<ThemeManagerProps> = ({ event, onSave }) => {
  const [theme, setTheme] = useState<ThemeConfig>({ ...event.themeConfig });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const applyPreset = (presetKey: ThemePreset) => {
    const selected = THEME_PRESETS[presetKey];
    const updated: ThemeConfig = {
      ...theme,
      preset: presetKey,
      primaryColor: selected.primary,
      secondaryColor: selected.secondary,
      accentColor: selected.accent,
      backgroundColor: selected.bg,
      backgroundStyle: presetKey === 'emerald' ? 'pattern' : 'gradient',
    };
    setTheme(updated);
    onSave({ ...event, themeConfig: updated });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCustomChange = (field: keyof ThemeConfig, val: any) => {
    const updated: ThemeConfig = {
      ...theme,
      preset: 'custom',
      [field]: val,
    };
    setTheme(updated);
    onSave({ ...event, themeConfig: updated });
  };

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleCustomChange('backgroundImageUrl', reader.result);
          handleCustomChange('backgroundStyle', 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-400/20">
        <div>
          <h3 className="text-lg font-bold text-amber-100">Pengaturan Tema & Tampilan</h3>
          <p className="text-xs text-emerald-200/70">
            Pilih preset nuansa islami atau kustomisasi warna dan gambar latar undangan
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-900/90 border border-emerald-400 text-emerald-100 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Tema berhasil diterapkan!</span>
        </div>
      )}

      {/* Preset Cards */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          <span>Pilih Preset Desain Islami</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {(Object.keys(THEME_PRESETS) as ThemePreset[])
            .filter((k) => k !== 'custom')
            .map((key) => {
              const p = THEME_PRESETS[key];
              const isSelected = theme.preset === key;
              return (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-900/90 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'bg-emerald-950/70 border-amber-400/20 hover:border-amber-400/50'
                  }`}
                >
                  <div className={`h-16 w-full rounded-xl bg-gradient-to-br ${p.previewBg} mb-3 flex items-center justify-center border border-amber-400/30 shadow-inner`}>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-amber-100 text-sm">{p.name}</h5>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-200/70 leading-snug">{p.description}</p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Background Options */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Gambar Latar Belakang (Background)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleCustomChange('backgroundStyle', 'pattern')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              theme.backgroundStyle === 'pattern'
                ? 'bg-emerald-800 border-amber-400 text-amber-300'
                : 'bg-emerald-900/40 border-amber-400/20 text-emerald-200'
            }`}
          >
            Pattern Geometri Islami
          </button>
          <button
            type="button"
            onClick={() => handleCustomChange('backgroundStyle', 'gradient')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              theme.backgroundStyle === 'gradient'
                ? 'bg-emerald-800 border-amber-400 text-amber-300'
                : 'bg-emerald-900/40 border-amber-400/20 text-emerald-200'
            }`}
          >
            Gradient Mewah
          </button>
          <button
            type="button"
            onClick={() => handleCustomChange('backgroundStyle', 'image')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
              theme.backgroundStyle === 'image'
                ? 'bg-emerald-800 border-amber-400 text-amber-300'
                : 'bg-emerald-900/40 border-amber-400/20 text-emerald-200'
            }`}
          >
            Custom Foto Background
          </button>
        </div>

        {theme.backgroundStyle === 'image' && (
          <div className="space-y-3 pt-2 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                URL Gambar Background (https://...)
              </label>
              <input
                type="text"
                value={theme.backgroundImageUrl || ''}
                onChange={(e) => handleCustomChange('backgroundImageUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="w-full py-2.5 px-4 rounded-xl bg-emerald-900/80 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-800">
                <Upload className="w-4 h-4" />
                <span>Upload Foto Background dari Perangkat</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Color Customizer */}
      <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/25 p-5 space-y-4 shadow-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          <span>Warna & Tipografi (CSS Variables)</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1.5">
              Warna Utama (Primary)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => handleCustomChange('primaryColor', e.target.value)}
                className="w-9 h-9 rounded-lg border border-amber-400/40 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-emerald-200">{theme.primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1.5">
              Aksen Emas / Gold
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => handleCustomChange('accentColor', e.target.value)}
                className="w-9 h-9 rounded-lg border border-amber-400/40 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-emerald-200">{theme.accentColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1.5">
              Latar Belakang
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => handleCustomChange('backgroundColor', e.target.value)}
                className="w-9 h-9 rounded-lg border border-amber-400/40 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-emerald-200">{theme.backgroundColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1.5">
              Radius Sudut Card
            </label>
            <select
              value={theme.borderRadius || '16px'}
              onChange={(e) => handleCustomChange('borderRadius', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-emerald-900/60 border border-amber-400/30 text-emerald-50 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="8px">Klasik (8px)</option>
              <option value="16px">Modern (16px)</option>
              <option value="24px">Melengkung (24px)</option>
              <option value="32px">Ekstra Lengkung (32px)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
