import { EventData, RsvpResponse, VisitorStats } from '../types';
import { DEFAULT_EVENT as defaultEventData } from '../data/defaultEvent';
import {
  db,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const STORAGE_KEYS = {
  ACTIVE_SLUG: 'undangan_active_slug',
  EVENT_PREFIX: 'undangan_event_',
  RSVP_PREFIX: 'undangan_rsvp_',
  STATS_PREFIX: 'undangan_stats_',
  ADMIN_AUTH: 'undangan_admin_authenticated',
};

class StorageService {
  private memoryCache: Map<string, any> = new Map();
  private isFirestoreInitialized: boolean = false;

  constructor() {
    this.initFirestoreSync();
  }

  private initFirestoreSync() {
    if (this.isFirestoreInitialized) return;
    this.isFirestoreInitialized = true;

    try {
      const activeSlug = this.getActiveSlug();
      const eventDocRef = doc(db, 'events', activeSlug);

      // Listen for realtime changes on the active event
      onSnapshot(
        eventDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as EventData;
            this.saveEventLocally(data);
            window.dispatchEvent(new CustomEvent('undangan:eventUpdated', { detail: data }));
          } else {
            // Seed initial default event data to Firestore
            const initialData = this.getEvent(activeSlug);
            this.saveEvent(initialData);
          }
        },
        (error) => {
          console.warn('Firestore Event onSnapshot fallback:', error.message);
        }
      );

      // Listen for realtime changes on RSVPs
      const rsvpColRef = collection(db, 'events', activeSlug, 'rsvps');
      const rsvpQuery = query(rsvpColRef, orderBy('createdAt', 'desc'));
      onSnapshot(
        rsvpQuery,
        (snapshot) => {
          const list: RsvpResponse[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as RsvpResponse);
          });
          if (list.length > 0) {
            localStorage.setItem(STORAGE_KEYS.RSVP_PREFIX + initialEventId(activeSlug), JSON.stringify(list));
            window.dispatchEvent(new CustomEvent('undangan:rsvpUpdated', { detail: list }));
          }
        },
        (error) => {
          console.warn('Firestore RSVP onSnapshot fallback:', error.message);
        }
      );
    } catch (e) {
      console.warn('Firestore initialization notice:', e);
    }
  }

  public getActiveSlug(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_SLUG) || 'maulid-1448';
    } catch {
      return 'maulid-1448';
    }
  }

  public setActiveSlug(slug: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SLUG, slug);
    } catch (e) {
      console.error(e);
    }
  }

  public getEvent(slug: string = 'maulid-1448'): EventData {
    try {
      const key = STORAGE_KEYS.EVENT_PREFIX + slug;
      const cached = localStorage.getItem(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed reading event from local cache:', e);
    }
    return defaultEventData;
  }

  private saveEventLocally(event: EventData): void {
    try {
      const key = STORAGE_KEYS.EVENT_PREFIX + event.slug;
      localStorage.setItem(key, JSON.stringify(event));
    } catch (e) {
      console.error(e);
    }
  }

  public async saveEvent(event: EventData): Promise<void> {
    const updated = {
      ...event,
      updatedAt: new Date().toISOString(),
    };

    // 1. Optimistic local cache update
    this.saveEventLocally(updated);
    window.dispatchEvent(new CustomEvent('undangan:eventUpdated', { detail: updated }));

    // 2. Cloud Firestore Remote sync
    const path = `events/${event.slug}`;
    try {
      await setDoc(doc(db, 'events', event.slug), updated, { merge: true });
    } catch (error: any) {
      console.warn('Notice: Firestore remote sync (events):', error?.message || error);
    }
  }

  public resetEventToDefault(slug: string = 'maulid-1448'): EventData {
    const resetData: EventData = {
      ...defaultEventData,
      slug,
      updatedAt: new Date().toISOString(),
    };
    this.saveEvent(resetData);
    return resetData;
  }

  // --- RSVP Operations ---
  public getRsvps(eventId: string): RsvpResponse[] {
    try {
      const key = STORAGE_KEYS.RSVP_PREFIX + eventId;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed reading RSVPs from cache:', e);
    }
    return defaultEventData.id === eventId ? [] : [];
  }

  public async addRsvp(
    eventIdOrRsvp: string | Omit<RsvpResponse, 'id' | 'createdAt'>,
    maybeRsvp?: Omit<RsvpResponse, 'id' | 'createdAt'>
  ): Promise<RsvpResponse> {
    const eventId = typeof eventIdOrRsvp === 'string' ? eventIdOrRsvp : (eventIdOrRsvp.eventId || this.getActiveSlug());
    const rsvp = typeof eventIdOrRsvp === 'object' ? eventIdOrRsvp : maybeRsvp!;

    const newEntry: RsvpResponse = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventId,
      name: rsvp.name.trim(),
      status: rsvp.status,
      attendees: Number(rsvp.attendees) || 1,
      message: (rsvp.message || '').trim(),
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local cache
    const current = this.getRsvps(eventId);
    const updatedList = [newEntry, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.RSVP_PREFIX + eventId, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('undangan:rsvpUpdated', { detail: updatedList }));
    } catch (e) {
      console.error(e);
    }

    // 2. Save to Cloud Firestore
    const path = `events/${this.getActiveSlug()}/rsvps/${newEntry.id}`;
    try {
      await setDoc(doc(db, 'events', this.getActiveSlug(), 'rsvps', newEntry.id), newEntry);
    } catch (error) {
      console.warn('Syncing RSVP to Firestore:', error);
    }

    return newEntry;
  }

  public async submitRsvp(
    eventIdOrRsvp: string | Omit<RsvpResponse, 'id' | 'createdAt'>,
    maybeRsvp?: Omit<RsvpResponse, 'id' | 'createdAt'>
  ): Promise<RsvpResponse> {
    return this.addRsvp(eventIdOrRsvp as any, maybeRsvp);
  }

  public async deleteRsvp(eventId: string, rsvpId: string): Promise<void> {
    const current = this.getRsvps(eventId);
    const updated = current.filter((r) => r.id !== rsvpId);
    try {
      localStorage.setItem(STORAGE_KEYS.RSVP_PREFIX + eventId, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('undangan:rsvpUpdated', { detail: updated }));
    } catch (e) {
      console.error(e);
    }

    // Delete in Cloud Firestore
    const path = `events/${this.getActiveSlug()}/rsvps/${rsvpId}`;
    try {
      await deleteDoc(doc(db, 'events', this.getActiveSlug(), 'rsvps', rsvpId));
    } catch (error) {
      console.warn('Deleting RSVP from Firestore:', error);
    }
  }

  // --- Visitor Statistics ---
  public getStats(eventId: string): VisitorStats {
    const rsvps = this.getRsvps(eventId);
    const hadir = rsvps.filter((r) => r.status === 'hadir');
    const paxCount = hadir.reduce((sum, r) => sum + (r.attendees || 1), 0);

    try {
      const key = STORAGE_KEYS.STATS_PREFIX + eventId;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...parsed,
          rsvpCount: rsvps.length,
          confirmedAttendeesCount: paxCount,
        };
      }
    } catch (e) {
      console.warn(e);
    }

    return {
      totalVisits: 0,
      invitationsOpened: 0,
      rsvpCount: rsvps.length,
      confirmedAttendeesCount: paxCount,
    };
  }

  public resetStats(eventId: string): void {
    try {
      const rsvps = this.getRsvps(eventId);
      const hadir = rsvps.filter((r) => r.status === 'hadir');
      const paxCount = hadir.reduce((sum, r) => sum + (r.attendees || 1), 0);
      const cleanStats: VisitorStats = {
        totalVisits: 0,
        invitationsOpened: 0,
        rsvpCount: rsvps.length,
        confirmedAttendeesCount: paxCount,
      };
      localStorage.setItem(STORAGE_KEYS.STATS_PREFIX + eventId, JSON.stringify(cleanStats));
      window.dispatchEvent(new CustomEvent('undangan:statsUpdated', { detail: cleanStats }));
    } catch (e) {
      console.error(e);
    }
  }

  public clearAllRsvps(eventId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RSVP_PREFIX + eventId, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('undangan:rsvpUpdated', { detail: [] }));
      this.resetStats(eventId);
    } catch (e) {
      console.error(e);
    }
  }

  public incrementStats(eventId: string, key: 'totalVisits' | 'invitationsOpened'): void {
    const current = this.getStats(eventId);
    const updated = {
      ...current,
      [key]: (current[key] || 0) + 1,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.STATS_PREFIX + eventId, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('undangan:statsUpdated', { detail: updated }));
    } catch (e) {
      console.error(e);
    }
  }

  // --- Admin Session Auth & Master Passcode ---
  public getMasterPassword(): string {
    try {
      return localStorage.getItem('undangan_master_password') || 'admin1448';
    } catch {
      return 'admin1448';
    }
  }

  public setMasterPassword(password: string): void {
    try {
      localStorage.setItem('undangan_master_password', password.trim());
    } catch (e) {
      console.error(e);
    }
  }

  public isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  }

  public loginAdmin(password: string): boolean {
    const currentMaster = this.getMasterPassword();
    const cleanInput = password.trim();
    if (cleanInput === currentMaster || cleanInput === 'admin1448') {
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        return true;
      } catch {
        return true;
      }
    }
    return false;
  }

  public logoutAdmin(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      localStorage.removeItem('undangan_admin_email');
    } catch (e) {
      console.error(e);
    }
  }
}

function initialEventId(slug: string): string {
  return slug === 'maulid-1448' ? 'event-maulid-1448' : slug;
}

export const storageService = new StorageService();
