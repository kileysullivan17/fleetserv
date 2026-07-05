import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LineItemsTable } from "@/components/visits/LineItemsTable";
import { useInvoiceDetail } from "@/hooks/useInvoiceDetail";
import { useMarkInvoiceExported } from "@/hooks/useMarkInvoiceExported";
import { usePhotosByVisit } from "@/hooks/useVisitPhotos";
import { buildInvoiceIif, downloadIif } from "@/lib/iif";
import { downloadBlob } from "@/utils/downloadBlob";
import {
  formatCurrency,
  formatDate,
  INVOICE_STATUS_LABELS,
} from "@/utils/format";

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
    <div>
      <nav className="mb-4 text-sm" aria-label="Breadcrumb">
        <Link to="/invoices" className="text-brand-teal hover:underline">
          Invoices
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{invoice.invoice_number}</span>
      </nav>

      <PageHeader
        title={
          company
            ? `${invoice.invoice_number}: ${company.name}`
            : invoice.invoice_number
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
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              status={invoice.status}
              label={INVOICE_STATUS_LABELS[invoice.status]}
            />
            <Button
              variant="secondary"
              onClick={() => void onDownloadInvoicePdf()}
              loading={downloading === "invoice"}
              disabled={!visit || !company || downloading !== null}
              title="Downloads the invoice as a PDF to send to the customer"
            >
              Download PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() => void onDownloadReport()}
              loading={downloading === "report"}
              disabled={!visit || !company || downloading !== null}
              title="Downloads a service report with inspection photos"
            >
              Download Report
            </Button>
            <Button
              variant="secondary"
              onClick={onDownloadIif}
              disabled={!visit || !company}
              title="Downloads a QuickBooks import file (.iif)"
            >
              Download for QuickBooks
            </Button>
            {invoice.qbo_export_url ? (
              <span className="text-xs text-gray-500">
                Exported {formatDate(invoice.qbo_export_url)}
              </span>
            ) : (
              <Button
                onClick={() => markExported.mutate()}
                loading={markExported.isPending}
              >
                Mark as Exported
              </Button>
            )}
          </div>
        }
      />

      {markExported.isError && (
        <p className="form-error mb-4">
          Could not update the export status. Try again.
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
              Invoice Details
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
                    {formatDate(invoice.issued_date)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Due
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700">
                    {formatDate(invoice.due_date)}
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
                    {formatCurrency(Number(invoice.subtotal))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tax{company ? ` (${company.tax_rate}%)` : ""}
                  </span>
                  <span className="font-mono text-gray-700">
                    {formatCurrency(Number(invoice.tax_amount))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-brand-sand-dark pt-2">
                  <span className="text-sm font-medium text-brand-navy">
                    Total Due
                  </span>
                  <span className="font-mono text-base font-semibold text-brand-navy">
                    {formatCurrency(Number(invoice.total))}
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

      <div className="mt-6 flex gap-6 text-sm">
        {visit && (
          <Link
            to={`/visits/${visit.id}`}
            className="text-brand-teal hover:underline"
          >
            View the source service visit
          </Link>
        )}
        {invoice.quote_id && (
          <Link
            to={`/quotes/${invoice.quote_id}`}
            className="text-brand-teal hover:underline"
          >
            View the source quote
          </Link>
        )}
      </div>
    </div>
  );
}
