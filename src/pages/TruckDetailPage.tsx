import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
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
    <div>
      <nav className="mb-4 text-sm" aria-label="Breadcrumb">
        <Link to="/fleets" className="text-brand-teal hover:underline">
          Fleets
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link
          to={`/fleets/${truck.company_id}`}
          className="text-brand-teal hover:underline"
        >
          {company?.name ?? "Fleet"}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Unit {truck.unit_number}</span>
      </nav>

      <PageHeader
        title={`Unit ${truck.unit_number}`}
        subtitle={`${truck.year} ${truck.make} ${truck.model}`}
        actions={
          <Button
            onClick={() =>
              navigate(`/visits/new?truckId=${truck.id}`)
            }
          >
            New Visit
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Truck profile card */}
        <Card className="lg:col-span-1 self-start">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Truck Profile
            </h2>
            {!editing && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}
          </CardHeader>
          <CardBody>
            {editing ? (
              <TruckEditForm truck={truck} onDone={() => setEditing(false)} />
            ) : (
              <dl className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Unit Number
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-brand-navy">
                      {truck.unit_number}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Year
                    </dt>
                    <dd className="mt-1 text-sm text-gray-700">
                      {truck.year}
                    </dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Make
                    </dt>
                    <dd className="mt-1 text-sm text-gray-700">
                      {truck.make}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Model
                    </dt>
                    <dd className="mt-1 text-sm text-gray-700">
                      {truck.model}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    VIN
                  </dt>
                  <dd className="mt-1 text-sm font-mono text-gray-700">
                    {truck.vin}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    License Plate
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700">
                    {truck.license_plate}
                  </dd>
                </div>
                {truck.notes && (
                  <div>
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Notes
                    </dt>
                    <dd className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                      {truck.notes}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </CardBody>
        </Card>

        {/* Service visit history */}
        <Card className="lg:col-span-2 self-start">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Service History{visits ? ` (${visits.length})` : ""}
            </h2>
          </CardHeader>

          {visitsLoading && (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              Loading service history...
            </div>
          )}

          {visits && visits.length === 0 && (
            <EmptyState
              title="No service visits yet"
              description="Log the first visit for this truck to start its service history."
              action={
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(`/visits/new?truckId=${truck.id}`)
                  }
                >
                  New Visit
                </Button>
              }
            />
          )}

          {visits && visits.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th className="text-right">Items</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr
                    key={visit.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/visits/${visit.id}`)}
                  >
                    <td className="font-medium text-brand-navy">
                      {formatDateShort(visit.visit_date)}
                    </td>
                    <td className="text-gray-700">{visit.technician_name}</td>
                    <td>
                      <StatusBadge
                        status={visit.status}
                        label={VISIT_STATUS_LABELS[visit.status]}
                      />
                    </td>
                    <td className="text-right font-mono text-gray-700">
                      {visit.line_item_count}
                    </td>
                    <td className="text-right font-mono text-gray-700">
                      {formatCurrency(visit.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
