# Security Specification for Firestore Rules

## 1. Data Invariants
- Events document: Anyone can read event public data; only admins or authenticated managers can update/write event configuration.
- RSVP subcollection (`/events/{eventId}/rsvps/{rsvpId}`):
  - Any guest can read RSVP message feed.
  - Any guest can submit RSVP (`create`) with valid payload (name length <= 128, valid status in `['hadir', 'tidak_hadir', 'tentatif']`, attendees >= 1 and <= 50, message size <= 1000).
  - Guests cannot mutate or forge other guests' IDs.
  - Deletions are restricted to administrators.

## 2. Dirty Dozen Payloads Handled
1. Oversized RSVP Name (> 128 characters) -> Rejected.
2. Injected Unknown Status (e.g. `status: 'hacked'`) -> Rejected.
3. Negative or Excessive Attendees (e.g. `attendees: -5` or `10000`) -> Rejected.
4. Oversized Injected Message (> 1000 characters) -> Rejected.
5. Injected Document ID with invalid path characters -> Rejected via `isValidId()`.
6. Shadow fields injection on RSVP write -> Blocked.
7. Unauthenticated destructive delete on events -> Rejected.
