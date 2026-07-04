import type { Database, ServiceType } from "@/types/database";

type LineItemInsert = Omit<
  Database["public"]["Tables"]["service_line_items"]["Insert"],
  "visit_id"
>;

export const OIL_GRADES = [
  "15W-40",
  "10W-30",
  "5W-40",
  "0W-40",
  "SAE 30",
] as const;

export const FLUID_TYPES = [
  "Coolant",
  "Transmission",
  "Brake",
  "Power Steering",
  "DEF",
] as const;

export const FUEL_TYPES = ["Diesel", "Gas", "DEF"] as const;

export const VOLUME_UNITS = ["quarts", "gallons"] as const;

export const INSPECTION_CATEGORIES = [
  { key: "lights", label: "Lights" },
  { key: "brakes", label: "Brakes" },
  { key: "tires_wheels", label: "Tires and Wheels" },
  { key: "belts_hoses", label: "Belts and Hoses" },
  { key: "fluid_leaks", label: "Fluid Leaks" },
  { key: "mirrors_glass", label: "Mirrors and Glass" },
] as const;

export type InspectionCategoryKey =
  (typeof INSPECTION_CATEGORIES)[number]["key"];

export const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "oil_change", label: "Oil Change" },
  { value: "fluid", label: "Fluid" },
  { value: "fuel", label: "Fuel" },
  { value: "tire_air", label: "Tire Air" },
  { value: "visual_inspection", label: "Visual Inspection" },
  { value: "add_on", label: "Add-On" },
];

// Flat form shape shared by every line item row. Conditional fields are
// validated per service type in the Zod schema.
export interface LineItemFormValues {
  service_type: ServiceType;
  oil_grade: string;
  fluid_type: string;
  fuel_type: string;
  quantity: number;
  unit: string;
  unit_price: number;
  description: string;
  psi: number;
  tire_location: string;
  inspection: Record<InspectionCategoryKey, "pass" | "fail">;
  inspection_notes: string;
}

export function defaultLineItem(
  service_type: ServiceType = "oil_change"
): LineItemFormValues {
  return {
    service_type,
    oil_grade: OIL_GRADES[0],
    fluid_type: FLUID_TYPES[0],
    fuel_type: FUEL_TYPES[0],
    quantity: 1,
    unit: "quarts",
    unit_price: 0,
    description: "",
    psi: 100,
    tire_location: "",
    inspection: {
      lights: "pass",
      brakes: "pass",
      tires_wheels: "pass",
      belts_hoses: "pass",
      fluid_leaks: "pass",
      mirrors_glass: "pass",
    },
    inspection_notes: "",
  };
}

// Live subtotal for display. Mirrors the mapping rules below.
export function computeSubtotal(item: LineItemFormValues): number {
  const price = Number(item.unit_price) || 0;
  switch (item.service_type) {
    case "tire_air":
    case "visual_inspection":
      return price;
    default:
      return (Number(item.quantity) || 0) * price;
  }
}

// Map a form row to a DB insert row, preserving subtotal = quantity x unit_price.
export function mapLineItemToDb(item: LineItemFormValues): LineItemInsert {
  const price = Number(item.unit_price) || 0;

  switch (item.service_type) {
    case "oil_change":
      return {
        service_type: "oil_change",
        description: `Oil change: ${item.oil_grade}`,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: price,
        subtotal: item.quantity * price,
      };
    case "fluid":
      return {
        service_type: "fluid",
        description: `Fluid: ${item.fluid_type}`,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: price,
        subtotal: item.quantity * price,
      };
    case "fuel":
      return {
        service_type: "fuel",
        description: `Fuel: ${item.fuel_type}`,
        quantity: item.quantity,
        unit: "gallons",
        unit_price: price,
        subtotal: item.quantity * price,
      };
    case "tire_air": {
      const location = item.tire_location.trim();
      return {
        service_type: "tire_air",
        description: `Tire air: ${item.psi} PSI${location ? `, ${location}` : ""}`,
        quantity: 1,
        unit: "each",
        unit_price: price,
        subtotal: price,
      };
    }
    case "visual_inspection": {
      const results = INSPECTION_CATEGORIES.map(
        (cat) =>
          `${cat.label}: ${item.inspection[cat.key] === "pass" ? "Pass" : "Fail"}`
      ).join(", ");
      const notes = item.inspection_notes.trim();
      return {
        service_type: "visual_inspection",
        description: `Inspection. ${results}${notes ? `. Notes: ${notes}` : ""}`,
        quantity: 1,
        unit: "each",
        unit_price: price,
        subtotal: price,
      };
    }
    case "add_on":
      return {
        service_type: "add_on",
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: price,
        subtotal: item.quantity * price,
      };
  }
}
