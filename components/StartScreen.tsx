'use client';

import { useState, useEffect } from 'react';
import { useHunt } from '@/contexts/HuntContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { huntConfig } from '@/lib/hunt-config';

export function StartScreen() {
  const { createSession, joinSession, startHunt, session, isLoading } = useHunt();
  const [teamName, setTeamName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [shareLink, setShareLink] = useState('');
  const [timeUntilStart, setTimeUntilStart] = useState('');
  const [canStart, setCanStart] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Set the start time: 9:00 AM tomorrow
  const getStartTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  };

  // Secret bypass for testing: click 5 times
  const handleSecretBypass = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setCanStart(true);
      setTimeUntilStart('');
    }
    // Reset after 3 seconds
    setTimeout(() => setClickCount(0), 3000);
  };

  useEffect(() => {
    const startTime = getStartTime();
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = startTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCanStart(true);
        setTimeUntilStart('');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilStart(`${hours}h ${minutes}m ${seconds}s`);
      setCanStart(false);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    
    try {
      const id = await createSession(teamName);
      const link = `${window.location.origin}?session=${id}`;
      setShareLink(link);
    } catch {
      alert('Error creating session. Please try again.');
    }
  };

  const handleJoin = async () => {
    if (!sessionId.trim()) return;

    try {
      await joinSession(sessionId);
    } catch {
      alert('Error joining session. Please check the session ID.');
    }
  };

  const handleStart = async () => {
    try {
      await startHunt();
    } catch {
      alert('Error starting hunt. Please try again.');
    }
  };

  // Check URL for session parameter
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionParam = params.get('session');
      if (sessionParam) {
        setSessionId(sessionParam);
        setMode('join');
        joinSession(sessionParam);
      }
    }
  });

  if (session && session.status === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Hunt! 🎯</CardTitle>
            <CardDescription>Team: {session.team_name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {shareLink && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Share this link with your partner:</p>
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly className="text-xs" />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Link copied!');
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>• {huntConfig.totalTimeLimitMin} minutes total</p>
              <p>• {huntConfig.hintPenaltyMin} minute penalty per hint</p>
              <p>• 11 stops to explore</p>
            </div>

            {!canStart && timeUntilStart && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-orange-800 mb-2">
                    ⏰ Hunt starts in:
                  </div>
                  <button onClick={handleSecretBypass} className="cursor-default">
                    <Badge className="text-2xl font-bold bg-orange-500 text-white px-6 py-3">
                      {timeUntilStart}
                    </Badge>
                  </button>
                  <div className="text-xs text-orange-600 mt-2">
                    Opens at 9:00 AM tomorrow
                  </div>
                  {clickCount > 0 && clickCount < 5 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {clickCount}/5
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleStart}
              disabled={isLoading || !canStart}
            >
              {canStart ? 'Start the Hunt!' : '🔒 Locked Until 9:00 AM'}
            </Button>

            {!canStart && (
              <p className="text-xs text-center text-gray-500">
                The adventure begins tomorrow morning! ☀️
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl">🎯 Adventure Awaits</CardTitle>
            <CardDescription>Vancouver Discovery Hunt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => setMode('create')}
            >
              Create New Hunt
            </Button>
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={() => setMode('join')}
            >
              Join Existing Hunt
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Hunt</CardTitle>
            <CardDescription>Pick a silly team name to get started!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Enter team name..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                className="text-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleCreate}
                disabled={isLoading || !teamName.trim()}
              >
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode('choose')}
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Join mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Join Hunt</CardTitle>
          <CardDescription>Enter the session ID from your partner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Session ID..."
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleJoin}
              disabled={isLoading || !sessionId.trim()}
            >
              Join
            </Button>
            <Button
              variant="outline"
              onClick={() => setMode('choose')}
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

