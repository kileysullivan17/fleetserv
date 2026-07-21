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
const COUNTY_LABELS: Record<HawaiiCounty, string> = {
  Hawaii: "Hawaiʻi (Big Island)",
  Honolulu: "Oʻahu (Honolulu)",
  Maui: "Maui",
  Kauai: "Kauaʻi",
};

// A company name and a mobile number are all you need to send a quote; the DB
// defaults the rest to empty, so the other fields stay optional (board 1e).
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contact_phone: z
    .string()
    .min(7, "Enter a mobile number")
    .regex(/^[\d\s\-().+]+$/, "Phone can only contain digits and separators"),
  contact_name: z.string(),
  contact_email: z
    .string()
    .email("Enter a valid email address")
    .or(z.literal("")),
  billing_address: z.string(),
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

const Req = () => <span className="text-fs-overdue-text">*</span>;

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
      name: "",
      contact_phone: "",
      contact_name: "",
      contact_email: "",
      billing_address: "",
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
      title="New customer"
      description="A company name and a mobile number is all you need to send a quote. Trucks come next."
    >
      <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
        <div>
          <label htmlFor="name" className="form-label">
            Company name <Req />
          </label>
          <input
            id="name"
            type="text"
            className="form-input min-h-[52px]"
            placeholder="Aloha Freight Lines"
            {...register("name")}
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="hawaii_county" className="form-label">
            Island
          </label>
          <select
            id="hawaii_county"
            className="form-select min-h-[52px]"
            {...register("hawaii_county", {
              onChange: (e) => onCountyChange(e.target.value as HawaiiCounty),
            })}
          >
            {HAWAII_COUNTIES.map((county) => (
              <option key={county} value={county}>
                {COUNTY_LABELS[county]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact_name" className="form-label">
            Contact name
          </label>
          <input
            id="contact_name"
            type="text"
            className="form-input min-h-[52px]"
            placeholder="Keanu Kahale"
            {...register("contact_name")}
          />
        </div>

        <div>
          <label htmlFor="contact_phone" className="form-label">
            Mobile <Req />
          </label>
          <input
            id="contact_phone"
            type="tel"
            inputMode="tel"
            className="form-input fs-money min-h-[52px] !text-left"
            placeholder="(808) 555-0142"
            {...register("contact_phone")}
          />
          {errors.contact_phone && (
            <p className="form-error">{errors.contact_phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact_email" className="form-label">
            Email
          </label>
          <input
            id="contact_email"
            type="email"
            className="form-input min-h-[52px]"
            placeholder="Where quotes get sent, optional"
            {...register("contact_email")}
          />
          {errors.contact_email && (
            <p className="form-error">{errors.contact_email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="billing_address" className="form-label">
            Yard / service address
          </label>
          <input
            id="billing_address"
            type="text"
            className="form-input min-h-[52px]"
            placeholder="91-210 Hanua St, Kapolei, HI 96707"
            {...register("billing_address")}
          />
        </div>

        <input type="hidden" {...register("tax_rate")} />

        <div className="flex gap-2 rounded-fs-sm border border-brand-coral/30 bg-brand-coral-subtle px-3 py-2.5">
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
            <p className="text-xs font-semibold text-fs-ink-900">
              Alapa&apos;i, confirm this tax rate before invoicing
            </p>
            <p className="mt-0.5 text-xs text-fs-ink-600">
              The county rates here are illustrative placeholders, not verified
              Hawai&#699;i GET rates. Confirm a fleet&apos;s rate on its page
              before billing real customers.
            </p>
          </div>
        </div>

        {createCompany.isError && (
          <p className="form-error">
            Could not save the customer. Check your connection and try again.
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createCompany.isPending}
            className="flex-1"
          >
            Save &amp; add trucks
          </Button>
        </div>
      </form>
    </Modal>
  );
}
