// Database types derived from the FleetServ Hawaii data schema.
// These mirror the Supabase Postgres tables exactly.

export type HawaiiCounty = "Hawaii" | "Honolulu" | "Maui" | "Kauai";

export type ServiceVisitStatus =
  | "draft"
  | "quoted"
  | "approved"
  | "invoiced"
  | "paid";

export type ServiceType =
  | "oil_change"
  | "fluid"
  | "fuel"
  | "tire_air"
  | "visual_inspection"
  | "add_on";

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

// ---- Entities ----

export type Company = {
  id: string;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  billing_address: string;
  hawaii_county: HawaiiCounty;
  tax_rate: number;
  created_at: string;
}

export type Truck = {
  id: string;
  company_id: string;
  unit_number: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  license_plate: string;
  notes: string;
  created_at: string;
}

export type ServiceVisit = {
  id: string;
  truck_id: string;
  technician_name: string;
  visit_date: string;
  status: ServiceVisitStatus;
  notes: string;
  created_at: string;
}

export type ServiceLineItem = {
  id: string;
  visit_id: string;
  service_type: ServiceType;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
}

export type Photo = {
  id: string;
  visit_id: string;
  storage_url: string;
  caption: string;
  uploaded_at: string;
}

export type Quote = {
  id: string;
  visit_id: string;
  issued_date: string;
  expiry_date: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  pdf_url: string;
  status: QuoteStatus;
}

export type Invoice = {
  id: string;
  visit_id: string;
  quote_id: string | null;
  invoice_number: string;
  issued_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  qbo_export_url: string | null;
  status: InvoiceStatus;
}

// ---- Joined / view types used by the UI ----

export interface TruckWithCompany extends Truck {
  company: Company;
}

export interface ServiceVisitWithTruck extends ServiceVisit {
  truck: TruckWithCompany;
}

export interface ServiceVisitDetail extends ServiceVisitWithTruck {
  line_items: ServiceLineItem[];
  photos: Photo[];
  quote: Quote | null;
  invoice: Invoice | null;
}

// ---- Supabase database type map ----
// Used to type the Supabase client via the generic parameter.

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company;
        Insert: Omit<Company, "id" | "created_at">;
        Update: Partial<Omit<Company, "id" | "created_at">>;
        Relationships: [];
      };
      trucks: {
        Row: Truck;
        Insert: Omit<Truck, "id" | "created_at">;
        Update: Partial<Omit<Truck, "id" | "created_at">>;
        Relationships: [];
      };
      service_visits: {
        Row: ServiceVisit;
        Insert: Omit<ServiceVisit, "id" | "created_at">;
        Update: Partial<Omit<ServiceVisit, "id" | "created_at">>;
        Relationships: [];
      };
      service_line_items: {
        Row: ServiceLineItem;
        Insert: Omit<ServiceLineItem, "id">;
        Update: Partial<Omit<ServiceLineItem, "id">>;
        Relationships: [];
      };
      photos: {
        Row: Photo;
        Insert: Omit<Photo, "id" | "uploaded_at">;
        Update: Partial<Omit<Photo, "id" | "uploaded_at">>;
        Relationships: [];
      };
      quotes: {
        Row: Quote;
        Insert: Omit<Quote, "id">;
        Update: Partial<Omit<Quote, "id">>;
        Relationships: [];
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, "id">;
        Update: Partial<Omit<Invoice, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      hawaii_county: HawaiiCounty;
      service_visit_status: ServiceVisitStatus;
      service_type: ServiceType;
      quote_status: QuoteStatus;
      invoice_status: InvoiceStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
