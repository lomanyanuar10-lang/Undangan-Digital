import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Eye, RefreshCw, X, Sparkles, ExternalLink } from 'lucide-react';
import { EventData } from '../types';
import { InvitationView } from '../components/InvitationView';

interface LivePreviewProps {
  event: EventData;
  onClose?: () => void;
  isFullscreen?: boolean;
}

type DeviceType = 'iphone' | 'android' | 'tablet';

export const LivePreview: React.FC<LivePreviewProps> = ({ event, onClose, isFullscreen = false }) => {
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [key, setKey] = useState(0);

  const reloadPreview = () => {
    setKey((prev) => prev + 1);
  };

  const getDeviceDimensions = () => {
    switch (device) {
      case 'iphone':
        return 'w-[390px] h-[780px] max-h-[84vh]';
      case 'android':
        return 'w-[360px] h-[740px] max-h-[82vh]';
      case 'tablet':
        return 'w-[640px] h-[820px] max-h-[86vh]';
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-emerald-950/90 border-b border-amber-400/20 mb-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Live Preview Real-time
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-emerald-900/60 p-1 rounded-xl border border-amber-400/20">
          <button
            onClick={() => setDevice('iphone')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              device === 'iphone'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iPhone (390px)</span>
          </button>

          <button
            onClick={() => setDevice('android')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              device === 'android'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android (360px)</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              device === 'tablet'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet (640px)</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            title="Reload Preview"
            onClick={reloadPreview}
            className="p-1.5 rounded-lg bg-emerald-900 text-amber-300 hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              title="Tutup Preview"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-900 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Device Frame Wrapper */}
      <div className="flex-1 w-full flex items-center justify-center p-2">
        <div
          className={`relative ${getDeviceDimensions()} transition-all duration-300 rounded-[44px] p-3 bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-4 border-amber-400/40 flex flex-col`}
        >
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-end pr-2">
            <div className="w-2 h-2 rounded-full bg-emerald-950 border border-emerald-800" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full rounded-[36px] overflow-hidden bg-emerald-950 relative">
            <div
              key={key}
              className="w-full h-full overflow-y-auto overflow-x-hidden select-none"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <InvitationView
                event={event}
                onOpenAdmin={() => {}}
                isSimulated={true}
              />
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-400/60 rounded-full z-30" />
        </div>
      </div>
    </div>
  );
};
