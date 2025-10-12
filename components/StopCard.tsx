'use client';

import { useState, useEffect } from 'react';
import { useHunt } from '@/contexts/HuntContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { GeolocationChecker } from './GeolocationChecker';
import { PhotoCapture } from './PhotoCapture';
import { validateAnswer } from '@/lib/validation';
import { stops } from '@/lib/hunt-config';

export function StopCard() {
  const { session, currentStop, submitAnswer, applyHint, stopProgress, currentHintCount } = useHunt();
  const [photo, setPhoto] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [canSkip, setCanSkip] = useState(false);

  const hintPenaltySchedule = [2, 3, 5];
  const maxHints = 3;

  useEffect(() => {
    // Allow skip after 10 seconds
    const timer = setTimeout(() => setCanSkip(true), 10000);
    return () => clearTimeout(timer);
  }, [currentStop?.id]);

  useEffect(() => {
    // Reset form when stop changes
    setPhoto('');
    setAnswer('');
    setFeedback(null);
    setCanSkip(false);
  }, [currentStop?.id]);

  if (!session || !currentStop) return null;

  const currentStopIndex = stops.findIndex(s => s.id === currentStop.id);
  const progress = ((currentStopIndex) / stops.length) * 100;
  const completedStops = stopProgress.filter(p => p.is_correct || p.skipped).length;

  const handleUseHint = async () => {
    try {
      await applyHint();
    } catch {
      alert('Error using hint');
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      setFeedback({ type: 'error', message: 'Please take a photo first!' });
      return;
    }

    if (!answer.trim()) {
      setFeedback({ type: 'error', message: 'Please provide an answer!' });
      return;
    }

    const isCorrect = validateAnswer(answer, currentStop.validation.answer);

    if (!isCorrect) {
      setFeedback({ type: 'error', message: 'Not quite! Try again or use a hint.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAnswer(answer, photo, true, false);
      setFeedback({ type: 'success', message: 'Correct! Moving to next stop...' });
    } catch {
      setFeedback({ type: 'error', message: 'Error submitting. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!photo) {
      alert('Please take a photo before skipping!');
      return;
    }

    const confirmSkip = window.confirm('Skip this stop? You can still move forward.');
    if (!confirmSkip) return;

    setIsSubmitting(true);
    try {
      await submitAnswer(answer || 'skipped', photo, false, true);
    } catch {
      alert('Error skipping stop');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <Card className="shadow-2xl">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Stop {currentStopIndex + 1} of {stops.length}</span>
            <Badge variant="secondary">{completedStops} completed</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Stop Card */}
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{currentStop.title}</CardTitle>
          <CardDescription className="text-base">{currentStop.prompt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Geolocation Check */}
          <GeolocationChecker validation={currentStop.validation.geo} />

          {/* Photo Capture */}
          <div>
            <h3 className="text-sm font-medium mb-2">📸 Photo Required</h3>
            <PhotoCapture onPhotoCapture={setPhoto} currentPhoto={photo} />
          </div>

          {/* Answer Input */}
          <div>
            <h3 className="text-sm font-medium mb-2">💡 Your Answer</h3>
            <Input
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="text-lg"
            />
          </div>

          {/* Hint Section */}
          <div className="space-y-2">
            {/* Show all revealed hints */}
            {currentHintCount > 0 && (
              <div className="space-y-2">
                {currentStop.hints.slice(0, currentHintCount).map((hint, idx) => (
                  <Alert key={idx} className="bg-yellow-50 border-yellow-200">
                    <AlertDescription>
                      💡 Hint {idx + 1}: {hint}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Hint button */}
            {currentHintCount < maxHints ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleUseHint}
              >
                {currentHintCount === 0 ? '💡 Need a Hint?' : '💡 Need Another Hint?'} 
                {' '}(-{hintPenaltySchedule[currentHintCount]}min)
              </Button>
            ) : (
              <Alert className="bg-gray-100 border-gray-300">
                <AlertDescription className="text-center text-gray-600">
                  All hints used ({maxHints}/{maxHints})
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'}
              className={feedback.type === 'success' ? 'bg-green-50 border-green-200' : ''}>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !photo || !answer.trim()}
            >
              Submit Answer
            </Button>
            {canSkip && (
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

