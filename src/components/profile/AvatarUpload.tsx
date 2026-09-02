import React, { useRef } from 'react';
import { Camera, Trash2, Upload, Loader2 } from 'lucide-react';
import { Avatar, Button } from '@/components/ui';

interface AvatarUploadProps {
  avatarUrl?: string;
  name: string;
  isUploading?: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarUrl,
  name,
  isUploading = false,
  onUpload,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset input value so re-selecting the same file fires onChange
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
      {/* Avatar Container */}
      <div className="relative group">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative rounded-2xl overflow-hidden cursor-pointer ring-4 ring-slate-800 hover:ring-indigo-500/50 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}
          title="Click or drag image to change avatar"
        >
          <Avatar
            {...(avatarUrl ? { src: avatarUrl } : {})}
            name={name || 'User'}
            size="xl"
            className="w-24 h-24 text-2xl"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            ) : (
              <>
                <Camera className="w-6 h-6 mb-1 text-indigo-300" />
                <span className="text-[10px] font-semibold tracking-wider uppercase">Change</span>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-slate-950/75 rounded-2xl flex items-center justify-center text-indigo-400">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
        )}
      </div>

      {/* Upload & Controls */}
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Profile Photo</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            PNG, JPG, WebP or GIF up to 5MB. Recommended square size (e.g. 500x500).
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
            id="avatar-file-input"
            aria-label="Upload avatar image file"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-xs"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
            )}
            Upload Image
          </Button>

          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUploading}
              onClick={onRemove}
              className="gap-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
