import React, { useState, useEffect } from 'react';
import { EventData } from './types';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { InvitationView } from './components/InvitationView';
import { AdminLogin } from './admin/AdminLogin';
import { AdminApp } from './admin/AdminApp';

export default function App() {
  const [viewMode, setViewMode] = useState<'invitation' | 'admin-login' | 'admin-panel'>('invitation');
  const [slug, setSlug] = useState<string>(storageService.getActiveSlug());
  const [event, setEvent] = useState<EventData>(storageService.getEvent(slug));

  useEffect(() => {
    // Check URL path or query params for /admin or /undangan/:slug
    try {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      if (pathname.includes('/admin') || searchParams.get('admin') === 'true' || searchParams.get('view') === 'admin') {
        if (storageService.isAdminLoggedIn()) {
          setViewMode('admin-panel');
        } else {
          setViewMode('admin-login');
        }
      } else {
        // Record visit
        storageService.incrementStats(event.id, 'totalVisits');
      }

      // Check if custom slug in URL
      const slugMatch = pathname.match(/\/undangan\/([a-zA-Z0-9_-]+)/);
      if (slugMatch && slugMatch[1]) {
        const foundSlug = slugMatch[1];
        setSlug(foundSlug);
        setEvent(storageService.getEvent(foundSlug));
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Listen to realtime event updates
  useEffect(() => {
    const handleEventUpdate = (e: any) => {
      if (e.detail) {
        setEvent(e.detail);
      }
    };
    window.addEventListener('undangan:eventUpdated', handleEventUpdate);
    return () => window.removeEventListener('undangan:eventUpdated', handleEventUpdate);
  }, []);

  const handleOpenAdmin = () => {
    if (storageService.isAdminLoggedIn()) {
      setViewMode('admin-panel');
    } else {
      setViewMode('admin-login');
    }
  };

  const handleAdminLoginSuccess = () => {
    setViewMode('admin-panel');
  };

  const handleAdminLogout = async () => {
    await authService.logout();
    storageService.logoutAdmin();
    setViewMode('admin-login');
  };

  const handleBackToInvitation = () => {
    setViewMode('invitation');
  };

  if (viewMode === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToInvitation={handleBackToInvitation}
      />
    );
  }

  if (viewMode === 'admin-panel') {
    return (
      <AdminApp
        onBackToInvitation={handleBackToInvitation}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <InvitationView
      event={event}
      onOpenAdmin={handleOpenAdmin}
    />
  );
}
