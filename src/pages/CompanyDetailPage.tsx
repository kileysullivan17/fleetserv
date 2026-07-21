import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddTruckModal } from "@/components/fleet/AddTruckModal";
import { TaxRateReminderBanner } from "@/components/fleet/TaxRateReminderBanner";
import { useCompany } from "@/hooks/useCompanies";
import { useTrucksByCompany } from "@/hooks/useTrucks";
import { useTaxRateReminder } from "@/hooks/useTaxRateReminder";
import { formatDate } from "@/utils/format";

export function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
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

  const initials = (company.contact_name || company.name)
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <nav className="mb-3 text-sm" aria-label="Breadcrumb">
        <Link to="/fleets" className="font-medium text-fs-navy-700 hover:underline">
          Fleets
        </Link>
        <span className="mx-2 text-fs-ink-450">/</span>
        <span className="text-fs-ink-500">{company.name}</span>
      </nav>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-fs-ink-900">
            {company.name}
          </h1>
          <p className="mt-0.5 text-sm text-fs-ink-500">
            {company.hawaii_county} County &middot; GET{" "}
            <span className="fs-money">{company.tax_rate}%</span> &middot; added{" "}
            {formatDate(company.created_at)}
          </p>
        </div>
        <Button onClick={() => setAddTruckOpen(true)}>Add Truck</Button>
      </div>

      {taxReminder.status === "due" && (
        <div className="mt-4">
          <TaxRateReminderBanner
            county={company.hawaii_county}
            taxRate={company.tax_rate}
            onConfirm={taxReminder.confirm}
            onSnooze={taxReminder.snooze}
          />
        </div>
      )}

      {/* Contact card */}
      <div className="mt-4 rounded-fs border border-fs-line-200 bg-white p-4 shadow-fs-card">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-fs-navy-100 text-[15px] font-bold text-fs-navy-900">
            {initials || "?"}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-fs-ink-900">
              {company.contact_name || "No contact on file"}
            </div>
            <div className="truncate text-sm text-fs-ink-500">
              {company.contact_email || company.billing_address || "—"}
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <ContactAction
            href={company.contact_phone ? `tel:${company.contact_phone}` : null}
            label="Call"
          />
          <ContactAction
            href={company.contact_phone ? `sms:${company.contact_phone}` : null}
            label="Text"
          />
          <ContactAction
            href={company.contact_email ? `mailto:${company.contact_email}` : null}
            label="Email"
          />
        </div>
        {company.contact_phone && (
          <div className="fs-money mt-3 text-sm text-fs-ink-600">
            {company.contact_phone}
          </div>
        )}
      </div>

      {/* Trucks */}
      <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-fs-ink-500">
        Trucks{trucks ? ` (${trucks.length})` : ""}
      </div>

      {trucksLoading && (
        <div className="py-8 text-center text-sm text-fs-ink-500">
          Loading trucks...
        </div>
      )}

      {trucks && trucks.length === 0 && (
        <div className="mt-2">
          <EmptyState
            title="No trucks in this fleet"
            description="Add the first truck to start logging service visits."
            action={
              <Button size="sm" onClick={() => setAddTruckOpen(true)}>
                Add Truck
              </Button>
            }
          />
        </div>
      )}

      {trucks && trucks.length > 0 && (
        <div className="mt-2 space-y-2.5">
          {trucks.map((truck) => (
            <Link
              key={truck.id}
              to={`/fleets/${companyId}/trucks/${truck.id}`}
              className="block rounded-fs border border-fs-line-200 bg-white p-3.5 shadow-fs-card hover:border-fs-navy-700/40"
            >
              <div className="flex items-center gap-2">
                <span className="fs-money rounded-fs-sm bg-fs-navy-100 px-2 py-0.5 text-xs font-bold text-fs-navy-900">
                  UNIT {truck.unit_number}
                </span>
                <span className="min-w-0 flex-1 truncate font-semibold text-fs-ink-900">
                  {truck.year} {truck.make} {truck.model}
                </span>
              </div>
              <div className="fs-money mt-1.5 text-[11px] text-fs-ink-450">
                VIN {truck.vin} &middot; Plate {truck.license_plate}
              </div>
            </Link>
          ))}
        </div>
      )}

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

function ContactAction({
  href,
  label,
}: {
  href: string | null;
  label: string;
}) {
  const base =
    "flex min-h-[44px] items-center justify-center rounded-fs border text-sm font-bold";
  if (!href) {
    return (
      <span
        className={`${base} cursor-not-allowed border-fs-line-200 text-fs-ink-450 opacity-60`}
        aria-disabled="true"
      >
        {label}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={`${base} border-fs-line-300 text-fs-navy-700 hover:bg-fs-navy-50`}
    >
      {label}
    </a>
  );
}
