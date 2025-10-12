import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface HuntSession {
  id: string;
  created_at: string;
  team_name: string;
  started_at: string | null;
  current_stop_id: string;
  total_penalty_min: number;
  status: 'waiting' | 'in_progress' | 'completed';
}

export interface StopProgress {
  id: string;
  session_id: string;
  stop_id: string;
  completed_at: string | null;
  photo_url: string | null;
  answer_submitted: string | null;
  is_correct: boolean;
  skipped: boolean;
  hints_used_count: number;
}

export interface HuntTimer {
  session_id: string;
  started_at: string | null;
  paused_at: string | null;
  elapsed_min: number;
}

