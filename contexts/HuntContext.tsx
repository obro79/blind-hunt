'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, HuntSession, StopProgress } from '@/lib/supabase';
import { stops } from '@/lib/hunt-config';
import { RealtimeChannel } from '@supabase/supabase-js';

interface HuntContextType {
  session: HuntSession | null;
  currentStop: typeof stops[0] | null;
  stopProgress: StopProgress[];
  isLoading: boolean;
  createSession: (teamName: string) => Promise<string>;
  joinSession: (sessionId: string) => Promise<void>;
  startHunt: () => Promise<void>;
  submitAnswer: (answer: string, photoBase64: string, isCorrect: boolean, skipped?: boolean) => Promise<void>;
  applyHint: () => Promise<void>;
  elapsedTime: number;
  currentHintCount: number;
}

const HuntContext = createContext<HuntContextType | undefined>(undefined);

export function HuntProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<HuntSession | null>(null);
  const [stopProgress, setStopProgress] = useState<StopProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const currentStop = session
    ? stops.find(s => s.id === session.current_stop_id) || null
    : null;

  // Get current hint count for the current stop
  const currentHintCount = currentStop
    ? stopProgress.find(p => p.stop_id === currentStop.id)?.hints_used_count || 0
    : 0;

  // Subscribe to real-time updates
  useEffect(() => {
    if (!session) return;

    const newChannel = supabase.channel(`hunt-session-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hunt_sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          setSession(payload.new as HuntSession);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stop_progress',
          filter: `session_id=eq.${session.id}`,
        },
        async () => {
          // Reload stop progress
          const { data } = await supabase
            .from('stop_progress')
            .select('*')
            .eq('session_id', session.id)
            .order('created_at', { ascending: true });
          if (data) setStopProgress(data);
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
    };
  }, [session?.id]);

  // Timer effect
  useEffect(() => {
    if (!session || session.status !== 'in_progress') return;

    const interval = setInterval(() => {
      if (session.started_at) {
        const startTime = new Date(session.started_at).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 60000); // minutes
        setElapsedTime(elapsed + session.total_penalty_min);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const createSession = useCallback(async (teamName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hunt_sessions')
        .insert({
          team_name: teamName,
          current_stop_id: stops[0].id,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) throw error;

      setSession(data);
      
      // Create timer record
      await supabase.from('hunt_timer').insert({
        session_id: data.id,
      });

      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hunt_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      setSession(data);

      // Load stop progress
      const { data: progressData } = await supabase
        .from('stop_progress')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (progressData) setStopProgress(progressData);
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startHunt = useCallback(async () => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('hunt_sessions')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      if (error) throw error;

      // Update timer
      await supabase
        .from('hunt_timer')
        .update({
          started_at: new Date().toISOString(),
        })
        .eq('session_id', session.id);
    } catch (error) {
      console.error('Error starting hunt:', error);
      throw error;
    }
  }, [session]);

  const submitAnswer = useCallback(async (
    answer: string,
    photoBase64: string,
    isCorrect: boolean,
    skipped: boolean = false
  ) => {
    if (!session || !currentStop) return;

    try {
      // Record stop progress
      const { error: progressError } = await supabase
        .from('stop_progress')
        .insert({
          session_id: session.id,
          stop_id: currentStop.id,
          completed_at: new Date().toISOString(),
          photo_url: photoBase64,
          answer_submitted: answer,
          is_correct: isCorrect || skipped,
          skipped: skipped,
        });

      if (progressError) throw progressError;

      // Move to next stop if correct or skipped
      if (isCorrect || skipped) {
        const currentIndex = stops.findIndex(s => s.id === currentStop.id);
        const nextStop = stops[currentIndex + 1];

        if (nextStop) {
          const { error: updateError } = await supabase
            .from('hunt_sessions')
            .update({
              current_stop_id: nextStop.id,
            })
            .eq('id', session.id);

          if (updateError) throw updateError;
        } else {
          // Hunt completed
          const { error: completeError } = await supabase
            .from('hunt_sessions')
            .update({
              status: 'completed',
            })
            .eq('id', session.id);

          if (completeError) throw completeError;
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }, [session, currentStop]);

  const applyHint = useCallback(async () => {
    if (!session || !currentStop) return;

    try {
      // Find existing progress for current stop
      const existingProgress = stopProgress.find(p => p.stop_id === currentStop.id);
      const currentCount = existingProgress?.hints_used_count || 0;

      // Get penalty from schedule (defaults to last value if out of range)
      const hintPenaltyScheduleMin = [2, 3, 5];
      const penalty = hintPenaltyScheduleMin[currentCount] || hintPenaltyScheduleMin[hintPenaltyScheduleMin.length - 1];
      const newCount = currentCount + 1;

      // Update session penalty
      const { error: sessionError } = await supabase
        .from('hunt_sessions')
        .update({
          total_penalty_min: session.total_penalty_min + penalty,
        })
        .eq('id', session.id);

      if (sessionError) throw sessionError;

      // Update or create stop progress with new hint count
      if (existingProgress) {
        const { error: progressError } = await supabase
          .from('stop_progress')
          .update({ hints_used_count: newCount })
          .eq('id', existingProgress.id);

        if (progressError) throw progressError;
      } else {
        // Create new progress record if none exists yet
        const { error: createError } = await supabase
          .from('stop_progress')
          .insert({
            session_id: session.id,
            stop_id: currentStop.id,
            hints_used_count: newCount,
          });

        if (createError) throw createError;
      }
    } catch (error) {
      console.error('Error using hint:', error);
      throw error;
    }
  }, [session, currentStop, stopProgress]);

  const value: HuntContextType = {
    session,
    currentStop,
    stopProgress,
    isLoading,
    createSession,
    joinSession,
    startHunt,
    submitAnswer,
    applyHint,
    elapsedTime,
    currentHintCount,
  };

  return <HuntContext.Provider value={value}>{children}</HuntContext.Provider>;
}

export function useHunt() {
  const context = useContext(HuntContext);
  if (context === undefined) {
    throw new Error('useHunt must be used within a HuntProvider');
  }
  return context;
}

