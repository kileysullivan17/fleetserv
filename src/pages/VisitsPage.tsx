import { useState } from "react";
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
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PipelineColumn } from "@/components/visits/PipelineColumn";
import { VisitCard } from "@/components/visits/VisitCard";
import { useAllVisits, type VisitBoardRow } from "@/hooks/useAllVisits";
import { useUpdateVisitStatus } from "@/hooks/useUpdateVisitStatus";
import type { ServiceVisitStatus } from "@/types/database";
import { VISIT_STATUS_LABELS } from "@/utils/format";

const PIPELINE: ServiceVisitStatus[] = [
  "draft",
  "quoted",
  "approved",
  "invoiced",
  "paid",
];

export function VisitsPage() {
  const navigate = useNavigate();
  const { data: visits, isLoading, isError } = useAllVisits();
  const updateStatus = useUpdateVisitStatus();
  const [activeVisit, setActiveVisit] = useState<VisitBoardRow | null>(null);

  // Distance constraint keeps plain clicks working for navigation
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const onDragStart = (event: DragStartEvent) => {
    const visit = event.active.data.current?.visit as
      | VisitBoardRow
      | undefined;
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

  return (
    <div>
      <PageHeader
        title="Service Visits"
        subtitle="Drag visits between columns to update status. Use each visit page for quote and invoice creation."
        actions={
          <Link to="/visits/new">
            <Button>New Visit</Button>
          </Link>
        }
      />

      {isLoading && (
        <div className="py-12 text-center text-sm text-gray-500">
          Loading pipeline...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-brand-coral">
            Could not load visits.
          </p>
          <p className="mt-1 text-sm text-gray-500">
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

      {visits && visits.length > 0 && (
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
                visits={visits.filter((visit) => visit.status === status)}
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
