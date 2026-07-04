import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/Button";
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
  errors: FieldErrors<VisitFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function LineItemRow({
  index,
  item,
  subtotal,
  register,
  errors,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  const itemErrors = errors.lineItems?.[index];
  const base = `lineItems.${index}` as const;

  return (
    <div className="rounded-lg border border-brand-sand-dark bg-brand-sand/40 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="w-56">
          <label htmlFor={`${base}.service_type`} className="form-label">
            Service type
          </label>
          <select
            id={`${base}.service_type`}
            className="form-select"
            {...register(`${base}.service_type`)}
          >
            {SERVICE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 pt-6">
          <span className="text-sm font-mono font-medium text-brand-navy">
            {formatCurrency(subtotal)}
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRemove}
            disabled={!canRemove}
            aria-label={`Remove line item ${index + 1}`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="mt-3">
        {item.service_type === "oil_change" && (
          <div className="grid grid-cols-4 gap-4">
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
            <div>
              <label htmlFor={`${base}.quantity`} className="form-label">
                Quantity
              </label>
              <input
                id={`${base}.quantity`}
                type="number"
                step="0.1"
                min="0"
                className="form-input"
                {...register(`${base}.quantity`)}
              />
              {itemErrors?.quantity && (
                <p className="form-error">{itemErrors.quantity.message}</p>
              )}
            </div>
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
                className="form-input"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}

        {item.service_type === "fluid" && (
          <div className="grid grid-cols-4 gap-4">
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
            <div>
              <label htmlFor={`${base}.quantity`} className="form-label">
                Quantity
              </label>
              <input
                id={`${base}.quantity`}
                type="number"
                step="0.1"
                min="0"
                className="form-input"
                {...register(`${base}.quantity`)}
              />
              {itemErrors?.quantity && (
                <p className="form-error">{itemErrors.quantity.message}</p>
              )}
            </div>
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
                className="form-input"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}

        {item.service_type === "fuel" && (
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label htmlFor={`${base}.quantity`} className="form-label">
                Gallons
              </label>
              <input
                id={`${base}.quantity`}
                type="number"
                step="0.1"
                min="0"
                className="form-input"
                {...register(`${base}.quantity`)}
              />
              {itemErrors?.quantity && (
                <p className="form-error">{itemErrors.quantity.message}</p>
              )}
            </div>
            <div>
              <label htmlFor={`${base}.unit_price`} className="form-label">
                Price per gallon
              </label>
              <input
                id={`${base}.unit_price`}
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                {...register(`${base}.unit_price`)}
              />
              {itemErrors?.unit_price && (
                <p className="form-error">{itemErrors.unit_price.message}</p>
              )}
            </div>
          </div>
        )}

        {item.service_type === "tire_air" && (
          <div className="grid grid-cols-3 gap-4">
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
                className="form-input"
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
                className="form-input"
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
            <div className="grid grid-cols-2 gap-3">
              {INSPECTION_CATEGORIES.map((cat) => {
                const value = item.inspection[cat.key];
                return (
                  <div
                    key={cat.key}
                    className="flex items-center justify-between rounded border border-brand-sand-dark bg-white px-3 py-2"
                  >
                    <span className="text-sm text-brand-navy">
                      {cat.label}
                    </span>
                    <div className="flex rounded overflow-hidden border border-brand-sand-dark">
                      <label
                        className={cn(
                          "px-3 py-1 text-xs font-medium cursor-pointer transition-colors",
                          value === "pass"
                            ? "bg-status-approved-bg text-status-approved"
                            : "bg-white text-gray-400 hover:text-gray-600"
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
                          "px-3 py-1 text-xs font-medium cursor-pointer transition-colors border-l border-brand-sand-dark",
                          value === "fail"
                            ? "bg-status-declined-bg text-status-declined"
                            : "bg-white text-gray-400 hover:text-gray-600"
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
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
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
                  className="form-input"
                  {...register(`${base}.unit_price`)}
                />
                {itemErrors?.unit_price && (
                  <p className="form-error">
                    {itemErrors.unit_price.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {item.service_type === "add_on" && (
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
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
            <div>
              <label htmlFor={`${base}.quantity`} className="form-label">
                Quantity
              </label>
              <input
                id={`${base}.quantity`}
                type="number"
                step="0.1"
                min="0"
                className="form-input"
                {...register(`${base}.quantity`)}
              />
              {itemErrors?.quantity && (
                <p className="form-error">{itemErrors.quantity.message}</p>
              )}
            </div>
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
                className="form-input"
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
