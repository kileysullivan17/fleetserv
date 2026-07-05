import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { quoteDisplayNumber } from "@/components/quotes/quoteNumber";
import { useAllQuotes } from "@/hooks/useAllQuotes";
import {
  formatCurrency,
  formatDateShort,
  QUOTE_STATUS_LABELS,
} from "@/utils/format";

const quotesIcon = (
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
);

export function QuotesPage() {
  const navigate = useNavigate();
  const { data: quotes, isLoading, isError } = useAllQuotes();

  return (
    <div>
      <PageHeader
        title="Quotes"
        subtitle="View and export quotes for pending service work."
      />

      {isLoading && (
        <div className="py-12 text-center text-sm text-gray-500">
          Loading quotes...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-brand-coral">
            Could not load quotes.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Check your Supabase connection and refresh the page.
          </p>
        </div>
      )}

      {quotes && quotes.length === 0 && (
        <Card>
          <CardBody className="p-0">
            <EmptyState
              icon={quotesIcon}
              title="No quotes yet"
              description="Quotes are generated from service visits."
            />
          </CardBody>
        </Card>
      )}

      {quotes && quotes.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              All Quotes ({quotes.length})
            </h2>
          </CardHeader>
          <table>
            <thead>
              <tr>
                <th>Quote</th>
                <th>Fleet</th>
                <th>Unit</th>
                <th>Issued</th>
                <th>Status</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/quotes/${quote.id}`)}
                >
                  <td className="font-mono font-medium text-brand-navy">
                    {quoteDisplayNumber(quote.id)}
                  </td>
                  <td className="text-gray-700">
                    {quote.company_name ?? (
                      <span className="text-gray-400">Unknown fleet</span>
                    )}
                  </td>
                  <td className="text-gray-700">
                    {quote.unit_number ? (
                      `Unit ${quote.unit_number}`
                    ) : (
                      <span className="text-gray-400">n/a</span>
                    )}
                  </td>
                  <td className="text-gray-700">
                    {formatDateShort(quote.issued_date)}
                  </td>
                  <td>
                    <StatusBadge
                      status={quote.status}
                      label={QUOTE_STATUS_LABELS[quote.status]}
                    />
                  </td>
                  <td className="text-right font-mono text-gray-700">
                    {formatCurrency(quote.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
