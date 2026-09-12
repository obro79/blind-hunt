# Blind Hunt

A mobile-first PWA that takes you on a scavenger hunt across Vancouver. It supports shared hunt sessions, GPS checks, photo capture, answer validation, hints with time penalties, and a completion gallery.

## What It Does

- Creates or joins a shared hunt session with Supabase
- Guides players through 10 configured Vancouver stops
- Checks location proximity with the browser Geolocation API
- Requires a photo and validated answer at each stop
- Tracks elapsed time and hint penalties
- Works as an installable PWA on mobile browsers

## Tech Stack

- Next.js 15 with App Router
- React 19
- Tailwind CSS 4 and shadcn-style UI components
- Supabase for Postgres and realtime updates
- `next-pwa` for app manifest and service worker support

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Enable anonymous sign-ins in the Supabase dashboard (**Authentication → Sign In / Up → Allow anonymous sign-ins**). The app creates (or reuses) an anonymous auth session on first use, and hunts are authorized through explicit owner/member rows in `hunt_members` — no login screen needed.

Create the Supabase tables, RLS policies, and the private `hunt-photos` Storage bucket by running [supabase-schema.sql](supabase-schema.sql) in the Supabase SQL editor. The script is idempotent and safely replaces the old "allow all" policies.

Run the app locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy on Vercel or any Next.js-compatible host. Add the same two Supabase environment variables in the host settings.

Geolocation and camera access require HTTPS in production. Vercel provides HTTPS automatically.

## Project Structure

```text
app/                 Next.js layout, page, and global styles
components/          Hunt screens, stop UI, timer, photo, and location checks
components/ui/       Reusable UI primitives
contexts/            Hunt state and Supabase realtime sync
lib/                 Hunt config, validation, geolocation, Supabase client
public/              PWA manifest
supabase-schema.sql  Database schema
```

## Customizing The Hunt

Edit [lib/hunt-config.ts](lib/hunt-config.ts) to change the route, stop prompts, accepted answers, GPS radius, hints, and time limits.

## Security Model

- **No public access**: every table uses operation-specific RLS policies bound to `auth.uid()` and membership in `hunt_members` (role `owner`/`member`). There are no `FOR ALL USING (true)` policies.
- **Anonymous auth**: the client signs in anonymously with the anon key — never a service-role/secret key.
- **Photos**: captured photos are uploaded to the private `hunt-photos` Storage bucket at `<session_id>/<user_id>/<stop_id>-<timestamp>.<ext>`, and `stop_progress.photo_url` stores only the object path. The bucket enforces image-only MIME types and a 10 MB limit (also checked client-side and in the storage RLS policies). The gallery renders photos via short-lived signed URLs.

## Upgrading Existing Data

Sessions created before this change have no `hunt_members` rows, so they are no longer visible. Create a new hunt, or backfill ownership in the SQL editor once you know the creator's auth user id:

```sql
INSERT INTO hunt_members (session_id, user_id, role)
SELECT id, created_by, 'owner' FROM hunt_sessions WHERE created_by IS NOT NULL
ON CONFLICT (session_id, user_id) DO NOTHING;
```

Old base64 `photo_url` values still render in the completion gallery, but new captures are uploaded to Storage.
