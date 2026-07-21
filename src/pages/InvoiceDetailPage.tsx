import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DocumentArtifact } from "@/components/documents/DocumentArtifact";
import { useInvoiceDetail } from "@/hooks/useInvoiceDetail";
import { useMarkInvoiceExported } from "@/hooks/useMarkInvoiceExported";
import { usePhotosByVisit } from "@/hooks/useVisitPhotos";
import { buildInvoiceIif, downloadIif } from "@/lib/iif";
import { downloadBlob } from "@/utils/downloadBlob";
import { formatDate, INVOICE_STATUS_LABELS } from "@/utils/format";

export function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { data: invoice, isLoading, isError } = useInvoiceDetail(invoiceId);
  const markExported = useMarkInvoiceExported(invoiceId ?? "");
  const { data: photos } = usePhotosByVisit(invoice?.service_visits?.id);
  const [downloading, setDownloading] = useState<null | "invoice" | "report">(
    null
  );
  const [downloadError, setDownloadError] = useState(false);

  const onDownloadIif = () => {
    const visit = invoice?.service_visits;
    const company = visit?.trucks?.companies;
    if (!invoice || !visit || !company) return;

    const iif = buildInvoiceIif({
      invoice,
      company,
      lineItems: visit.service_line_items,
    });
    downloadIif(`${invoice.invoice_number}.iif`, iif);
  };

  const onDownloadInvoicePdf = async () => {
    const visit = invoice?.service_visits;
    const truck = visit?.trucks;
    const company = truck?.companies;
    if (!invoice || !visit || !truck || !company) return;

    setDownloading("invoice");
    setDownloadError(false);
    try {
      // react-pdf is heavy, so it loads only when a download is requested.
      const [{ pdf }, { InvoicePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/invoices/InvoicePdf"),
      ]);
      const blob = await pdf(
        <InvoicePdf
          invoice={invoice}
          visit={visit}
          truck={truck}
          company={company}
          lineItems={visit.service_line_items}
        />
      ).toBlob();
      downloadBlob(blob, `${invoice.invoice_number}.pdf`);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(null);
    }
  };

  const onDownloadReport = async () => {
    const visit = invoice?.service_visits;
    const truck = visit?.trucks;
    const company = truck?.companies;
    if (!invoice || !visit || !truck || !company) return;

    setDownloading("report");
    setDownloadError(false);
    try {
      const [{ pdf }, { ServiceReportPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/visits/ServiceReportPdf"),
      ]);
      const blob = await pdf(
        <ServiceReportPdf
          visit={visit}
          truck={truck}
          company={company}
          lineItems={visit.service_line_items}
          photos={photos ?? []}
          preparedOn={formatDate(new Date().toISOString().slice(0, 10))}
        />
      ).toBlob();
      downloadBlob(blob, `Service-Report-${visit.visit_date}.pdf`);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading invoice...
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-brand-coral">
          Invoice not found.
        </p>
        <Link
          to="/invoices"
          className="mt-2 inline-block text-sm text-brand-teal hover:underline"
        >
          Back to Invoices
        </Link>
      </div>
    );
  }

  const visit = invoice.service_visits;
  const truck = visit?.trucks;
  const company = truck?.companies;
  const lineItems = visit?.service_line_items ?? [];

  return (
    <div className="mx-auto max-w-xl">
      <div className="fs-app-chrome">
        <nav className="mb-3 text-sm" aria-label="Breadcrumb">
          <Link to="/invoices" className="font-medium text-fs-navy-700 hover:underline">
            Invoices
          </Link>
          <span className="mx-2 text-fs-ink-450">/</span>
          <span className="fs-money text-fs-ink-500">{invoice.invoice_number}</span>
        </nav>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge
            status={invoice.status}
            label={INVOICE_STATUS_LABELS[invoice.status]}
          />
          <span className="fs-money text-sm text-fs-ink-500">
            {company?.name}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => void onDownloadInvoicePdf()}
              loading={downloading === "invoice"}
              disabled={!visit || !company || downloading !== null}
              title="Downloads the invoice as a PDF to send to the customer"
            >
              PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() => void onDownloadReport()}
              loading={downloading === "report"}
              disabled={!visit || !company || downloading !== null}
              title="Downloads a service report with inspection photos"
            >
              Report
            </Button>
            <Button
              variant="secondary"
              onClick={onDownloadIif}
              disabled={!visit || !company}
              title="Downloads a QuickBooks import file (.iif)"
            >
              QuickBooks
            </Button>
            {invoice.qbo_export_url ? (
              <span className="self-center text-xs text-fs-ink-500">
                Exported {formatDate(invoice.qbo_export_url)}
              </span>
            ) : (
              <Button
                onClick={() => markExported.mutate()}
                loading={markExported.isPending}
              >
                Mark exported
              </Button>
            )}
          </div>
        </div>

        {markExported.isError && (
          <p className="form-error mb-4">
            Could not update the export status. Try again.
          </p>
        )}
        {downloadError && (
          <p className="form-error mb-4">Could not generate the PDF. Try again.</p>
        )}
      </div>

      <DocumentArtifact
        kind="invoice"
        number={invoice.invoice_number}
        issuedDate={invoice.issued_date}
        secondaryDate={invoice.due_date}
        company={company ?? null}
        truck={truck ?? null}
        lineItems={lineItems}
        subtotal={Number(invoice.subtotal)}
        taxAmount={Number(invoice.tax_amount)}
        total={Number(invoice.total)}
        taxRate={company ? Number(company.tax_rate) : null}
        paid={invoice.status === "paid"}
      />

      <div className="fs-app-chrome mt-4 flex gap-6 text-sm">
        {visit && (
          <Link
            to={`/visits/${visit.id}`}
            className="font-medium text-fs-navy-700 hover:underline"
          >
            View the source service visit
          </Link>
        )}
        {invoice.quote_id && (
          <Link
            to={`/quotes/${invoice.quote_id}`}
            className="font-medium text-fs-navy-700 hover:underline"
          >
            View the source quote
          </Link>
        )}
      </div>
    </div>
  );
}
