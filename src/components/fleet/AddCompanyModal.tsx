import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCreateCompany } from "@/hooks/useCompanies";
import type { HawaiiCounty } from "@/types/database";

// County-specific default GET tax rates. Editable per company.
const COUNTY_DEFAULT_TAX_RATES: Record<HawaiiCounty, number> = {
  Hawaii: 4.5,
  Honolulu: 4.712,
  Maui: 4.0,
  Kauai: 4.0,
};

const HAWAII_COUNTIES = ["Hawaii", "Honolulu", "Maui", "Kauai"] as const;

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.string().email("Enter a valid email address"),
  contact_phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[\d\s\-().+]+$/, "Phone can only contain digits and separators"),
  billing_address: z.string().min(1, "Billing address is required"),
  hawaii_county: z.enum(HAWAII_COUNTIES),
  tax_rate: z.coerce
    .number()
    .min(0, "Tax rate cannot be negative")
    .max(15, "Tax rate looks too high. Enter a percentage like 4.712"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface AddCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCompanyModal({ open, onOpenChange }: AddCompanyModalProps) {
  const createCompany = useCreateCompany();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      hawaii_county: "Honolulu",
      tax_rate: COUNTY_DEFAULT_TAX_RATES.Honolulu,
    },
  });

  const onCountyChange = (county: HawaiiCounty) => {
    setValue("hawaii_county", county);
    setValue("tax_rate", COUNTY_DEFAULT_TAX_RATES[county]);
  };

  const onSubmit = handleSubmit(async (values) => {
    await createCompany.mutateAsync(values);
    reset();
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Fleet"
      description="Create a new fleet customer. Tax rate defaults by county and can be adjusted."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="form-label">
            Company name
          </label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="Aloha Freight Lines"
            {...register("name")}
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_name" className="form-label">
              Contact name
            </label>
            <input
              id="contact_name"
              type="text"
              className="form-input"
              placeholder="Keanu Kahale"
              {...register("contact_name")}
            />
            {errors.contact_name && (
              <p className="form-error">{errors.contact_name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="contact_phone" className="form-label">
              Contact phone
            </label>
            <input
              id="contact_phone"
              type="tel"
              className="form-input"
              placeholder="(808) 555-0142"
              {...register("contact_phone")}
            />
            {errors.contact_phone && (
              <p className="form-error">{errors.contact_phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="contact_email" className="form-label">
            Contact email
          </label>
          <input
            id="contact_email"
            type="email"
            className="form-input"
            placeholder="dispatch@alohafreight.com"
            {...register("contact_email")}
          />
          {errors.contact_email && (
            <p className="form-error">{errors.contact_email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="billing_address" className="form-label">
            Billing address
          </label>
          <input
            id="billing_address"
            type="text"
            className="form-input"
            placeholder="91-210 Hanua St, Kapolei, HI 96707"
            {...register("billing_address")}
          />
          {errors.billing_address && (
            <p className="form-error">{errors.billing_address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="hawaii_county" className="form-label">
              County
            </label>
            <select
              id="hawaii_county"
              className="form-select"
              {...register("hawaii_county", {
                onChange: (e) =>
                  onCountyChange(e.target.value as HawaiiCounty),
              })}
            >
              {HAWAII_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
            {errors.hawaii_county && (
              <p className="form-error">{errors.hawaii_county.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="tax_rate" className="form-label">
              Tax rate (%)
            </label>
            <input
              id="tax_rate"
              type="number"
              step="0.001"
              className="form-input"
              {...register("tax_rate")}
            />
            {errors.tax_rate && (
              <p className="form-error">{errors.tax_rate.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 rounded-md border border-brand-coral/30 bg-brand-coral-subtle px-3 py-2.5">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-brand-navy">
              Confirm this tax rate before invoicing
            </p>
            <p className="mt-0.5 text-xs text-gray-600">
              The county rates here are illustrative defaults, not verified
              Hawaii GET rates. The account owner should confirm the current
              rate for this county before billing real customers, then set it
              here. This rate flows onto every quote and invoice.
            </p>
          </div>
        </div>

        {createCompany.isError && (
          <p className="form-error">
            Could not save the company. Check your connection and try again.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={createCompany.isPending}>
            Save Fleet
          </Button>
        </div>
      </form>
    </Modal>
  );
}
