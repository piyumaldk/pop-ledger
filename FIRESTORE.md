# Firestore model (per-user) — pop-ledger

This project uses a per-user Firestore model to keep data scoped and efficient for the free tier.

Structure
- `/users/{uid}` — user doc with small profile and current selections
  - fields: `currentGame?: string`, `currentSeries?: string`, optional profile fields
- `/users/{uid}/games/{gameId}` — subcollection for user's games
  - fields: `index: number`, optional `updatedAt`, `title` etc.
- `/users/{uid}/series/{seriesId}` — subcollection for user's series
  - fields: `index: number`, optional `updatedAt`

Why this model
- Reading `currentGame`/`currentSeries` is a single doc read (cheap).
- Listing games/series reads only the user's subcollection documents (no cross-user scanning).
- Security rules are simple: allow read/write only when `request.auth.uid == userId`.

Helpers
- See `src/services/firestoreService.ts` — convenience functions to set/get current selection, list/upsert/remove games and series, and reorder in batches.

Rules
- See `firestore.rules` in repo. Deploy with the Firebase CLI:

```bash
# login and initialize CLI (one-time):
firebase login
# (optional) select project: firebase use --add
# deploy only rules
firebase deploy --only firestore:rules
```

Free-tier tips
- Keep `/users/{uid}` doc small — store current selections and small profile only.
- Fetch lists on demand (`getDocs`) — avoid persistent listeners for large lists.
- Batch writes when reordering many items (helpers included).
- Enable IndexedDB persistence in the app to reduce network reads.
