'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface PhotoCaptureProps {
  onPhotoCapture: (base64: string) => void;
  currentPhoto?: string;
}

export function PhotoCapture({ onPhotoCapture, currentPhoto }: PhotoCaptureProps) {
  const [photo, setPhoto] = useState<string>(currentPhoto || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhoto(base64);
      onPhotoCapture(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setPhoto('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (photo) {
    return (
      <Card className="p-4 space-y-3">
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={photo}
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
    <Card className="p-4">
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
    </Card>
  );
}

