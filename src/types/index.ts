export type RsvpStatus = 'hadir' | 'tidak_hadir' | 'tentatif';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  alt: string;
  order: number;
}

export interface RsvpResponse {
  id: string;
  eventId: string;
  name: string;
  status: RsvpStatus;
  attendees: number;
  message: string;
  phone?: string;
  createdAt: string;
}

export type ThemePreset = 'emerald' | 'gold' | 'cream' | 'dark' | 'custom';

export interface ThemeConfig {
  preset: ThemePreset;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundStyle: 'pattern' | 'gradient' | 'image' | 'dark-emerald';
  backgroundImageUrl?: string;
  fontPrimary: string;
  fontHeading: string;
  cardOpacity: number;
  borderRadius: string;
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  theme: string;
  dateStr: string; // e.g. "Selasa, 1 September 2026"
  dateTimeIso: string; // e.g. "2026-09-01T07:30:00"
  timeStr: string; // e.g. "07.30 WIB - Selesai"
  speakerName: string;
  speakerTitle: string;
  speakerPhotoUrl: string;
  speakerBio?: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  latitude: number;
  longitude: number;
  audioUrl: string;
  audioTitle: string;
  isAudioEnabled: boolean;
  isCountdownEnabled: boolean;
  isRsvpEnabled: boolean;
  isNavbarEnabled: boolean;
  isVideoEnabled: boolean;
  videoUrl?: string;
  islamicQuote: string;
  islamicQuoteSource: string;
  description?: string;
  schedule: ScheduleItem[];
  gallery: GalleryItem[];
  themeConfig: ThemeConfig;
  organizerName?: string;
  logoUrl?: string;
  updatedAt?: string;
}

export interface VisitorStats {
  totalVisits: number;
  invitationsOpened: number;
  rsvpCount: number;
  confirmedAttendeesCount: number;
}
