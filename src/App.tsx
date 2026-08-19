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

  const checkRoute = () => {
    try {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);

      const isAdminRoute =
        pathname.endsWith('/admin') ||
        pathname.includes('/admin/') ||
        hash === '#admin' ||
        hash.startsWith('#admin') ||
        searchParams.get('admin') === 'true' ||
        searchParams.get('view') === 'admin';

      if (isAdminRoute) {
        if (storageService.isAdminLoggedIn()) {
          setViewMode('admin-panel');
        } else {
          setViewMode('admin-login');
        }
      } else {
        setViewMode('invitation');
        // Record visit for guests only
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
  };

  useEffect(() => {
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);

    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
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

  const handleAdminLoginSuccess = () => {
    setViewMode('admin-panel');
    window.location.hash = 'admin';
  };

  const handleAdminLogout = async () => {
    await authService.logout();
    storageService.logoutAdmin();
    setViewMode('admin-login');
  };

  const handleBackToInvitation = () => {
    // Switch to public invitation and clear admin hash
    if (window.location.hash.includes('admin')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
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
    />
  );
}
