import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  formatDateShort,
  VISIT_STATUS_LABELS,
} from "@/utils/format";
import { cn } from "@/utils/cn";

interface FlatResult {
  key: string;
  group: "Companies" | "Trucks" | "Visits";
  label: string;
  sublabel: string;
  to: string;
  badge?: { status: Parameters<typeof StatusBadge>[0]["status"]; label: string };
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useGlobalSearch(query);

  const results = useMemo<FlatResult[]>(() => {
    if (!data) return [];
    const flat: FlatResult[] = [];
    for (const company of data.companies) {
      flat.push({
        key: `company-${company.id}`,
        group: "Companies",
        label: company.name,
        sublabel: `${company.hawaii_county} County`,
        to: `/fleets/${company.id}`,
      });
    }
    for (const truck of data.trucks) {
      flat.push({
        key: `truck-${truck.id}`,
        group: "Trucks",
        label: `Unit ${truck.unit_number}`,
        sublabel: `${truck.year} ${truck.make} ${truck.model}`,
        to: `/fleets/${truck.company_id}/trucks/${truck.id}`,
      });
    }
    for (const visit of data.visits) {
      flat.push({
        key: `visit-${visit.id}`,
        group: "Visits",
        label: `${formatDateShort(visit.visit_date)}${
          visit.trucks ? `: Unit ${visit.trucks.unit_number}` : ""
        }`,
        sublabel: `Technician: ${visit.technician_name}`,
        to: `/visits/${visit.id}`,
        badge: {
          status: visit.status,
          label: VISIT_STATUS_LABELS[visit.status],
        },
      });
    }
    return flat;
  }, [data]);

  // Reset selection when results change; clear query when closed
  useEffect(() => {
    setActiveIndex(0);
  }, [results.length, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  // Keep the active row visible while arrowing through results
  useEffect(() => {
    const active = listRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const select = (result: FlatResult) => {
    onOpenChange(false);
    navigate(result.to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0
      );
    }
    if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      select(results[activeIndex]);
    }
  };

  let lastGroup: string | null = null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-[2px]" />
        <Dialog.Content
          onKeyDown={onKeyDown}
          className="fixed left-1/2 top-24 z-50 w-full max-w-xl -translate-x-1/2 rounded-lg bg-white shadow-xl border border-brand-sand-dark overflow-hidden"
        >
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search companies, trucks, and service visits
          </Dialog.Description>

          <div className="flex items-center gap-3 px-4 border-b border-brand-sand-dark">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, trucks, visits..."
              aria-label="Search"
              className="w-full py-3.5 text-sm text-brand-navy placeholder-gray-400 focus:outline-none"
            />
            {isFetching && (
              <svg
                className="w-4 h-4 animate-spin text-brand-teal shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            <kbd className="hidden sm:block shrink-0 rounded border border-brand-sand-dark bg-brand-sand px-1.5 py-0.5 text-2xs font-mono text-gray-500">
              esc
            </kbd>
          </div>

          <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {query.trim().length < 2 && (
              <p className="px-3 py-8 text-center text-sm text-gray-400">
                Type at least two characters to search.
              </p>
            )}

            {query.trim().length >= 2 &&
              !isFetching &&
              results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-gray-400">
                  No results for "{query.trim()}".
                </p>
              )}

            {results.map((result, index) => {
              const showHeader = result.group !== lastGroup;
              lastGroup = result.group;
              const isActive = index === activeIndex;

              return (
                <div key={result.key}>
                  {showHeader && (
                    <p className="px-3 pt-3 pb-1 text-2xs font-semibold uppercase tracking-wider text-gray-400">
                      {result.group}
                    </p>
                  )}
                  <button
                    type="button"
                    data-active={isActive}
                    onClick={() => select(result)}
                    onMouseMove={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left transition-colors",
                      isActive ? "bg-brand-teal-subtle" : "hover:bg-brand-sand"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-brand-navy truncate">
                        {result.label}
                      </span>
                      <span className="block text-xs text-gray-500 truncate">
                        {result.sublabel}
                      </span>
                    </span>
                    {result.badge && (
                      <StatusBadge
                        status={result.badge.status}
                        label={result.badge.label}
                        className="shrink-0"
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
