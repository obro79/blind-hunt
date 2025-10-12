'use client';

import { useHunt } from '@/contexts/HuntContext';
import { Badge } from '@/components/ui/badge';
import { huntConfig } from '@/lib/hunt-config';

export function Timer() {
  const { elapsedTime, session } = useHunt();

  if (!session || session.status !== 'in_progress') return null;

  const timeLimit = huntConfig.totalTimeLimitMin;
  const remaining = timeLimit - elapsedTime;
  const isOverTime = remaining < 0;
  const displayTime = Math.abs(remaining);
  
  const hours = Math.floor(displayTime / 60);
  const minutes = displayTime % 60;

  const getColorClass = () => {
    if (isOverTime) return 'bg-red-500 border-red-600';
    if (remaining <= 15) return 'bg-orange-500 border-orange-600';
    if (remaining <= 30) return 'bg-yellow-500 border-yellow-600';
    return 'bg-white text-indigo-600 border-white';
  };

  return (
    <Badge className={`${getColorClass()} text-white text-lg px-4 py-2 shadow-lg border-2 font-bold`}>
      {isOverTime && '+ '}
      {hours > 0 ? `${hours}h ` : ''}
      {minutes}m
      {session.total_penalty_min > 0 && (
        <span className="ml-2 text-xs opacity-90">
          ({session.total_penalty_min}m penalties)
        </span>
      )}
    </Badge>
  );
}

