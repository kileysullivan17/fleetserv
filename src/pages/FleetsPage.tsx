import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddCompanyModal } from "@/components/fleet/AddCompanyModal";
import { useCompanies } from "@/hooks/useCompanies";
import { formatDateShort } from "@/utils/format";

export function FleetsPage() {
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const { data: companies, isLoading, isError } = useCompanies();

  return (
    <div>
      <PageHeader
        title="Fleets"
        subtitle="Manage fleet customers and their trucks."
        actions={<Button onClick={() => setAddOpen(true)}>Add Fleet</Button>}
      />

      <Card>
        {isLoading && (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Loading fleets...
          </div>
        )}

        {isError && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-brand-coral">
              Could not load fleets.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Check your Supabase connection and refresh the page.
            </p>
          </div>
        )}

        {companies && companies.length === 0 && (
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
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            }
            title="No fleets yet"
            description="Add your first fleet customer to get started."
            action={
              <Button onClick={() => setAddOpen(true)}>Add Fleet</Button>
            }
          />
        )}

        {companies && companies.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>County</th>
                <th>Contact</th>
                <th className="text-right">Trucks</th>
                <th className="text-right">Added</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/fleets/${company.id}`)}
                >
                  <td className="font-medium text-brand-navy">
                    {company.name}
                  </td>
                  <td className="text-gray-600">{company.hawaii_county}</td>
                  <td>
                    <span className="block text-gray-700">
                      {company.contact_name}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {company.contact_email}
                    </span>
                  </td>
                  <td className="text-right font-mono text-gray-700">
                    {company.truck_count}
                  </td>
                  <td className="text-right text-gray-500">
                    {formatDateShort(company.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <AddCompanyModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
