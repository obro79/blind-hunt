'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { HuntProvider, useHunt } from '@/contexts/HuntContext';
import { LandingPage } from '@/components/LandingPage';
import { StartScreen } from '@/components/StartScreen';
import { StopCard } from '@/components/StopCard';
import { CompletionScreen } from '@/components/CompletionScreen';
import { Timer } from '@/components/Timer';

function HuntContent() {
  const { session } = useHunt();

  if (!session) {
    return <StartScreen />;
  }

  if (session.status === 'waiting') {
    return <StartScreen />;
  }

  if (session.status === 'completed') {
    return <CompletionScreen />;
  }

  // In progress
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto space-y-4 py-4">
        {/* Header with Timer and Team Name */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">🎯 Adventure Awaits</h1>
            <p className="text-sm text-white/80">{session.team_name}</p>
          </div>
          <Timer />
        </div>

        {/* Current Stop */}
        <StopCard />
      </div>
    </div>
  );
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <HuntProvider>
      <HuntContent />
    </HuntProvider>
  );
}
