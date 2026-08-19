import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Image as ImageIcon,
  Users,
  Palette,
  Eye,
  LogOut,
  ArrowLeft,
  Sparkles,
  Smartphone,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { EventData, RsvpResponse, VisitorStats } from '../types';
import { storageService } from '../services/storageService';
import { AdminDashboard } from './AdminDashboard';
import { EventForm } from './EventForm';
import { ScheduleManager } from './ScheduleManager';
import { GalleryManager } from './GalleryManager';
import { RsvpManager } from './RsvpManager';
import { ThemeManager } from './ThemeManager';
import { LivePreview } from './LivePreview';
import { CrescentStarIcon } from '../components/IslamicOrnaments';

interface AdminAppProps {
  onBackToInvitation: () => void;
  onLogout: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onBackToInvitation, onLogout }) => {
  const [currentSlug, setCurrentSlug] = useState<string>('maulid-1448');
  const [event, setEvent] = useState<EventData>(storageService.getEvent(currentSlug));
  const [rsvps, setRsvps] = useState<RsvpResponse[]>(storageService.getRsvps(event.id));
  const [stats, setStats] = useState<VisitorStats>(storageService.getStats(event.id));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showLivePreviewModal, setShowLivePreviewModal] = useState<boolean>(false);
  const [showSplitPreview, setShowSplitPreview] = useState<boolean>(false);

  useEffect(() => {
    const handleEventUpdate = (e: any) => {
      if (e.detail) {
        setEvent(e.detail);
      }
    };
    const handleRsvpUpdate = (e: any) => {
      if (e.detail) {
        setRsvps(e.detail);
        setStats(storageService.getStats(event.id));
      }
    };

    window.addEventListener('undangan:eventUpdated', handleEventUpdate);
    window.addEventListener('undangan:rsvpUpdated', handleRsvpUpdate);

    return () => {
      window.removeEventListener('undangan:eventUpdated', handleEventUpdate);
      window.removeEventListener('undangan:rsvpUpdated', handleRsvpUpdate);
    };
  }, [event.id]);

  const handleSaveEvent = (updated: EventData) => {
    setEvent(updated);
    storageService.saveEvent(updated);
  };

  const handleResetDefault = () => {
    const res = storageService.resetEventToDefault(event.slug);
    setEvent(res);
    setRsvps(storageService.getRsvps(res.id));
    setStats(storageService.getStats(res.id));
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'info', label: 'Informasi Acara', icon: Calendar },
    { id: 'schedule', label: 'Susunan Acara', icon: Clock },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    { id: 'rsvp', label: 'Daftar RSVP', icon: Users, badge: rsvps.length },
    { id: 'theme', label: 'Tema & Desain', icon: Palette },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-emerald-950 text-emerald-50 flex flex-col selection:bg-amber-400 selection:text-emerald-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-emerald-950/95 border-b border-amber-400/25 px-4 py-3 backdrop-blur-md shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
            <CrescentStarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-title text-sm sm:text-base font-bold text-amber-200 leading-tight">
              Admin Undangan Digital
            </h1>
            <p className="text-[10px] text-emerald-300/70 truncate max-w-[200px] sm:max-w-none flex items-center gap-1.5">
              <span>Maulid 1448 H</span>
              {localStorage.getItem('undangan_admin_email') && (
                <span className="text-amber-300/90 bg-emerald-900/80 px-1.5 py-0.2 rounded text-[9px] font-mono border border-amber-400/20">
                  {localStorage.getItem('undangan_admin_email')}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Toggle Split Preview on large screens */}
          <button
            onClick={() => setShowSplitPreview(!showSplitPreview)}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showSplitPreview
                ? 'bg-amber-500 text-emerald-950 border-amber-400 font-bold'
                : 'bg-emerald-900/60 border-amber-400/20 text-emerald-200 hover:bg-emerald-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Split Preview</span>
          </button>

          {/* Fullscreen Live Preview modal */}
          <button
            id="btn-admin-live-preview"
            onClick={() => setShowLivePreviewModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>👁 Live Preview</span>
          </button>

          {/* View Public Site */}
          <button
            id="btn-admin-view-public"
            onClick={onBackToInvitation}
            className="px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-amber-400/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat Undangan</span>
          </button>

          {/* Logout */}
          <button
            id="btn-admin-logout"
            onClick={onLogout}
            title="Keluar dari Admin"
            className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-56 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-emerald-950 shadow-md shadow-amber-500/20'
                    : 'bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 hover:text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-emerald-950 text-amber-300' : 'bg-emerald-800 text-emerald-100'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              event={event}
              stats={stats}
              rsvps={rsvps}
              onOpenPreview={() => setShowLivePreviewModal(true)}
              onResetDefault={handleResetDefault}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'info' && <EventForm event={event} onSave={handleSaveEvent} />}

          {activeTab === 'schedule' && (
            <ScheduleManager event={event} onSave={handleSaveEvent} />
          )}

          {activeTab === 'gallery' && (
            <GalleryManager event={event} onSave={handleSaveEvent} />
          )}

          {activeTab === 'rsvp' && (
            <RsvpManager
              eventId={event.id}
              rsvps={rsvps}
              onRefresh={() => setRsvps(storageService.getRsvps(event.id))}
            />
          )}

          {activeTab === 'theme' && <ThemeManager event={event} onSave={handleSaveEvent} />}
        </main>

        {/* Split Screen Live Preview (if enabled on wide screens) */}
        {showSplitPreview && (
          <aside className="hidden xl:flex w-[420px] shrink-0 border-l border-amber-400/20 pl-6 flex-col">
            <LivePreview event={event} onClose={() => setShowSplitPreview(false)} />
          </aside>
        )}
      </div>

      {/* Live Preview Fullscreen Modal */}
      {showLivePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in">
          <div className="w-full max-w-4xl h-[94vh] rounded-3xl bg-emerald-950 border border-amber-400/30 p-4 shadow-2xl flex flex-col overflow-hidden">
            <LivePreview
              event={event}
              onClose={() => setShowLivePreviewModal(false)}
              isFullscreen={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
