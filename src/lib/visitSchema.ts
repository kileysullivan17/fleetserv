import { z } from "zod";
import type { ServiceType } from "@/types/database";

const SERVICE_TYPES: [ServiceType, ...ServiceType[]] = [
  "oil_change",
  "fluid",
  "fuel",
  "tire_air",
  "visual_inspection",
  "add_on",
];

const passFail = z.enum(["pass", "fail"]);

export const lineItemSchema = z
  .object({
    service_type: z.enum(SERVICE_TYPES),
    oil_grade: z.string(),
    fluid_type: z.string(),
    fuel_type: z.string(),
    quantity: z.coerce.number(),
    unit: z.string(),
    unit_price: z.coerce.number(),
    description: z.string(),
    psi: z.coerce.number(),
    tire_location: z.string(),
    inspection: z.object({
      lights: passFail,
      brakes: passFail,
      tires_wheels: passFail,
      belts_hoses: passFail,
      fluid_leaks: passFail,
      mirrors_glass: passFail,
    }),
    inspection_notes: z.string(),
  })
  .superRefine((item, ctx) => {
    const needsQuantity =
      item.service_type === "oil_change" ||
      item.service_type === "fluid" ||
      item.service_type === "fuel" ||
      item.service_type === "add_on";

    if (needsQuantity && item.quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message: "Quantity must be greater than zero",
      });
    }

    if (item.unit_price < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unit_price"],
        message: "Price cannot be negative",
      });
    }

    if (item.service_type === "tire_air") {
      if (item.psi <= 0 || item.psi > 200) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["psi"],
          message: "Enter a PSI between 1 and 200",
        });
      }
    }

    if (item.service_type === "add_on") {
      if (item.description.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["description"],
          message: "Describe the add-on service",
        });
      }
      if (item.unit.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unit"],
          message: "Unit is required",
        });
      }
    }
  });

export const visitFormSchema = z.object({
  truck_id: z.string().uuid("Select a truck"),
  technician_name: z.string().min(1, "Technician name is required"),
  visit_date: z.string().min(1, "Visit date is required"),
  notes: z.string(),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "Add at least one line item to the visit"),
});

export type VisitFormValues = z.infer<typeof visitFormSchema>;
