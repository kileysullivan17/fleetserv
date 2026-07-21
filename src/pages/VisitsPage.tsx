import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { JobRow } from "@/components/visits/JobRow";
import { PipelineColumn } from "@/components/visits/PipelineColumn";
import { VisitCard } from "@/components/visits/VisitCard";
import { useAllVisits, type VisitBoardRow } from "@/hooks/useAllVisits";
import { useUpdateVisitStatus } from "@/hooks/useUpdateVisitStatus";
import type { ServiceVisitStatus } from "@/types/database";
import { formatCurrency, VISIT_STATUS_LABELS } from "@/utils/format";
import { cn } from "@/utils/cn";

// Urgency ranking (mobile list): money owed first, done last. Invoiced work
// needs collecting, approved is ready to bill, quoted is awaiting the customer,
// draft is not out yet, paid is finished.
const URGENCY: Record<ServiceVisitStatus, number> = {
  invoiced: 0,
  approved: 1,
  quoted: 2,
  draft: 3,
  paid: 4,
};

const STATUS_DOT: Record<ServiceVisitStatus, string> = {
  draft: "var(--fs-draft-dot)",
  quoted: "var(--fs-sent-dot)",
  approved: "var(--fs-accepted-dot)",
  invoiced: "var(--fs-invoiced-dot)",
  paid: "var(--fs-paid-dot)",
};

// Desktop keeps the drag pipeline; the mutation and column order are unchanged.
const PIPELINE: ServiceVisitStatus[] = [
  "draft",
  "quoted",
  "approved",
  "invoiced",
  "paid",
];

type Filter = ServiceVisitStatus | "all";

export function VisitsPage() {
  const navigate = useNavigate();
  const { data: visits, isLoading, isError } = useAllVisits();
  const updateStatus = useUpdateVisitStatus();
  const [activeVisit, setActiveVisit] = useState<VisitBoardRow | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  // Distance constraint keeps plain clicks working for navigation.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const onDragStart = (event: DragStartEvent) => {
    const visit = event.active.data.current?.visit as VisitBoardRow | undefined;
    setActiveVisit(visit ?? null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveVisit(null);
    const { active, over } = event;
    if (!over) return;
    const visit = active.data.current?.visit as VisitBoardRow | undefined;
    const nextStatus = over.id as ServiceVisitStatus;
    if (!visit || visit.status === nextStatus) return;
    updateStatus.mutate({
      visitId: visit.id,
      truckId: visit.truck_id,
      status: nextStatus,
    });
  };

  const openVisit = (visitId: string) => navigate(`/visits/${visitId}`);

  const sorted = useMemo(() => {
    if (!visits) return [];
    return [...visits].sort(
      (a, b) =>
        URGENCY[a.status] - URGENCY[b.status] ||
        (a.visit_date < b.visit_date ? 1 : -1)
    );
  }, [visits]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const v of sorted) c[v.status] = (c[v.status] ?? 0) + 1;
    return c;
  }, [sorted]);

  const unpaid = sorted.filter((v) => v.status === "invoiced");
  const openQuotes = sorted.filter((v) => v.status === "quoted");
  const unpaidTotal = unpaid.reduce((s, v) => s + v.total, 0);
  const openQuotesTotal = openQuotes.reduce((s, v) => s + v.total, 0);

  const visible =
    filter === "all" ? sorted : sorted.filter((v) => v.status === filter);

  const presentStatuses = (
    ["invoiced", "approved", "quoted", "draft", "paid"] as ServiceVisitStatus[]
  ).filter((s) => counts[s]);

  const hasVisits = !!visits && visits.length > 0;

  return (
    <div className="mx-auto max-w-2xl lg:max-w-none">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-fs-ink-900">Jobs</h1>
          <p className="mt-0.5 hidden text-sm text-fs-ink-500 lg:block">
            Sorted by urgency on mobile. Drag between columns on desktop to
            update status.
          </p>
        </div>
        <Link to="/visits/new">
          <Button>New Visit</Button>
        </Link>
      </div>

      {/* Money summary band */}
      {hasVisits && (
        <div className="mt-4 flex gap-4 rounded-fs-lg bg-fs-navy-900 px-5 py-4 text-white lg:max-w-2xl">
          <div className="flex-1">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-fs-navy-100/80">
              Unpaid
            </div>
            <div className="fs-money mt-1 text-[22px] font-bold text-white">
              {formatCurrency(unpaidTotal)}
            </div>
            <div className="mt-0.5 text-xs font-semibold text-fs-navy-100/70">
              {unpaid.length} {unpaid.length === 1 ? "invoice" : "invoices"}
            </div>
          </div>
          <div className="w-px bg-white/15" />
          <div className="flex-1">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-fs-navy-100/80">
              Open quotes
            </div>
            <div className="fs-money mt-1 text-[22px] font-bold text-white">
              {formatCurrency(openQuotesTotal)}
            </div>
            <div className="mt-0.5 text-xs font-semibold text-fs-navy-100/70">
              {openQuotes.length} awaiting reply
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="py-12 text-center text-sm text-fs-ink-500">
          Loading jobs...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center">
          <p className="text-sm font-semibold text-brand-coral">
            Could not load jobs.
          </p>
          <p className="mt-1 text-sm text-fs-ink-500">
            Check your Supabase connection and refresh the page.
          </p>
        </div>
      )}

      {visits && visits.length === 0 && (
        <EmptyState
          icon={
            <svg
              className="w-12 h-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.25}
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          }
          title="No service visits"
          description="Log a service visit to start tracking work on a truck."
          action={
            <Link to="/visits/new">
              <Button>New Visit</Button>
            </Link>
          }
        />
      )}

      {/* Mobile: urgency-sorted list (design 1a) */}
      {hasVisits && (
        <div className="lg:hidden">
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label={`All ${sorted.length}`}
            />
            {presentStatuses.map((status) => (
              <FilterChip
                key={status}
                active={filter === status}
                onClick={() => setFilter(status)}
                label={`${VISIT_STATUS_LABELS[status]} ${counts[status]}`}
                dot={STATUS_DOT[status]}
              />
            ))}
          </div>

          {visible.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-fs-lg border border-fs-line-200 bg-white shadow-fs-card">
              <div className="px-5 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-fs-ink-500">
                By urgency
              </div>
              {visible.map((visit) => (
                <JobRow key={visit.id} visit={visit} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Desktop: drag pipeline (status update preserved) */}
      {hasVisits && (
        <div className="mt-5 hidden lg:block">
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={() => setActiveVisit(null)}
          >
            <div className="flex gap-4 overflow-x-auto pb-4">
              {PIPELINE.map((status) => (
                <PipelineColumn
                  key={status}
                  status={status}
                  label={VISIT_STATUS_LABELS[status]}
                  visits={sorted.filter((visit) => visit.status === status)}
                  onOpen={openVisit}
                />
              ))}
            </div>

            <DragOverlay>
              {activeVisit && (
                <VisitCard visit={activeVisit} onOpen={() => {}} overlay />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {updateStatus.isError && (
        <p className="form-error mt-2">
          Could not update the visit status. The card was returned to its
          previous column.
        </p>
      )}
    </div>
  );
}

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  dot?: string;
}

function FilterChip({ active, onClick, label, dot }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors",
        active
          ? "bg-fs-navy-900 text-white"
          : "border border-fs-line-200 bg-white text-fs-ink-600 hover:bg-fs-navy-50"
      )}
    >
      {dot && !active && (
        <span
          className="h-[7px] w-[7px] rounded-full"
          style={{ background: dot }}
        />
      )}
      {label}
    </button>
  );
}
