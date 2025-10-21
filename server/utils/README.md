Trip Instance Flow, API, and Concurrency Notes

Purpose
- Provide a public way to preview seat layout for a trip date/time without creating data on GET.
- Allow “create on book” when no trip instance exists yet, safely and without double‑booking.
- Make trip instances unique by their natural key so duplicates cannot be created in races.

Key Changes (files)
- server/models/TripInstance.js
  - Added a compound unique index on `{ tripTemplateID, date, time }`.
- server/utils/tripInstance.js
  - Added helpers for preview and create‑on‑book flows:
    - `normalizeDateOnly(dateStr)` → store calendar date as UTC midnight.
    - `ensureTripInstance({ templateId, date, time })` → find or upsert instance, race‑safe.
    - `previewTripByParams({ templateId, date, time })` → read‑only preview, no creation.
- server/controllers/bookingController.js
  - `createBooking` now accepts either `tripInstanceID` OR `{ templateId, date, time }`.
  - Atomically reserves seats using a single conditional update.
- server/controllers/tripInstanceController.js and server/routes/tripInstanceRoutes.js
  - Added `GET /api/trips/instance?templateId=&date=YYYY-MM-DD&time=HH:mm` for public preview (no creation).

Public Preview (no creation)
- Endpoint: `GET /api/trips/instance?templateId=<ObjectId>&date=YYYY-MM-DD&time=HH:mm`
- Behavior:
  - If an instance exists for that tuple, return its `bookedSeats` and `tripInstanceId`.
  - If none exists, derive `seatLayout` from the destination template and return `bookedSeats: []` with `exists: false`.
- Rationale: Browsing seat maps should not create data and should not require login.

Create‑On‑Book (with auth)
- Request may include either:
  - `tripInstanceID`, or
  - `{ templateId, date: "YYYY-MM-DD", time: "HH:mm" }`
- Flow (high level):
  1) If no `tripInstanceID`, call `ensureTripInstance` to find or create the instance for the tuple.
  2) Atomically reserve seats via a single `findOneAndUpdate` with conditional filter.
  3) Insert the Booking document.

Race Conditions and How They’re Handled
1) Duplicate trip instance creation
   - Problem: Two users book the same template/date/time at the same moment.
   - Solution:
     - Enforce a unique compound index on `{ tripTemplateID, date, time }`.
     - Upsert with `findOneAndUpdate` and `$setOnInsert`.
     - If a duplicate key error (`E11000`) occurs, immediately re‑query to fetch the winning document.

2) Double‑booking seats
   - Problem: Two users try to reserve the same seats concurrently.
   - Solution:
     - Use a single conditional update:
       - Filter: `{ _id: instanceId, bookedSeats: { $nin: requestedSeats } }`
       - Update: `{ $addToSet: { bookedSeats: { $each: requestedSeats } } }`
       - If the update returns `null`, some requested seat was already taken → report the conflicting seats.
     - This is race‑safe on a single server without transactions.

3) Booking persistence vs seat reservation
   - Without transactions, seats are reserved first, then the booking document is inserted. If booking insert fails after seats were reserved (rare), seats can be cleaned up by `$pullAll` or by a periodic reconciliation job.
   - With transactions (requires MongoDB replica set), wrap both steps in a session so they commit/rollback together.

Data Normalization
- `date` is stored as a date‑only value at UTC midnight using `normalizeDateOnly("YYYY-MM-DD")`. This avoids timezone drift and makes the unique index reflect calendar days.
- `time` is a fixed string in `HH:mm` format to keep sorting/indexing simple.

Helper APIs (server/utils/tripInstance.js)
- `normalizeDateOnly(dateStr: string): Date`
  - Input: `YYYY-MM-DD`
  - Output: JS Date at UTC midnight for that calendar date.

- `ensureTripInstance({ templateId: string, date: string, time: string }): Promise<TripInstance>`
  - Upserts the instance by `{ tripTemplateID, date: normalizedDate, time }`.
  - Returns the existing or newly created instance.
  - Catches duplicate key races and re‑queries.

- `previewTripByParams({ templateId: string, date: string, time: string }): Promise<{ exists, tripInstanceId, seatLayout, bookedSeats }>`
  - Reads existing instance if present; otherwise derives `seatLayout` from the template.
  - Never creates a `TripInstance`.

API Usage Examples
- Preview seats (public):
  - `GET /api/trips/instance?templateId=650000000000000000020001&date=2025-09-15&time=09:00`
  - Response: `{ success, exists, tripInstanceId|null, seatLayout: string[], bookedSeats: string[] }`

- Create booking (auth required):
  - With instance ID:
    - `{ "tripInstanceID": "<id>", "seats": ["A1","A2"] }`
  - Without instance ID (create‑on‑book):
    - `{ "templateId": "<tplId>", "date": "2025-09-15", "time": "09:00", "seats": ["A1","A2"] }`
  - On conflict: 400 with which seats are already booked.

Performance and Indexing
- The compound unique index also acts as a lookup index for the preview and upsert.
- If queries/sorts by `{ date, time }` are frequent in admin views, consider an additional non‑unique index `{ date: 1, time: 1 }`.

Planning: Transactions (future)
- When a replica set is enabled, wrap both steps in a MongoDB transaction for all‑or‑nothing behavior:
  - Start a session; in a transaction: (1) conditional seat reserve; (2) insert booking.
  - On error, abort to roll back seat changes and booking insert.
  - Keep idempotency keys on the client to avoid accidental duplicates on retries.

Admin vs Public endpoints
- Public:
  - `GET /api/trips/instance?templateId=&date=&time=` → preview only.
- Protected:
  - Bookings: `POST /api/bookings/create-booking` (requires auth; owner‑scoped).
  - Admin maintenance (schedules/prices): keep admin‑gated and separate from booking flows.

Testing Tips
- Preview first (no login), then sign in and book the same seats from two clients quickly to see the conflict response.
- If you run Mongo in Docker without a replica set, the atomic seat update still works; transactions require a replica set.

Route Cleanup (Defer Implementation)
- Endpoints you can remove for now:
  - `GET /api/trips/get-trip-detail/:tripId`
  - `POST /api/trips/update-trip-detail/:tripId`
- Why remove them now:
  - Seat changes belong in booking flows: create reserves seats; cancel releases seats. Keeping mutations in one place preserves integrity and simplifies auth/validation.
  - Public read needs no ID: the preview endpoint by `(templateId, date, time)` shows seat layout+availability without creating data or requiring login.
  - Users can see trip details from their booking payload; no separate "get by id" is required for the UI flow.
  - Smaller attack surface: fewer mutation endpoints exposed reduces risk of unauthorized or accidental state changes.
- When to add back:
  - If you need admin maintenance (change schedule/price/seat layout), add admin‑only routes guarded by `requireAuth, requireAdmin` and keep seat allocation changes in booking logic.
