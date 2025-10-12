'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { GeoValidation } from '@/lib/hunt-config';
import { calculateDistance, getCurrentPosition } from '@/lib/geolocation';

interface GeolocationCheckerProps {
  validation: GeoValidation;
  onLocationChecked?: (isWithin: boolean, distance: number) => void;
}

export function GeolocationChecker({ validation, onLocationChecked }: GeolocationCheckerProps) {
  const [status, setStatus] = useState<'checking' | 'within' | 'outside' | 'error'>('checking');
  const [distance, setDistance] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    checkLocation();
    const interval = setInterval(checkLocation, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation]);

  const checkLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const dist = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        validation.lat,
        validation.lng
      );
      
      setDistance(Math.round(dist));
      const isWithin = dist <= validation.radius_m;
      setStatus(isWithin ? 'within' : 'outside');
      
      if (onLocationChecked) {
        onLocationChecked(isWithin, dist);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Could not get location');
      
      // Allow skip after error
      setTimeout(() => {
        if (onLocationChecked) {
          onLocationChecked(false, 999999);
        }
      }, 10000);
    }
  };

  if (status === 'checking') {
    return (
      <Alert>
        <AlertDescription>
          📍 Checking your location...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          ⚠️ Location error: {errorMessage}
          <br />
          <span className="text-xs">You can still skip this location check if needed.</span>
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'within') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="flex items-center justify-between">
          <span>✅ You&apos;re at the right spot!</span>
          <Badge variant="outline" className="bg-white">
            {distance}m away
          </Badge>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-orange-50 border-orange-200">
      <AlertDescription className="flex items-center justify-between">
        <span>📍 You&apos;re {distance}m away from the location</span>
        <Badge variant="outline" className="bg-white">
          {validation.radius_m}m radius
        </Badge>
      </AlertDescription>
    </Alert>
  );
}

