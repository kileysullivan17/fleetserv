import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DocumentArtifact } from "@/components/documents/DocumentArtifact";
import { quoteDisplayNumber } from "@/components/quotes/quoteNumber";
import { useQuoteDetail } from "@/hooks/useQuoteDetail";
import { useAcceptQuote, useDeclineQuote } from "@/hooks/useAcceptQuote";
import { QUOTE_STATUS_LABELS } from "@/utils/format";

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
  const canDecide = quote.status === "draft" || quote.status === "sent";

  return (
    <div className="mx-auto max-w-xl">
      {/* App chrome: hidden in print, the artifact below is what prints. */}
      <div className="fs-app-chrome">
        <nav className="mb-3 text-sm" aria-label="Breadcrumb">
          <Link to="/quotes" className="font-medium text-fs-navy-700 hover:underline">
            Quotes
          </Link>
          <span className="mx-2 text-fs-ink-450">/</span>
          <span className="text-fs-ink-500">{quoteDisplayNumber(quote.id)}</span>
        </nav>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge
            status={quote.status}
            label={QUOTE_STATUS_LABELS[quote.status]}
          />
          <span className="fs-money text-sm text-fs-ink-500">
            {company?.name}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            {canDecide && (
              <>
                <Button
                  variant="secondary"
                  onClick={onDecline}
                  loading={declineQuote.isPending}
                  disabled={decisionPending}
                >
                  Decline
                </Button>
                <Button
                  onClick={onAccept}
                  loading={acceptQuote.isPending}
                  disabled={decisionPending}
                >
                  Mark accepted
                </Button>
              </>
            )}
            <Button
              variant="secondary"
              onClick={() => void onDownloadPdf()}
              loading={downloading}
              disabled={!visit || !truck || !company}
            >
              PDF
            </Button>
          </div>
        </div>

        {acceptQuote.isError && (
          <p className="form-error mb-4">Could not accept the quote. Try again.</p>
        )}
        {declineQuote.isError && (
          <p className="form-error mb-4">Could not decline the quote. Try again.</p>
        )}
        {downloadError && (
          <p className="form-error mb-4">Could not generate the PDF. Try again.</p>
        )}
      </div>

      <DocumentArtifact
        kind="quote"
        number={quoteDisplayNumber(quote.id)}
        issuedDate={quote.issued_date}
        secondaryDate={quote.expiry_date}
        company={company ?? null}
        truck={truck ?? null}
        lineItems={lineItems}
        subtotal={Number(quote.subtotal)}
        taxAmount={Number(quote.tax_amount)}
        total={Number(quote.total)}
        taxRate={company ? Number(company.tax_rate) : null}
      />

      {visit && (
        <p className="fs-app-chrome mt-4 text-sm">
          <Link
            to={`/visits/${visit.id}`}
            className="font-medium text-fs-navy-700 hover:underline"
          >
            View the source service visit
          </Link>
        </p>
      )}
    </div>
  );
}
