import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddTruckModal } from "@/components/fleet/AddTruckModal";
import { TaxRateReminderBanner } from "@/components/fleet/TaxRateReminderBanner";
import { useCompany } from "@/hooks/useCompanies";
import { useTrucksByCompany } from "@/hooks/useTrucks";
import { useTaxRateReminder } from "@/hooks/useTaxRateReminder";
import { formatDate } from "@/utils/format";

export function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [addTruckOpen, setAddTruckOpen] = useState(false);

  const {
    data: company,
    isLoading: companyLoading,
    isError: companyError,
  } = useCompany(companyId);
  const { data: trucks, isLoading: trucksLoading } =
    useTrucksByCompany(companyId);
  const taxReminder = useTaxRateReminder(companyId);

  if (companyLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading fleet...
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-brand-coral">
          Fleet not found.
        </p>
        <Link
          to="/fleets"
          className="mt-2 inline-block text-sm text-brand-teal hover:underline"
        >
          Back to Fleets
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
        <span className="text-gray-600">{company.name}</span>
      </nav>

      <PageHeader
        title={company.name}
        subtitle={`${company.hawaii_county} County. Added ${formatDate(company.created_at)}.`}
        actions={
          <Button onClick={() => setAddTruckOpen(true)}>Add Truck</Button>
        }
      />

      {taxReminder.status === "due" && (
        <TaxRateReminderBanner
          county={company.hawaii_county}
          taxRate={company.tax_rate}
          onConfirm={taxReminder.confirm}
          onSnooze={taxReminder.snooze}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company detail card */}
        <Card className="lg:col-span-1 self-start">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Company Details
            </h2>
          </CardHeader>
          <CardBody>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </dt>
                <dd className="mt-1 text-sm text-brand-navy">
                  {company.contact_name}
                </dd>
                <dd className="text-sm text-gray-600">
                  {company.contact_email}
                </dd>
                <dd className="text-sm text-gray-600">
                  {company.contact_phone}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Billing Address
                </dt>
                <dd className="mt-1 text-sm text-gray-700">
                  {company.billing_address}
                </dd>
              </div>
              <div className="flex gap-8">
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    County
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700">
                    {company.hawaii_county}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tax Rate
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm font-mono text-gray-700">
                    {company.tax_rate}%
                    {taxReminder.status === "confirmed" ? (
                      <span className="rounded-full bg-brand-teal-subtle px-2 py-0.5 font-sans text-2xs font-medium text-brand-teal">
                        Confirmed
                      </span>
                    ) : (
                      <span className="rounded-full bg-brand-coral-subtle px-2 py-0.5 font-sans text-2xs font-medium text-brand-coral">
                        Unconfirmed
                      </span>
                    )}
                  </dd>
                </div>
              </div>
            </dl>
          </CardBody>
        </Card>

        {/* Trucks sub-table */}
        <Card className="lg:col-span-2 self-start">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Trucks{trucks ? ` (${trucks.length})` : ""}
            </h2>
          </CardHeader>

          {trucksLoading && (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              Loading trucks...
            </div>
          )}

          {trucks && trucks.length === 0 && (
            <EmptyState
              title="No trucks in this fleet"
              description="Add the first truck to start logging service visits."
              action={
                <Button size="sm" onClick={() => setAddTruckOpen(true)}>
                  Add Truck
                </Button>
              }
            />
          )}

          {trucks && trucks.length > 0 && (
            <div className="overflow-x-auto">
              <table>
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Make / Model</th>
                  <th>Year</th>
                  <th>VIN</th>
                  <th>Plate</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map((truck) => (
                  <tr
                    key={truck.id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/fleets/${companyId}/trucks/${truck.id}`)
                    }
                  >
                    <td className="font-medium text-brand-navy">
                      {truck.unit_number}
                    </td>
                    <td className="text-gray-700">
                      {truck.make} {truck.model}
                    </td>
                    <td className="text-gray-600">{truck.year}</td>
                    <td className="font-mono text-xs text-gray-500">
                      {truck.vin}
                    </td>
                    <td className="text-gray-600">{truck.license_plate}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {companyId && (
        <AddTruckModal
          companyId={companyId}
          open={addTruckOpen}
          onOpenChange={setAddTruckOpen}
        />
      )}
    </div>
  );
}
