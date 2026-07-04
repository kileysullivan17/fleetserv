import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/types/database";

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length
    );
  }, [photos.length]);
  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, close, prev, next]);

  if (photos.length === 0) return null;

  const active = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group rounded-lg overflow-hidden border border-brand-sand-dark bg-white text-left focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <div className="aspect-video bg-brand-sand overflow-hidden">
              <img
                src={photo.storage_url}
                alt={photo.caption || "Visit photo"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            {photo.caption && (
              <p className="px-2 py-1.5 text-xs text-gray-600 truncate">
                {photo.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || "Photo"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy-dark/90 p-6"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <figure
            className="max-h-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.storage_url}
              alt={active.caption || "Visit photo"}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {active.caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {active.caption}
              </figcaption>
            )}
          </figure>

          {photos.length > 1 && (
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
