-- Blind Hunt Database Schema for Supabase
--
-- Secure version:
--   * Anonymous Supabase Auth sessions are created/reused by the client; every
--     hunt is authorized through explicit rows in `hunt_members` (role owner/member).
--   * No blanket FOR ALL USING (true) policies. Each table's policies are
--     operation-specific and bound to auth.uid() + hunt membership.
--   * Photos are stored in the private `hunt-photos` Storage bucket (never
--     public); `stop_progress.photo_url` stores only the object path.
--
-- This file is idempotent: it can be re-run against a database that already
-- has the original tables (old "allow all" policies are dropped and replaced).

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Hunt Sessions table
CREATE TABLE IF NOT EXISTS hunt_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  team_name TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  current_stop_id TEXT NOT NULL DEFAULT 'canada-place-sails',
  total_penalty_min INTEGER DEFAULT 0,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed'))
);

-- Creator/owner of the session (anonymous auth user). Nullable so existing
-- rows created before this migration keep working; new rows always set it via
-- the INSERT policy below.
ALTER TABLE hunt_sessions ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Stop Progress table
CREATE TABLE IF NOT EXISTS stop_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES hunt_sessions(id) ON DELETE CASCADE,
  stop_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  photo_url TEXT, -- object path in the private hunt-photos bucket (not base64)
  answer_submitted TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  hints_used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hunt Timer table
