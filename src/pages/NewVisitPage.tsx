import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { LineItemRow } from "@/components/visits/LineItemRow";
import { PhotoDropzone } from "@/components/visits/PhotoDropzone";
import {
  createStagedPhoto,
  type StagedPhoto,
} from "@/components/visits/photoStaging";
import { useAllTrucks } from "@/hooks/useAllTrucks";
import { useCreateVisit } from "@/hooks/useCreateVisit";
import { uploadVisitPhoto } from "@/lib/photos";
import {
  computeSubtotal,
  defaultLineItem,
  mapLineItemToDb,
} from "@/lib/serviceTypes";
import { visitFormSchema, type VisitFormValues } from "@/lib/visitSchema";
import { formatCurrency, todayIso } from "@/utils/format";

export function NewVisitPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTruckId = searchParams.get("truckId") ?? "";

  const { data: trucks, isLoading: trucksLoading } = useAllTrucks();
  const createVisit = useCreateVisit();

  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([]);
  const [photoUploadError, setPhotoUploadError] = useState(false);

  const addFiles = (files: File[]) => {
    setStagedPhotos((prev) => [...prev, ...files.map(createStagedPhoto)]);
  };

  const setCaption = (id: string, caption: string) => {
    setStagedPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  const removeStaged = (id: string) => {
    setStagedPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      truck_id: preselectedTruckId,
      technician_name: "",
      visit_date: todayIso(),
      notes: "",
      lineItems: [defaultLineItem()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  // watch() returns live values so subtotals update as the user types
  const watchedItems = watch("lineItems");
  const subtotals = watchedItems.map(computeSubtotal);
  const visitTotal = subtotals.reduce((sum, s) => sum + s, 0);

  const onSubmit = handleSubmit(async (values) => {
    const visit = await createVisit.mutateAsync({
      visit: {
        truck_id: values.truck_id,
        technician_name: values.technician_name,
        visit_date: values.visit_date,
        status: "draft",
        notes: values.notes,
      },
      lineItems: values.lineItems.map(mapLineItemToDb),
    });

    // Photos upload after the visit exists. A photo failure does not
    // block the visit; the detail page allows retrying uploads.
    let anyPhotoFailed = false;
    for (const staged of stagedPhotos) {
      try {
        await uploadVisitPhoto(visit.id, staged.file, staged.caption);
      } catch {
        anyPhotoFailed = true;
      }
    }
    stagedPhotos.forEach((p) => URL.revokeObjectURL(p.previewUrl));

    if (anyPhotoFailed) {
      setPhotoUploadError(true);
      // Brief pause so the user sees the warning before navigation
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    navigate(`/visits/${visit.id}`);
  });

  return (
    <div className="max-w-4xl">
      <nav className="mb-4 text-sm" aria-label="Breadcrumb">
        <Link to="/visits" className="text-brand-teal hover:underline">
          Service Visits
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">New Visit</span>
      </nav>

      <PageHeader
        title="New Service Visit"
        subtitle="Log services performed on a truck. Saves as a draft."
      />

      <form onSubmit={onSubmit} noValidate>
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Visit Details
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="truck_id" className="form-label">
                  Truck
                </label>
                <select
                  id="truck_id"
                  className="form-select"
                  disabled={trucksLoading}
                  {...register("truck_id")}
                >
                  <option value="">
                    {trucksLoading ? "Loading trucks..." : "Select a truck"}
                  </option>
                  {trucks?.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      Unit {truck.unit_number}: {truck.year} {truck.make}{" "}
                      {truck.model}
                      {truck.companies ? ` (${truck.companies.name})` : ""}
                    </option>
                  ))}
                </select>
                {errors.truck_id && (
                  <p className="form-error">{errors.truck_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="technician_name" className="form-label">
                  Technician
                </label>
                <input
                  id="technician_name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  {...register("technician_name")}
                />
                {errors.technician_name && (
                  <p className="form-error">
                    {errors.technician_name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="visit_date" className="form-label">
                  Visit date
                </label>
                <input
                  id="visit_date"
                  type="date"
                  className="form-input"
                  {...register("visit_date")}
                />
                {errors.visit_date && (
                  <p className="form-error">{errors.visit_date.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <label htmlFor="notes" className="form-label">
                  Visit notes
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  className="form-textarea"
                  placeholder="General notes about this visit."
                  {...register("notes")}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Line Items
            </h2>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => append(defaultLineItem())}
            >
              Add Line Item
            </Button>
          </CardHeader>
          <CardBody className="space-y-4">
            {fields.map((field, index) => (
              <LineItemRow
                key={field.id}
                index={index}
                item={watchedItems[index]}
                subtotal={subtotals[index]}
                register={register}
                setValue={setValue}
                errors={errors}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}

            {errors.lineItems?.root && (
              <p className="form-error">{errors.lineItems.root.message}</p>
            )}
            {typeof errors.lineItems?.message === "string" && (
              <p className="form-error">{errors.lineItems.message}</p>
            )}

          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-sm font-semibold text-brand-navy">
              Photos{stagedPhotos.length > 0 ? ` (${stagedPhotos.length})` : ""}
            </h2>
          </CardHeader>
          <CardBody>
            <PhotoDropzone
              photos={stagedPhotos}
              onAdd={addFiles}
              onCaptionChange={setCaption}
              onRemove={removeStaged}
              uploading={createVisit.isPending}
            />
            <p className="mt-2 text-xs text-gray-400">
              Photos upload when the visit is saved.
            </p>
          </CardBody>
        </Card>

        {createVisit.isError && (
          <p className="form-error mt-4">
            Could not save the visit. Check your connection and try again.
          </p>
        )}

        {photoUploadError && (
          <p className="form-error mt-4">
            The visit saved but some photos failed to upload. You can retry
            them from the visit page.
          </p>
        )}

        {/* Pinned totals: subtotal + total sit above the thumb-zone primary
            button. GET is itemized on the quote (per-company rate applied at
            quote generation), not on this pre-tax visit builder. */}
        <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-fs-line-300 bg-white px-4 pb-5 pt-3 shadow-[0_-6px_16px_rgba(13,30,45,0.06)] sm:mx-0 sm:rounded-b-fs">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-fs-ink-500">Subtotal</span>
              <span className="fs-money text-sm font-semibold text-fs-ink-900">
                {formatCurrency(visitTotal)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t-2 border-fs-navy-900 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-fs-ink-900">
                Visit total
              </span>
              <span className="fs-money text-2xl font-bold text-fs-navy-900">
                {formatCurrency(visitTotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-fs-ink-450">
              Hawai&#699;i GET is itemized on the quote.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createVisit.isPending}
                className="flex-1"
              >
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
