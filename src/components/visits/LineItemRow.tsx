import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import {
  FLUID_TYPES,
  FUEL_TYPES,
  INSPECTION_CATEGORIES,
  OIL_GRADES,
  SERVICE_TYPE_OPTIONS,
  VOLUME_UNITS,
  type LineItemFormValues,
} from "@/lib/serviceTypes";
import type { VisitFormValues } from "@/lib/visitSchema";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

interface LineItemRowProps {
  index: number;
  item: LineItemFormValues;
  subtotal: number;
  register: UseFormRegister<VisitFormValues>;
  setValue: UseFormSetValue<VisitFormValues>;
  errors: FieldErrors<VisitFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

// 44px stepper for gloved hands. Buttons nudge the registered quantity field
// through setValue; the field stays registered so typing still works and the
// visit-total math is untouched.
function QuantityStepper({
  base,
  label,
  value,
  step,
  register,
  setValue,
  error,
}: {
  base: `lineItems.${number}`;
  label: string;
  value: number;
  step: number;
  register: UseFormRegister<VisitFormValues>;
  setValue: UseFormSetValue<VisitFormValues>;
  error?: string;
}) {
  const name = `${base}.quantity` as const;
  const round = (n: number) => Math.round(n * 100) / 100;
  const set = (next: number) =>
    setValue(name, Math.max(0, round(next)), {
      shouldValidate: true,
      shouldDirty: true,
    });

  return (
    <div>
      <span className="form-label">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => set((Number(value) || 0) - step)}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-fs border border-fs-line-300 bg-white text-2xl leading-none text-fs-navy-900 hover:bg-fs-navy-50"
        >
          &minus;
        </button>
        <input
          type="number"
          step={step}
          min="0"
          aria-label={label}
          className="form-input fs-money !px-2 text-center"
          {...register(name)}
        />
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => set((Number(value) || 0) + step)}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-fs border border-fs-line-300 bg-white text-2xl leading-none text-fs-navy-900 hover:bg-fs-navy-50"
        >
          +
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export function LineItemRow({
  index,
  item,
  subtotal,
  register,
  setValue,
  errors,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  const itemErrors = errors.lineItems?.[index];
  const base = `lineItems.${index}` as const;

  // Per-line math: qty x rate, shown for the quantity-based service types.
  const hasQty =
    item.service_type === "oil_change" ||
    item.service_type === "fluid" ||
    item.service_type === "fuel" ||
    item.service_type === "add_on";
  const qtyLabel = item.service_type === "fuel" ? "gal" : item.unit || "ea";

  return (
    <div className="rounded-fs border border-fs-line-200 bg-white p-4 shadow-fs-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor={`${base}.service_type`} className="form-label">
            Service type
          </label>
          <select
            id={`${base}.service_type`}
            className="form-select max-w-xs"
            {...register(`${base}.service_type`)}
          >
            {SERVICE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-end gap-1 pt-6">
          {/* Computed line total: never editable */}
          <span className="fs-money text-[17px] font-semibold text-fs-ink-900">
            {formatCurrency(subtotal)}
          </span>
          {hasQty && (
            <span className="fs-money text-xs text-fs-ink-450">
              {Number(item.quantity) || 0} {qtyLabel} @{" "}
              {formatCurrency(Number(item.unit_price) || 0)}
            </span>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
            aria-label={`Remove line item ${index + 1}`}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-fs-sm text-fs-ink-450 hover:bg-fs-overdue-bg hover:text-fs-overdue-text disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3">
        {item.service_type === "oil_change" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor={`${base}.oil_grade`} className="form-label">
                Grade
              </label>
              <select
                id={`${base}.oil_grade`}
                className="form-select"
                {...register(`${base}.oil_grade`)}
              >
                {OIL_GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <QuantityStepper
              base={base}
              label="Quantity"
              value={item.quantity}
              step={1}
              register={register}
              setValue={setValue}
              error={itemErrors?.quantity?.message}
            />
            <div>
              <label htmlFor={`${base}.unit`} className="form-label">
                Unit
              </label>
              <select
                id={`${base}.unit`}
                className="form-select"
                {...register(`${base}.unit`)}
              >
                {VOLUME_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${base}.unit_price`} className="form-label">
                Price per unit
              </label>
              <input
                id={`${base}.unit_price`}
                type="number"
                step="0.01"
                min="0"
                className="form-input fs-money"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}

        {item.service_type === "fluid" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor={`${base}.fluid_type`} className="form-label">
                Fluid type
              </label>
              <select
                id={`${base}.fluid_type`}
                className="form-select"
                {...register(`${base}.fluid_type`)}
              >
                {FLUID_TYPES.map((fluid) => (
                  <option key={fluid} value={fluid}>
                    {fluid}
                  </option>
                ))}
              </select>
            </div>
            <QuantityStepper
              base={base}
              label="Quantity"
              value={item.quantity}
              step={1}
              register={register}
              setValue={setValue}
              error={itemErrors?.quantity?.message}
            />
            <div>
              <label htmlFor={`${base}.unit`} className="form-label">
                Unit
              </label>
              <select
                id={`${base}.unit`}
                className="form-select"
                {...register(`${base}.unit`)}
              >
                {VOLUME_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${base}.unit_price`} className="form-label">
                Price per unit
              </label>
              <input
                id={`${base}.unit_price`}
                type="number"
                step="0.01"
                min="0"
                className="form-input fs-money"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}

        {item.service_type === "fuel" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor={`${base}.fuel_type`} className="form-label">
                Fuel type
              </label>
              <select
                id={`${base}.fuel_type`}
                className="form-select"
                {...register(`${base}.fuel_type`)}
              >
                {FUEL_TYPES.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>
            <QuantityStepper
              base={base}
              label="Gallons"
              value={item.quantity}
              step={1}
              register={register}
              setValue={setValue}
              error={itemErrors?.quantity?.message}
            />
            <div>
              <label htmlFor={`${base}.unit_price`} className="form-label">
                Price per gallon
              </label>
              <input
                id={`${base}.unit_price`}
                type="number"
                step="0.01"
                min="0"
                className="form-input fs-money"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}

        {item.service_type === "tire_air" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor={`${base}.psi`} className="form-label">
                PSI
              </label>
              <input
                id={`${base}.psi`}
                type="number"
                step="1"
                min="1"
                max="200"
                className="form-input fs-money"
                {...register(`${base}.psi`)}
              />
              {itemErrors?.psi && (
                <p className="form-error">{itemErrors.psi.message}</p>
              )}
            </div>
            <div>
              <label htmlFor={`${base}.tire_location`} className="form-label">
                Tire or axle
              </label>
              <input
                id={`${base}.tire_location`}
                type="text"
                className="form-input"
                placeholder="Front axle average"
                {...register(`${base}.tire_location`)}
              />
            </div>
            <div>
              <label htmlFor={`${base}.unit_price`} className="form-label">
                Service charge
              </label>
              <input
                id={`${base}.unit_price`}
                type="number"
                step="0.01"
                min="0"
                className="form-input fs-money"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}

        {item.service_type === "visual_inspection" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {INSPECTION_CATEGORIES.map((cat) => {
                const value = item.inspection[cat.key];
                return (
                  <div
                    key={cat.key}
                    className="flex items-center justify-between rounded-fs-sm border border-fs-line-200 bg-white px-3 py-2"
                  >
                    <span className="text-sm text-fs-ink-900">{cat.label}</span>
                    <div className="flex overflow-hidden rounded-fs-sm border border-fs-line-200">
                      <label
                        className={cn(
                          "cursor-pointer px-3 py-1.5 text-xs font-semibold transition-colors",
                          value === "pass"
                            ? "bg-fs-accepted-bg text-fs-accepted-text"
                            : "bg-white text-fs-ink-450 hover:text-fs-ink-600"
                        )}
                      >
                        <input
                          type="radio"
                          value="pass"
                          className="sr-only"
                          {...register(`${base}.inspection.${cat.key}`)}
                        />
                        Pass
                      </label>
                      <label
                        className={cn(
                          "cursor-pointer border-l border-fs-line-200 px-3 py-1.5 text-xs font-semibold transition-colors",
                          value === "fail"
                            ? "bg-fs-overdue-bg text-fs-overdue-text"
                            : "bg-white text-fs-ink-450 hover:text-fs-ink-600"
                        )}
                      >
                        <input
                          type="radio"
                          value="fail"
                          className="sr-only"
                          {...register(`${base}.inspection.${cat.key}`)}
                        />
                        Fail
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor={`${base}.inspection_notes`}
                  className="form-label"
                >
                  Inspection notes
                </label>
                <input
                  id={`${base}.inspection_notes`}
                  type="text"
                  className="form-input"
                  placeholder="Left brake pad at 20 percent, recommend replacement"
                  {...register(`${base}.inspection_notes`)}
                />
              </div>
              <div>
                <label htmlFor={`${base}.unit_price`} className="form-label">
                  Inspection fee
                </label>
                <input
                  id={`${base}.unit_price`}
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input fs-money"
                  {...register(`${base}.unit_price`)}
                />
                {itemErrors?.unit_price && (
                  <p className="form-error">{itemErrors.unit_price.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {item.service_type === "add_on" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
            <div className="col-span-2 sm:col-span-3">
              <label htmlFor={`${base}.description`} className="form-label">
                Description
              </label>
              <input
                id={`${base}.description`}
                type="text"
                className="form-input"
                placeholder="Replace wiper blades"
                {...register(`${base}.description`)}
              />
              {itemErrors?.description && (
                <p className="form-error">{itemErrors.description.message}</p>
              )}
            </div>
            <QuantityStepper
              base={base}
              label="Quantity"
              value={item.quantity}
              step={1}
              register={register}
              setValue={setValue}
              error={itemErrors?.quantity?.message}
            />
            <div>
              <label htmlFor={`${base}.unit`} className="form-label">
                Unit
              </label>
              <input
                id={`${base}.unit`}
                type="text"
                className="form-input"
                placeholder="each, hours"
                {...register(`${base}.unit`)}
              />
              {itemErrors?.unit && (
                <p className="form-error">{itemErrors.unit.message}</p>
              )}
            </div>
            <div>
              <label htmlFor={`${base}.unit_price`} className="form-label">
                Unit price
              </label>
              <input
                id={`${base}.unit_price`}
                type="number"
                step="0.01"
                min="0"
                className="form-input fs-money"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
