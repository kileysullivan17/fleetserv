import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function QuotesPage() {
  return (
    <div>
      <PageHeader
        title="Quotes"
        subtitle="View and export quotes for pending service work."
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
            title="No quotes yet"
            description="Quotes are generated from completed service visits."
          />
        </CardBody>
      </Card>
    </div>
  );
}
