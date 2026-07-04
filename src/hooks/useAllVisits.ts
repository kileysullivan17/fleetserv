import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { ServiceVisitStatus } from "@/types/database";

export interface VisitBoardRow {
  id: string;
  truck_id: string;
  visit_date: string;
  technician_name: string;
  status: ServiceVisitStatus;
  unit_number: string | null;
  company_name: string | null;
  total: number;
}

interface VisitBoardQueryRow {
  id: string;
  truck_id: string;
  visit_date: string;
  technician_name: string;
  status: ServiceVisitStatus;
  trucks: {
    unit_number: string;
    companies: { name: string } | null;
  } | null;
  service_line_items: { subtotal: number }[];
}

export const allVisitsKeys = {
  board: ["visits", "board"] as const,
};

export function useAllVisits() {
  return useQuery({
    queryKey: allVisitsKeys.board,
    queryFn: async (): Promise<VisitBoardRow[]> => {
      const { data, error } = await db("service_visits")
        .select(
          "id, truck_id, visit_date, technician_name, status, trucks(unit_number, companies(name)), service_line_items(subtotal)"
        )
        .order("visit_date", { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as unknown as VisitBoardQueryRow[];
      return rows.map((row) => ({
        id: row.id,
        truck_id: row.truck_id,
        visit_date: row.visit_date,
        technician_name: row.technician_name,
        status: row.status,
        unit_number: row.trucks?.unit_number ?? null,
        company_name: row.trucks?.companies?.name ?? null,
        total: row.service_line_items.reduce(
          (sum, item) => sum + Number(item.subtotal),
          0
        ),
      }));
    },
  });
}
