import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { QuoteStatus } from "@/types/database";

export interface QuoteListRow {
  id: string;
  issued_date: string;
  expiry_date: string;
  total: number;
  status: QuoteStatus;
  visit_date: string | null;
  unit_number: string | null;
  company_name: string | null;
}

interface QuoteListQueryRow {
  id: string;
  issued_date: string;
  expiry_date: string;
  total: number;
  status: QuoteStatus;
  service_visits: {
    visit_date: string;
    trucks: {
      unit_number: string;
      companies: { name: string } | null;
    } | null;
  } | null;
}

export const allQuotesKeys = {
  list: ["quotes", "list"] as const,
};

export function useAllQuotes() {
  return useQuery({
    queryKey: allQuotesKeys.list,
    queryFn: async (): Promise<QuoteListRow[]> => {
      const { data, error } = await db("quotes")
        .select(
          "id, issued_date, expiry_date, total, status, service_visits(visit_date, trucks(unit_number, companies(name)))"
        )
        .order("issued_date", { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as unknown as QuoteListQueryRow[];
      return rows.map((row) => ({
        id: row.id,
        issued_date: row.issued_date,
        expiry_date: row.expiry_date,
        total: Number(row.total),
        status: row.status,
        visit_date: row.service_visits?.visit_date ?? null,
        unit_number: row.service_visits?.trucks?.unit_number ?? null,
        company_name: row.service_visits?.trucks?.companies?.name ?? null,
      }));
    },
  });
}
