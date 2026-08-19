import React, { useEffect, useState } from 'react';
import { Home, Calendar, Clock, MapPin, Image as ImageIcon, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  isAudioEnabled?: boolean;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'acara', label: 'Acara', icon: Calendar },
  { id: 'susunan', label: 'Susunan', icon: Clock },
  { id: 'lokasi', label: 'Lokasi', icon: MapPin },
  { id: 'galeri', label: 'Galeri', icon: ImageIcon },
  { id: 'rsvp', label: 'RSVP', icon: HeartHandshake },
];

export const Navbar: React.FC<NavbarProps> = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <nav
      id="mobile-bottom-navbar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-emerald-950/90 backdrop-blur-xl border-t border-amber-400/30 px-2 pt-2 pb-2 safe-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-300 relative ${
                isActive
                  ? 'text-amber-400 scale-105 font-bold'
                  : 'text-emerald-200/70 hover:text-emerald-100'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-8 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
              )}
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
