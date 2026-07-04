import { useCallback, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import type { StagedPhoto } from "@/components/visits/photoStaging";

interface PhotoDropzoneProps {
  photos: StagedPhoto[];
  onAdd: (files: File[]) => void;
  onCaptionChange: (id: string, caption: string) => void;
  onRemove: (id: string) => void;
  uploading?: boolean;
}

export function PhotoDropzone({
  photos,
  onAdd,
  onCaptionChange,
  onRemove,
  uploading = false,
}: PhotoDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const images = Array.from(fileList).filter((file) =>
        file.type.startsWith("image/")
      );
      if (images.length > 0) onAdd(images);
    },
    [onAdd]
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Add photos"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          acceptFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 cursor-pointer transition-colors",
          dragActive
            ? "border-brand-teal bg-brand-teal-subtle"
            : "border-brand-sand-dark bg-brand-sand/40 hover:border-brand-teal hover:bg-brand-teal-subtle/50",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p className="mt-2 text-sm font-medium text-brand-navy">
          {uploading ? "Uploading photos..." : "Drop photos here"}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          or click to browse. JPEG, PNG, HEIC.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            acceptFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-lg border border-brand-sand-dark bg-white overflow-hidden"
            >
              <div className="relative aspect-video bg-brand-sand">
                <img
                  src={photo.previewUrl}
                  alt={photo.caption || photo.file.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove ${photo.file.name}`}
                  onClick={() => onRemove(photo.id)}
                  disabled={uploading}
                  className="absolute top-1.5 right-1.5 rounded-full bg-brand-navy/70 p-1 text-white hover:bg-brand-coral transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-2">
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Caption"
                  value={photo.caption}
                  disabled={uploading}
                  onChange={(e) => onCaptionChange(photo.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
