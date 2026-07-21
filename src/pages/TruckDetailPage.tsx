import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TruckEditForm } from "@/components/fleet/TruckEditForm";
import { useTruck } from "@/hooks/useTruck";
import { useCompany } from "@/hooks/useCompanies";
import { useVisitsByTruck } from "@/hooks/useVisitsByTruck";
import {
  formatCurrency,
  formatDateShort,
  VISIT_STATUS_LABELS,
} from "@/utils/format";

export function TruckDetailPage() {
  const { companyId, truckId } = useParams<{
    companyId: string;
    truckId: string;
  }>();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const { data: truck, isLoading: truckLoading, isError: truckError } =
    useTruck(truckId);
  const { data: company } = useCompany(companyId);
  const { data: visits, isLoading: visitsLoading } = useVisitsByTruck(truckId);

  if (truckLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading truck...
      </div>
    );
  }

  if (truckError || !truck) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-brand-coral">
          Truck not found.
        </p>
        <Link
          to={companyId ? `/fleets/${companyId}` : "/fleets"}
          className="mt-2 inline-block text-sm text-brand-teal hover:underline"
        >
          Back to Fleet
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <nav className="mb-3 text-sm" aria-label="Breadcrumb">
        <Link to="/fleets" className="font-medium text-fs-navy-700 hover:underline">
          Fleets
        </Link>
        <span className="mx-2 text-fs-ink-450">/</span>
        <Link
          to={`/fleets/${truck.company_id}`}
          className="font-medium text-fs-navy-700 hover:underline"
        >
          {company?.name ?? "Fleet"}
        </Link>
        <span className="mx-2 text-fs-ink-450">/</span>
        <span className="text-fs-ink-500">Unit {truck.unit_number}</span>
      </nav>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="fs-money rounded-fs-sm bg-fs-navy-100 px-2 py-1 text-sm font-bold text-fs-navy-900">
            UNIT {truck.unit_number}
          </span>
          <div>
            <h1 className="text-[20px] font-bold leading-tight text-fs-ink-900">
              {truck.year} {truck.make} {truck.model}
            </h1>
          </div>
        </div>
        <Button onClick={() => navigate(`/visits/new?truckId=${truck.id}`)}>
          New Visit
        </Button>
      </div>

      {/* Vehicle profile card */}
      <div className="mt-4 rounded-fs border border-fs-line-200 bg-white p-4 shadow-fs-card">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-fs-ink-500">
            Vehicle profile
          </div>
          {!editing && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
        {editing ? (
          <div className="mt-3">
            <TruckEditForm truck={truck} onDone={() => setEditing(false)} />
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <Field label="Unit" value={truck.unit_number} mono />
            <Field label="Year" value={String(truck.year)} mono />
            <Field label="Make" value={truck.make} />
            <Field label="Model" value={truck.model} />
            <div className="col-span-2">
              <Field label="VIN" value={truck.vin} mono />
            </div>
            <div className="col-span-2">
              <Field label="License plate" value={truck.license_plate} mono />
            </div>
            {truck.notes && (
              <div className="col-span-2 sm:col-span-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-fs-ink-500">
                  Notes
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-fs-ink-900">
                  {truck.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service history */}
      <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-fs-ink-500">
        Service history{visits ? ` (${visits.length})` : ""}
      </div>

      {visitsLoading && (
        <div className="py-8 text-center text-sm text-fs-ink-500">
          Loading service history...
        </div>
      )}

      {visits && visits.length === 0 && (
        <div className="mt-2">
          <EmptyState
            title="No service visits yet"
            description="Log the first visit for this truck to start its service history."
            action={
              <Button
                size="sm"
                onClick={() => navigate(`/visits/new?truckId=${truck.id}`)}
              >
                New Visit
              </Button>
            }
          />
        </div>
      )}

      {visits && visits.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-fs border border-fs-line-200 bg-white shadow-fs-card">
          {visits.map((visit) => (
            <button
              key={visit.id}
              type="button"
              onClick={() => navigate(`/visits/${visit.id}`)}
              className="flex w-full items-center gap-3 border-b border-fs-line-200 px-4 py-3 text-left last:border-b-0 hover:bg-fs-navy-50"
            >
              <span className="fs-money w-14 flex-shrink-0 text-xs text-fs-ink-500">
                {formatDateShort(visit.visit_date)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-fs-ink-900">
                {visit.technician_name}
                <span className="fs-money ml-2 text-[11px] text-fs-ink-450">
                  {visit.line_item_count} items
                </span>
              </span>
              <span className="fs-money text-sm font-semibold text-fs-ink-900">
                {formatCurrency(visit.total)}
              </span>
              <StatusBadge
                status={visit.status}
                label={VISIT_STATUS_LABELS[visit.status]}
                mini
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-fs-ink-500">
        {label}
      </div>
      <div
        className={`mt-0.5 text-sm text-fs-ink-900 ${mono ? "fs-money !text-left" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
