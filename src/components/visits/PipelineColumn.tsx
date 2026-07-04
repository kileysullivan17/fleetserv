import { useDroppable } from "@dnd-kit/core";
import type { ServiceVisitStatus } from "@/types/database";
import type { VisitBoardRow } from "@/hooks/useAllVisits";
import { VisitCard } from "@/components/visits/VisitCard";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

const COLUMN_ACCENTS: Record<ServiceVisitStatus, string> = {
  draft: "border-t-status-draft",
  quoted: "border-t-status-quoted",
  approved: "border-t-status-approved",
  invoiced: "border-t-status-invoiced",
  paid: "border-t-status-paid",
};

interface PipelineColumnProps {
  status: ServiceVisitStatus;
  label: string;
  visits: VisitBoardRow[];
  onOpen: (visitId: string) => void;
}

export function PipelineColumn({
  status,
  label,
  visits,
  onOpen,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const columnTotal = visits.reduce((sum, visit) => sum + visit.total, 0);

  return (
    <div className="flex w-64 shrink-0 flex-col">
      <div
        className={cn(
          "rounded-t-lg border border-b-0 border-brand-sand-dark border-t-4 bg-white px-3 py-2.5",
          COLUMN_ACCENTS[status]
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-navy">
            {label}
            <span className="ml-2 text-xs font-normal text-gray-400">
              {visits.length}
            </span>
          </p>
          <p className="text-xs font-mono text-gray-500">
            {formatCurrency(columnTotal)}
          </p>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 rounded-b-lg border border-brand-sand-dark bg-brand-sand/50 p-2 min-h-[160px] transition-colors",
          isOver && "bg-brand-teal-subtle border-brand-teal"
        )}
      >
        {visits.map((visit) => (
          <VisitCard key={visit.id} visit={visit} onOpen={onOpen} />
        ))}

        {visits.length === 0 && (
          <p
            className={cn(
              "flex h-full min-h-[120px] items-center justify-center rounded border border-dashed text-xs transition-colors",
              isOver
                ? "border-brand-teal text-brand-teal"
                : "border-brand-sand-dark text-gray-400"
            )}
          >
            {isOver ? "Drop to move here" : "No visits"}
          </p>
        )}
      </div>
    </div>
  );
}
