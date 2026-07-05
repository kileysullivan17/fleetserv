import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface InfoPopoverProps {
  // Accessible label for the trigger button.
  label: string;
  // Optional bold heading shown at the top of the popover.
  title?: string;
  // Popover body content.
  children: React.ReactNode;
  // "warning" tints the trigger coral (caution); "info" tints it teal.
  variant?: "info" | "warning";
  className?: string;
}

export function InfoPopover({
  label,
  title,
  children,
  variant = "info",
  className,
}: InfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  // Close on outside click or Escape while open.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const triggerColor =
    variant === "warning"
      ? "text-brand-coral hover:bg-brand-coral-subtle"
      : "text-brand-teal hover:bg-brand-teal-subtle";

  return (
    <span
      ref={wrapperRef}
      className={cn("relative inline-flex align-middle", className)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          triggerColor
        )}
      >
        {variant === "warning" ? (
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          className="absolute left-0 top-6 z-40 w-64 rounded-lg border border-brand-sand-dark bg-white p-3 text-left shadow-card"
        >
          {title && (
            <p className="mb-1 text-xs font-semibold text-brand-navy">
              {title}
            </p>
          )}
          <div className="text-xs leading-relaxed text-gray-600">
            {children}
          </div>
        </div>
      )}
    </span>
  );
}
