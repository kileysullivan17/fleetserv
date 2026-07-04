import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function InvoicesPage() {
  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Billing documents ready for QuickBooks export."
      />
      <Card>
        <CardBody className="p-0">
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
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            }
            title="No invoices yet"
            description="Invoices are generated when a quote is approved."
          />
        </CardBody>
      </Card>
    </div>
  );
}
