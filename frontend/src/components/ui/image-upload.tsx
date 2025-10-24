import React, { useRef } from 'react';
import { Button } from './button';
import { Camera, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

const ImageUpload = ({ currentImage, onImageChange, className }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative group", className)}>
      <img
        src={currentImage}
        alt="Photo de profil"
        className="w-32 h-32 rounded-2xl object-cover shadow-card"
      />
      <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleButtonClick}
          className="gap-2"
        >
          <Camera className="w-4 h-4" />
          Changer
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-full border-4 border-card"></div>
    </div>
  );
};

export default ImageUpload;