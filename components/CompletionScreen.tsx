'use client';

import { useState } from 'react';
import { useHunt } from '@/contexts/HuntContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { stops } from '@/lib/hunt-config';
import Image from 'next/image';

export function CompletionScreen() {
  const { session, stopProgress, elapsedTime } = useHunt();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  if (!session || session.status !== 'completed') return null;

  const totalStops = stops.length;
  const completedCount = stopProgress.filter(p => p.is_correct && !p.skipped).length;
  const skippedCount = stopProgress.filter(p => p.skipped).length;
  const totalHintsUsed = stopProgress.reduce((sum, p) => sum + p.hints_used_count, 0);

  const hours = Math.floor(elapsedTime / 60);
  const minutes = elapsedTime % 60;

  // Get all photos with their info
  const photosWithInfo = stopProgress
    .filter(p => p.photo_url)
    .map(progress => {
      const stop = stops.find(s => s.id === progress.stop_id);
      return {
        photo: progress.photo_url!,
        title: stop?.title || 'Unknown Stop',
        answer: progress.answer_submitted,
        isCorrect: progress.is_correct,
        skipped: progress.skipped,
        stopOrder: stop?.order || 0
      };
    })
    .sort((a, b) => a.stopOrder - b.stopOrder);

  const downloadAllPhotos = () => {
    photosWithInfo.forEach((item, index) => {
      const link = document.createElement('a');
      link.href = item.photo;
      link.download = `${index + 1}-${item.title.replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const shareResults = () => {
    const text = `🎯 Just completed Adventure Awaits - Vancouver Hunt!\n\nTeam: ${session.team_name}\n⏱️ Time: ${hours > 0 ? `${hours}h ` : ''}${minutes}m\n✅ Completed: ${completedCount}/${totalStops} stops\n${totalHintsUsed > 0 ? `💡 Hints: ${totalHintsUsed}\n` : ''}#AdventureAwaits #VancouverHunt`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard! 📋');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto space-y-4 py-8">
        <Card className="border-4 border-purple-200">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-3xl">Hunt Complete!</CardTitle>
            <CardDescription className="text-lg">
              Team: {session.team_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {hours > 0 ? `${hours}h ` : ''}{minutes}m
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {completedCount}/{totalStops}
                </div>
                <div className="text-sm text-gray-600">Stops Completed</div>
              </div>
              {skippedCount > 0 && (
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{skippedCount}</div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
              )}
              {totalHintsUsed > 0 && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{totalHintsUsed}</div>
                  <div className="text-sm text-gray-600">Hints Used</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={downloadAllPhotos}
                className="flex-1"
                variant="outline"
              >
                📥 Download All Photos
              </Button>
              <Button
                onClick={shareResults}
                className="flex-1"
                variant="outline"
              >
                📤 Share Results
              </Button>
            </div>

            <Button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full"
              variant="outline"
            >
              {showSummary ? '📸 Show Photos' : '📋 Show Detailed Summary'}
            </Button>

            {/* Photo Gallery or Detailed Summary */}
            {!showSummary ? (
              <div>
                <h3 className="text-lg font-semibold mb-3">Your Journey 📸</h3>
                <div className="grid grid-cols-2 gap-3">
                  {photosWithInfo.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhoto(item.photo)}
                      className="space-y-1 text-left hover:opacity-80 transition-opacity"
                    >
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.photo}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <span>{idx + 1}. {item.title}</span>
                        {item.skipped && (
                          <Badge variant="outline" className="text-xs">Skipped</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-3">Complete Summary 📋</h3>
                <div className="space-y-3">
                  {photosWithInfo.map((item, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <div className="flex gap-3 p-3">
                        <button
                          onClick={() => setSelectedPhoto(item.photo)}
                          className="flex-shrink-0"
                        >
                          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.photo}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm">
                              {idx + 1}. {item.title}
                            </h4>
                            {item.skipped ? (
                              <Badge variant="outline" className="text-xs">Skipped</Badge>
                            ) : item.isCorrect ? (
                              <Badge className="bg-green-500 text-xs">✓ Correct</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Attempted</Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Answer:</span> {item.answer || 'No answer'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Memories */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Memories 💭</h3>
              <div className="space-y-2 text-sm">
                {stops.filter(s => s.memory).map(stop => {
                  const progress = stopProgress.find(p => p.stop_id === stop.id);
                  return progress ? (
                    <div key={stop.id}>
                      <span className="font-medium">{stop.memory}:</span>{' '}
                      <span className="text-gray-700">{progress.answer_submitted}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Final Message */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                What an adventure! 🎯 Thanks for exploring Vancouver together!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full-Screen Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex flex-col items-center justify-center">
            <Button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white text-black hover:bg-gray-200"
              size="sm"
            >
              ✕ Close
            </Button>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedPhoto}
                alt="Full size photo"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = selectedPhoto;
                  link.download = 'photo.jpg';
                  link.click();
                }}
                className="bg-white text-black hover:bg-gray-200"
                size="sm"
              >
                📥 Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

