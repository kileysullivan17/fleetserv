import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { InvoiceStatus } from "@/types/database";

export interface InvoiceListRow {
  id: string;
  invoice_number: string;
  issued_date: string;
  due_date: string;
  total: number;
  status: InvoiceStatus;
  unit_number: string | null;
  company_name: string | null;
}

interface InvoiceListQueryRow {
  id: string;
  invoice_number: string;
  issued_date: string;
  due_date: string;
  total: number;
  status: InvoiceStatus;
  service_visits: {
    trucks: {
      unit_number: string;
      companies: { name: string } | null;
    } | null;
  } | null;
}

// Keyed under the ["invoices"] prefix so the existing ["invoices"]
// invalidation in useCreateInvoice refreshes this list automatically.
export const allInvoicesKeys = {
  list: ["invoices", "list"] as const,
};

export function useAllInvoices() {
  return useQuery({
    queryKey: allInvoicesKeys.list,
    queryFn: async (): Promise<InvoiceListRow[]> => {
      const { data, error } = await db("invoices")
        .select(
          "id, invoice_number, issued_date, due_date, total, status, service_visits(trucks(unit_number, companies(name)))"
        )
        .order("issued_date", { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as unknown as InvoiceListQueryRow[];
      return rows.map((row) => ({
        id: row.id,
        invoice_number: row.invoice_number,
        issued_date: row.issued_date,
        due_date: row.due_date,
        total: Number(row.total),
        status: row.status,
        unit_number: row.service_visits?.trucks?.unit_number ?? null,
        company_name: row.service_visits?.trucks?.companies?.name ?? null,
      }));
    },
  });
}
