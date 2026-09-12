'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { MAX_PHOTO_BYTES } from '@/lib/supabase';

interface PhotoCaptureProps {
  onPhotoCapture: (file: File | null) => void;
}

export function PhotoCapture({ onPhotoCapture }: PhotoCaptureProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file after a retake
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPEG, PNG, WebP, HEIC).');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError(`Photo is too large. Maximum size is ${Math.round(MAX_PHOTO_BYTES / 1024 / 1024)} MB.`);
      return;
    }

    setError('');
    setPhoto(file);
    onPhotoCapture(file);
  };

  const handleRetake = () => {
    setPhoto(null);
    setError('');
    onPhotoCapture(null);
  };

  if (photo && previewUrl) {
    return (
      <Card className="p-4 space-y-3">
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={previewUrl}
            alt="Captured photo"
            fill
            className="object-cover"
          />
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleRetake}
        >
          Retake Photo
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="photo-input"
      />
      <label htmlFor="photo-input">
        <Button
          type="button"
          className="w-full"
          size="lg"
          onClick={() => fileInputRef.current?.click()}
        >
          📸 Take Photo
        </Button>
      </label>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
