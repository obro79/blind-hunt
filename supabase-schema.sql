-- Blind Hunt Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hunt Sessions table
CREATE TABLE hunt_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  team_name TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  current_stop_id TEXT NOT NULL DEFAULT 'canada-place-sails',
  total_penalty_min INTEGER DEFAULT 0,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed'))
);

-- Stop Progress table
CREATE TABLE stop_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES hunt_sessions(id) ON DELETE CASCADE,
  stop_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  photo_url TEXT,
  answer_submitted TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  hints_used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hunt Timer table
CREATE TABLE hunt_timer (
  session_id UUID PRIMARY KEY REFERENCES hunt_sessions(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  elapsed_min INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hunt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stop_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunt_timer ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now since it's just you and Alison)
CREATE POLICY "Allow all operations on hunt_sessions" ON hunt_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on stop_progress" ON stop_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on hunt_timer" ON hunt_timer FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_stop_progress_session ON stop_progress(session_id);
CREATE INDEX idx_stop_progress_stop ON stop_progress(stop_id);
CREATE INDEX idx_hunt_sessions_status ON hunt_sessions(status);

-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE hunt_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE stop_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE hunt_timer;

