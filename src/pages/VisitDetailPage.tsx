import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  PhotoDropzone,
  createStagedPhoto,
  type StagedPhoto,
} from "@/components/visits/PhotoDropzone";
import { PhotoGrid } from "@/components/visits/PhotoGrid";
import { LineItemsTable } from "@/components/visits/LineItemsTable";
import { useVisit } from "@/hooks/useVisit";
import { useLineItemsByVisit } from "@/hooks/useLineItemsByVisit";
import { useQuoteByVisit } from "@/hooks/useQuoteByVisit";
import { useGenerateQuote } from "@/hooks/useGenerateQuote";
import { useCreateInvoice } from "@/hooks/useCreateInvoice";
import {
  usePhotosByVisit,
  useUploadVisitPhotos,
} from "@/hooks/useVisitPhotos";
import { formatDate, VISIT_STATUS_LABELS } from "@/utils/format";

export function VisitDetailPage() {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const [staged, setStaged] = useState<StagedPhoto[]>([]);

  const { data: visit, isLoading, isError } = useVisit(visitId);
  const { data: lineItems, isLoading: itemsLoading } =
    useLineItemsByVisit(visitId);
  const { data: quote } = useQuoteByVisit(visitId);
  const { data: photos } = usePhotosByVisit(visitId);
  const uploadPhotos = useUploadVisitPhotos(visitId ?? "");
  const generateQuote = useGenerateQuote();
  const createInvoice = useCreateInvoice();

  const onCreateInvoice = async () => {
    if (!visit || !quote) return;
    const invoice = await createInvoice.mutateAsync({
      quote,
      truckId: visit.truck_id,
    });
    navigate(`/invoices/${invoice.id}`);
  };

  const onGenerateQuote = async () => {
    if (!visit || !lineItems || lineItems.length === 0) return;
    const created = await generateQuote.mutateAsync({
      visitId: visit.id,
      truckId: visit.truck_id,
      taxRate: Number(visit.trucks?.companies?.tax_rate ?? 0),
      lineItemSubtotals: lineItems.map((item) => Number(item.subtotal)),
    });
    navigate(`/quotes/${created.id}`);
  };

  const addFiles = (files: File[]) => {
    setStaged((prev) => [...prev, ...files.map(createStagedPhoto)]);
  };

  const setCaption = (id: string, caption: string) => {
    setStaged((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  const removeStaged = (id: string) => {
    setStaged((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const uploadStaged = async () => {
    if (staged.length === 0) return;
    await uploadPhotos.mutateAsync(
      staged.map(({ file, caption }) => ({ file, caption }))
    );
    staged.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setStaged([]);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading visit...
      </div>
    );
  }

  if (isError || !visit) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-brand-coral">
          Visit not found.
        </p>
        <Link
          to="/visits"
          className="mt-2 inline-block text-sm text-brand-teal hover:underline"
        >
          Back to Service Visits
        </Link>
      </div>
    );
  }

  const truck = visit.trucks;
  const company = truck?.companies;

  return (
    <div>
      <nav className="mb-4 text-sm" aria-label="Breadcrumb">
        <Link to="/visits" className="text-brand-teal hover:underline">
          Service Visits
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{formatDate(visit.visit_date)}</span>
      </nav>

      <PageHeader
        title={
          truck
            ? `Unit ${truck.unit_number}: ${formatDate(visit.visit_date)}`
            : formatDate(visit.visit_date)
        }
        subtitle={[
          company?.name,
          truck ? `${truck.year} ${truck.make} ${truck.model}` : null,
          `Technician: ${visit.technician_name}`,
        ]
          .filter(Boolean)
          .join(". ")}
        actions={
          <StatusBadge
            status={visit.status}
            label={VISIT_STATUS_LABELS[visit.status]}
          />
        }
      />

      {visit.notes && (
        <Card className="mb-6">
          <CardBody>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {visit.notes}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Line items */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-sm font-semibold text-brand-navy">
            Line Items{lineItems ? ` (${lineItems.length})` : ""}
          </h2>
        </CardHeader>

        {itemsLoading && (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            Loading line items...
          </div>
        )}

        {lineItems && lineItems.length === 0 && (
          <EmptyState
            title="No line items"
            description="This visit has no services recorded."
            className="py-6"
          />
        )}

        {lineItems && lineItems.length > 0 && (
          <LineItemsTable items={lineItems} />
        )}
      </Card>

      {/* Photos */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-sm font-semibold text-brand-navy">
            Photos{photos ? ` (${photos.length})` : ""}
          </h2>
          {staged.length > 0 && (
            <Button
              size="sm"
              onClick={() => void uploadStaged()}
              loading={uploadPhotos.isPending}
            >
              Upload {staged.length} {staged.length === 1 ? "Photo" : "Photos"}
            </Button>
          )}
        </CardHeader>
        <CardBody className="space-y-6">
          {photos && photos.length > 0 ? (
            <PhotoGrid photos={photos} />
          ) : (
            staged.length === 0 && (
              <EmptyState
                title="No photos yet"
                description="Drop photos below to document this visit."
                className="py-6"
              />
            )
          )}

          <PhotoDropzone
            photos={staged}
            onAdd={addFiles}
            onCaptionChange={setCaption}
            onRemove={removeStaged}
            uploading={uploadPhotos.isPending}
          />

          {uploadPhotos.isError && (
            <p className="form-error">
              Some photos failed to upload. Check your connection and try
              again.
            </p>
          )}
        </CardBody>
      </Card>

      {/* Action bar */}
      <Card>
        <CardBody className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {visit.status === "draft" &&
              "This visit is a draft. Generate a quote to send it for approval."}
            {visit.status === "quoted" &&
              "A quote has been generated for this visit."}
            {visit.status === "approved" &&
              "The quote was approved. Create an invoice to bill this visit."}
            {visit.status === "invoiced" &&
              "This visit has been invoiced."}
            {visit.status === "paid" && "This visit is paid in full."}
          </p>
          <div className="flex gap-2 shrink-0">
            {visit.status === "draft" && (
              <div className="text-right">
                <Button
                  onClick={() => void onGenerateQuote()}
                  loading={generateQuote.isPending}
                  disabled={!lineItems || lineItems.length === 0}
                >
                  Generate Quote
                </Button>
                {(!lineItems || lineItems.length === 0) && (
                  <p className="mt-1 text-2xs text-gray-400">
                    Add line items before generating a quote
                  </p>
                )}
                {generateQuote.isError && (
                  <p className="mt-1 text-2xs text-brand-coral">
                    Could not generate the quote. Try again.
                  </p>
                )}
              </div>
            )}
            {visit.status === "quoted" && quote && (
              <Button onClick={() => navigate(`/quotes/${quote.id}`)}>
                View Quote
              </Button>
            )}
            {visit.status === "approved" && (
              <div className="text-right">
                <Button
                  onClick={() => void onCreateInvoice()}
                  loading={createInvoice.isPending}
                  disabled={!quote}
                >
                  Create Invoice
                </Button>
                {!quote && (
                  <p className="mt-1 text-2xs text-gray-400">
                    No quote found for this visit
                  </p>
                )}
                {createInvoice.isError && (
                  <p className="mt-1 text-2xs text-brand-coral">
                    Could not create the invoice. Try again.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
