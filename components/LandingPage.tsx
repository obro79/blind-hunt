'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <CardTitle className="text-4xl font-bold mb-2">
            Adventure Awaits
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            A Vancouver Discovery Hunt
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Meeting Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🕘</span>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Starting Time</div>
                  <div className="text-2xl font-bold text-gray-900">9:00 AM</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-3xl">📍</span>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Meeting Point</div>
                  <div className="text-xl font-bold text-gray-900">Canada Place</div>
                  <div className="text-sm text-gray-500">Vancouver Waterfront</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hunt Info */}
          <div className="space-y-2 text-center">
            <div className="flex justify-around text-sm">
              <div>
                <div className="text-2xl font-bold text-indigo-600">10</div>
                <div className="text-gray-600">Stops</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">2</div>
                <div className="text-gray-600">Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">🍩</div>
                <div className="text-gray-600">Finish</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>
              Explore Vancouver&apos;s landmarks, solve challenges, and capture memories together.
            </p>
            <p className="text-xs text-gray-500">
              From the waterfront to downtown 🌊 → 🏙️
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={onStart}
            className="w-full text-lg py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            Let&apos;s Begin! 🎯
          </Button>

          {/* Footer Note */}
          <div className="text-center text-xs text-gray-500 pt-2">
            Remember: location & camera permissions required
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

