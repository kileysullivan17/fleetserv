import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LineItemsTable } from "@/components/visits/LineItemsTable";
import { quoteDisplayNumber } from "@/components/quotes/quoteNumber";
import { useQuoteDetail } from "@/hooks/useQuoteDetail";
import { useAcceptQuote, useDeclineQuote } from "@/hooks/useAcceptQuote";
import {
  formatCurrency,
  formatDate,
  QUOTE_STATUS_LABELS,
} from "@/utils/format";

export function QuoteDetailPage() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const { data: quote, isLoading, isError } = useQuoteDetail(quoteId);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  const acceptQuote = useAcceptQuote();
  const declineQuote = useDeclineQuote();
  const decisionPending = acceptQuote.isPending || declineQuote.isPending;

  const onAccept = () => {
    const visit = quote?.service_visits;
    if (!quote || !visit) return;
    acceptQuote.mutate({ quote, truckId: visit.truck_id });
  };

  const onDecline = () => {
    const visit = quote?.service_visits;
    if (!quote || !visit) return;
    declineQuote.mutate({ quote, truckId: visit.truck_id });
  };

  const onDownloadPdf = async () => {
    const visit = quote?.service_visits;
    const truck = visit?.trucks;
    const company = truck?.companies;
    if (!quote || !visit || !truck || !company) return;

    setDownloading(true);
    setDownloadError(false);
    try {
      // react-pdf is heavy, so it loads only when a download is requested
      const [{ pdf }, { QuotePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/quotes/QuotePdf"),
      ]);

      const blob = await pdf(
        <QuotePdf
          quote={quote}
          visit={visit}
          truck={truck}
          company={company}
          lineItems={visit.service_line_items}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${quoteDisplayNumber(quote.id)}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading quote...
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-brand-coral">
          Quote not found.
        </p>
        <Link
          to="/quotes"
          className="mt-2 inline-block text-sm text-brand-teal hover:underline"
        >
          Back to Quotes
        </Link>
      </div>
    );
  }

  const visit = quote.service_visits;
  const truck = visit?.trucks;
  const company = truck?.companies;
  const lineItems = visit?.service_line_items ?? [];

  return (
    <div>
      <nav className="mb-4 text-sm" aria-label="Breadcrumb">
        <Link to="/quotes" className="text-brand-teal hover:underline">
          Quotes
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">
          Quote for {formatDate(quote.issued_date)}
        </span>
      </nav>

      <PageHeader
        title={
          company
            ? `${quoteDisplayNumber(quote.id)}: ${company.name}`
            : quoteDisplayNumber(quote.id)
        }
        subtitle={[
          truck
            ? `Unit ${truck.unit_number}: ${truck.year} ${truck.make} ${truck.model}`
            : null,
          visit ? `Visit ${formatDate(visit.visit_date)}` : null,
        ]
          .filter(Boolean)
          .join(". ")}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge
              status={quote.status}
              label={QUOTE_STATUS_LABELS[quote.status]}
            />
            {(quote.status === "draft" || quote.status === "sent") && (
              <>
                <Button
                  onClick={onAccept}
                  loading={acceptQuote.isPending}
                  disabled={decisionPending}
                >
                  Accept Quote
                </Button>
                <Button
                  variant="secondary"
                  onClick={onDecline}
                  loading={declineQuote.isPending}
                  disabled={decisionPending}
                >
                  Decline Quote
                </Button>
              </>
            )}
            <Button
              onClick={() => void onDownloadPdf()}
              loading={downloading}
              disabled={!visit || !truck || !company}
            >
              Download PDF
            </Button>
          </div>
        }
      />

      {acceptQuote.isError && (
        <p className="form-error mb-4">
          Could not accept the quote. Try again.
        </p>
      )}

      {declineQuote.isError && (
        <p className="form-error mb-4">
          Could not decline the quote. Try again.
        </p>
      )}

      {downloadError && (
        <p className="form-error mb-4">
          Could not generate the PDF. Try again.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 self-start">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Quote Details
            </h2>
          </CardHeader>
          <CardBody>
            <dl className="space-y-4">
              <div className="flex gap-8">
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Issued
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700">
                    {formatDate(quote.issued_date)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Expires
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700">
                    {formatDate(quote.expiry_date)}
                  </dd>
                </div>
              </div>
              {company && (
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bill To
                  </dt>
                  <dd className="mt-1 text-sm text-brand-navy">
                    {company.name}
                  </dd>
                  <dd className="text-sm text-gray-600">
                    {company.contact_name}
                  </dd>
                  <dd className="text-sm text-gray-600">
                    {company.billing_address}
                  </dd>
                </div>
              )}
              <div className="border-t border-brand-sand-dark pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-mono text-gray-700">
                    {formatCurrency(Number(quote.subtotal))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tax{company ? ` (${company.tax_rate}%)` : ""}
                  </span>
                  <span className="font-mono text-gray-700">
                    {formatCurrency(Number(quote.tax_amount))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-brand-sand-dark pt-2">
                  <span className="text-sm font-medium text-brand-navy">
                    Total
                  </span>
                  <span className="font-mono text-base font-semibold text-brand-navy">
                    {formatCurrency(Number(quote.total))}
                  </span>
                </div>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2 self-start">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Line Items ({lineItems.length})
            </h2>
          </CardHeader>
          <LineItemsTable items={lineItems} />
        </Card>
      </div>

      {visit && (
        <p className="mt-6 text-sm">
          <Link
            to={`/visits/${visit.id}`}
            className="text-brand-teal hover:underline"
          >
            View the source service visit
          </Link>
        </p>
      )}
    </div>
  );
}