CREATE TABLE IF NOT EXISTS hunt_timer (
  session_id UUID PRIMARY KEY REFERENCES hunt_sessions(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  elapsed_min INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hunt Members table: explicit owner/member authorization rows.
-- A user may access a hunt only if they have a row here (or they created it).
CREATE TABLE IF NOT EXISTS hunt_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES hunt_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE hunt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stop_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunt_timer ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunt_members ENABLE ROW LEVEL SECURITY;

-- Membership helpers used by the policies. `is_hunt_owner` relies only on the
-- owner role row, so an owner can never be forged by editing created_by.
-- SECURITY DEFINER (with pinned search_path) makes the inner lookup run as the
-- table owner, which avoids RLS infinite recursion while keeping auth.uid()
-- (the caller's JWT subject) as the only input.
CREATE OR REPLACE FUNCTION public.is_hunt_member(p_session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hunt_members hm
    WHERE hm.session_id = p_session_id
      AND hm.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_hunt_owner(p_session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hunt_members hm
    WHERE hm.session_id = p_session_id
      AND hm.user_id = auth.uid()
      AND hm.role = 'owner'
  );
$$;

-- Explicit grants: anon/authenticated get table privileges, but RLS gates every
-- row by membership. (Anonymous users are granted the `authenticated` role.)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hunt_sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stop_progress TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hunt_timer TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hunt_members TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_hunt_member(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_hunt_owner(uuid) TO anon, authenticated;

-- Drop the old blanket "allow all" policies.
DROP POLICY IF EXISTS "Allow all operations on hunt_sessions" ON hunt_sessions;
DROP POLICY IF EXISTS "Allow all operations on stop_progress" ON stop_progress;
DROP POLICY IF EXISTS "Allow all operations on hunt_timer" ON hunt_timer;

-- ---------------------------------------------------------------------------
-- hunt_sessions policies
-- ---------------------------------------------------------------------------

-- A user creates a session: it must be stamped with their own auth uid.
CREATE POLICY "Users can create sessions"
  ON hunt_sessions FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Members can view sessions"
  ON hunt_sessions FOR SELECT TO authenticated
  USING (public.is_hunt_member(id));

-- Co-op game state (status, current_stop_id, penalties) is editable by members.
CREATE POLICY "Members can update sessions"
  ON hunt_sessions FOR UPDATE TO authenticated
  USING (public.is_hunt_member(id))
  WITH CHECK (public.is_hunt_member(id));

CREATE POLICY "Owners can delete sessions"
  ON hunt_sessions FOR DELETE TO authenticated
  USING (public.is_hunt_owner(id));

-- ---------------------------------------------------------------------------
-- hunt_members policies
-- ---------------------------------------------------------------------------

CREATE POLICY "Members can view members"
  ON hunt_members FOR SELECT TO authenticated
  USING (public.is_hunt_member(session_id));

-- Anyone who has the (unguessable) session link can join as a member by
-- inserting their own row. The unique (session_id, user_id) constraint makes
-- repeated joins idempotent.
CREATE POLICY "Users can join as member"
  ON hunt_members FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND role = 'member'
    AND EXISTS (SELECT 1 FROM public.hunt_sessions hs WHERE hs.id = session_id)
  );

-- The session creator records themselves as owner (only they can do this).
CREATE POLICY "Creators can record owner"
  ON hunt_members FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND role = 'owner'
    AND EXISTS (SELECT 1 FROM public.hunt_sessions hs
                WHERE hs.id = session_id AND hs.created_by = auth.uid())
  );

CREATE POLICY "Owners can manage members"
  ON hunt_members FOR UPDATE TO authenticated
  USING (public.is_hunt_owner(session_id))
  WITH CHECK (public.is_hunt_owner(session_id));

CREATE POLICY "Owners can remove members"
  ON hunt_members FOR DELETE TO authenticated
  USING (public.is_hunt_owner(session_id));

-- ---------------------------------------------------------------------------
-- stop_progress policies
-- ---------------------------------------------------------------------------

CREATE POLICY "Members can view progress"
  ON stop_progress FOR SELECT TO authenticated
  USING (public.is_hunt_member(session_id));

CREATE POLICY "Members can record progress"
  ON stop_progress FOR INSERT TO authenticated
  WITH CHECK (public.is_hunt_member(session_id));

CREATE POLICY "Members can update progress"
  ON stop_progress FOR UPDATE TO authenticated
  USING (public.is_hunt_member(session_id))
  WITH CHECK (public.is_hunt_member(session_id));

CREATE POLICY "Members can delete progress"
  ON stop_progress FOR DELETE TO authenticated
  USING (public.is_hunt_member(session_id));

-- ---------------------------------------------------------------------------
-- hunt_timer policies
-- ---------------------------------------------------------------------------

CREATE POLICY "Members can view timers"
  ON hunt_timer FOR SELECT TO authenticated
  USING (public.is_hunt_member(session_id));

CREATE POLICY "Members can create timers"
  ON hunt_timer FOR INSERT TO authenticated
  WITH CHECK (public.is_hunt_member(session_id));

CREATE POLICY "Members can update timers"
  ON hunt_timer FOR UPDATE TO authenticated
  USING (public.is_hunt_member(session_id))
  WITH CHECK (public.is_hunt_member(session_id));

CREATE POLICY "Members can delete timers"
  ON hunt_timer FOR DELETE TO authenticated
  USING (public.is_hunt_member(session_id));

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_stop_progress_session ON stop_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_stop_progress_stop ON stop_progress(stop_id);
CREATE INDEX IF NOT EXISTS idx_hunt_sessions_status ON hunt_sessions(status);
CREATE INDEX IF NOT EXISTS idx_hunt_members_session ON hunt_members(session_id);
CREATE INDEX IF NOT EXISTS idx_hunt_members_user ON hunt_members(user_id);

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
-- Tables are added to the supabase_realtime *publication* only; nothing inside
-- the `realtime` schema is created, altered, or dropped. RLS applies to
-- postgres_changes, so members receive changes only for rows they can select.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
                 WHERE pubname = 'supabase_realtime'
                   AND schemaname = 'public'
                   AND tablename = 'hunt_sessions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE hunt_sessions;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
                 WHERE pubname = 'supabase_realtime'
                   AND schemaname = 'public'
                   AND tablename = 'stop_progress') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE stop_progress;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
                 WHERE pubname = 'supabase_realtime'
                   AND schemaname = 'public'
                   AND tablename = 'hunt_timer') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE hunt_timer;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Storage: private hunt-photos bucket
-- ---------------------------------------------------------------------------
-- Private bucket (public = false) with server-side file size and MIME limits.
-- Object paths are `<session_id>/<user_id>/<stop_id>-<timestamp>.<ext>`, so
-- every object is scoped to a hunt and to the uploader's own user id.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hunt-photos',
  'hunt-photos',
  false,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage object policies (ownership-scoped; never public, no service key).
DROP POLICY IF EXISTS "Hunt photos are private to members" ON storage.objects;
CREATE POLICY "Hunt photos are private to members"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'hunt-photos'
    AND public.is_hunt_member((storage.foldername(name))[1]::uuid)
  );

DROP POLICY IF EXISTS "Hunt members can upload photos" ON storage.objects;
CREATE POLICY "Hunt members can upload photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'hunt-photos'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND public.is_hunt_member((storage.foldername(name))[1]::uuid)
    AND (COALESCE(metadata->>'mimetype', '')) LIKE 'image/%'
    AND (COALESCE((metadata->>'size')::bigint, 0)) BETWEEN 1 AND 10485760
  );

-- Required because the client uploads with upsert: true (idempotent retries);
-- re-uploading the same path performs an UPDATE on storage.objects.
DROP POLICY IF EXISTS "Hunt members can update photos" ON storage.objects;
CREATE POLICY "Hunt members can update photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'hunt-photos'
    AND public.is_hunt_member((storage.foldername(name))[1]::uuid)
  )
  WITH CHECK (
    bucket_id = 'hunt-photos'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND public.is_hunt_member((storage.foldername(name))[1]::uuid)
    AND (COALESCE(metadata->>'mimetype', '')) LIKE 'image/%'
    AND (COALESCE((metadata->>'size')::bigint, 0)) BETWEEN 1 AND 10485760
  );
