import React, { useState } from 'react';
import { EventData } from '../types';
import { OpeningCover } from './OpeningCover';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { CountdownSection } from './CountdownSection';
import { EventInfoSection } from './EventInfoSection';
import { SpeakerSection } from './SpeakerSection';
import { ScheduleSection } from './ScheduleSection';
import { LocationSection } from './LocationSection';
import { GallerySection } from './GallerySection';
import { VideoSection } from './VideoSection';
import { RsvpSection } from './RsvpSection';
import { IslamicQuoteSection } from './IslamicQuoteSection';
import { ShareSection } from './ShareSection';
import { AudioPlayer } from './AudioPlayer';
import { FooterSection } from './FooterSection';

interface InvitationViewProps {
  event: EventData;
  onOpenAdmin: () => void;
  isSimulated?: boolean; // When rendered inside phone simulator in Live Preview
}

export const InvitationView: React.FC<InvitationViewProps> = ({
  event,
  onOpenAdmin,
  isSimulated = false,
}) => {
  const [isOpened, setIsOpened] = useState(isSimulated);
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setAutoPlayTriggered(true);
    // Smoothly scroll to hero
    setTimeout(() => {
      const hero = document.getElementById('hero');
      hero?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const scrollToCalendarOrShare = () => {
    const rsvp = document.getElementById('rsvp') || document.getElementById('acara');
    rsvp?.scrollIntoView({ behavior: 'smooth' });
  };

  // Determine dynamic background styling based on theme config
  const getCustomBgStyle = (): React.CSSProperties => {
    const { preset, backgroundStyle, backgroundImageUrl, backgroundColor, primaryColor } =
      event.themeConfig;

    if (backgroundStyle === 'image' && backgroundImageUrl) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(2, 44, 34, 0.94), rgba(6, 78, 59, 0.88)), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }

    if (preset === 'cream') {
      return {
        backgroundColor: '#fefce8',
        color: '#1c1917',
      };
    }

    if (preset === 'gold') {
      return {
        backgroundColor: '#1c1917',
        color: '#fef08a',
      };
    }

    return {
      backgroundColor: backgroundColor || '#022c22',
    };
  };

  return (
    <div
      id="invitation-container"
      className="relative min-h-[100dvh] w-full max-w-full overflow-x-hidden text-emerald-50 selection:bg-amber-400 selection:text-emerald-950 transition-colors duration-500"
      style={getCustomBgStyle()}
    >
      {/* Opening Cover Screen */}
      {!isSimulated && (
        <OpeningCover
          event={event}
          isOpen={isOpened}
          onOpen={handleOpenInvitation}
        />
      )}

      {/* Floating Audio Player */}
      {event.isAudioEnabled && (
        <AudioPlayer
          event={event}
          autoPlayTriggered={autoPlayTriggered || isSimulated}
        />
      )}

      {/* Main Content Sections (Strict Flow as requested in prompt) */}
      <main className="w-full max-w-full">
        {/* 1. HERO */}
        <HeroSection
          event={event}
          onOpenCalendar={scrollToCalendarOrShare}
          onOpenShare={scrollToCalendarOrShare}
        />

        {/* 2. COUNTDOWN */}
        <CountdownSection
          event={event}
          onOpenCalendar={scrollToCalendarOrShare}
        />

        {/* 3. INFORMASI ACARA */}
        <EventInfoSection event={event} />

        {/* 4. PENCERAMAH */}
        <SpeakerSection event={event} />

        {/* 5. SUSUNAN ACARA */}
        <ScheduleSection event={event} />

        {/* 6. LOKASI */}
        <LocationSection event={event} />

        {/* 7. GALERI */}
        <GallerySection event={event} />

        {/* 8. VIDEO */}
        <VideoSection event={event} />

        {/* 9. RSVP */}
        <RsvpSection event={event} />

        {/* 10. DOA / QUOTE */}
        <IslamicQuoteSection event={event} />

        {/* 11. SHARE & CALENDAR */}
        <ShareSection event={event} />

        {/* 12. FOOTER */}
        <FooterSection
          event={event}
          onOpenAdmin={onOpenAdmin}
        />
      </main>

      {/* Mobile-first Bottom Navbar */}
      {event.isNavbarEnabled && isOpened && (
        <Navbar isAudioEnabled={event.isAudioEnabled} />
      )}
    </div>
  );
};
