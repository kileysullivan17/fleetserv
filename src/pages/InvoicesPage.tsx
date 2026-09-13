import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAllInvoices } from "@/hooks/useAllInvoices";
import {
  formatCurrency,
  formatDateShort,
  INVOICE_STATUS_LABELS,
} from "@/utils/format";

const invoicesIcon = (
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
);

export function InvoicesPage() {
  const navigate = useNavigate();
  const { data: invoices, isLoading, isError } = useAllInvoices();

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Billing documents ready for QuickBooks export."
      />

      {isLoading && (
        <div className="py-12 text-center text-sm text-fs-ink-500">
          Loading invoices...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-fs-danger">
            Could not load invoices.
          </p>
          <p className="mt-1 text-sm text-fs-ink-500">
            Check your Supabase connection and refresh the page.
          </p>
        </div>
      )}

      {invoices && invoices.length === 0 && (
        <Card>
          <CardBody className="p-0">
            <EmptyState
              icon={invoicesIcon}
              title="No invoices yet"
              description="Invoices are generated when a quote is approved."
            />
          </CardBody>
        </Card>
      )}

      {invoices && invoices.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="text-sm font-semibold text-fs-ink-900">
              All Invoices ({invoices.length})
            </h2>
          </CardHeader>
          <div className="overflow-x-auto">
            <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Fleet</th>
                <th>Unit</th>
                <th>Issued</th>
                <th>Due</th>
                <th>Status</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                  <td className="font-mono font-medium text-fs-ink-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="text-fs-ink-900">
                    {invoice.company_name ?? (
                      <span className="text-fs-ink-500">Unknown fleet</span>
                    )}
                  </td>
                  <td className="text-fs-ink-900">
                    {invoice.unit_number ? (
                      `Unit ${invoice.unit_number}`
                    ) : (
                      <span className="text-fs-ink-500">n/a</span>
                    )}
                  </td>
                  <td className="text-fs-ink-900">
                    {formatDateShort(invoice.issued_date)}
                  </td>
                  <td className="text-fs-ink-900">
                    {formatDateShort(invoice.due_date)}
                  </td>
                  <td>
                    <StatusBadge
                      status={invoice.status}
                      label={INVOICE_STATUS_LABELS[invoice.status]}
                    />
                  </td>
                  <td className="fs-money text-fs-ink-900">
                    {formatCurrency(invoice.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
