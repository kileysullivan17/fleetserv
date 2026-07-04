import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { ServiceVisit } from "@/types/database";

export interface VisitHistoryRow extends ServiceVisit {
  line_item_count: number;
  total: number;
}

interface VisitRowWithLineItems extends ServiceVisit {
  service_line_items: { subtotal: number }[];
}

export const visitKeys = {
  byTruck: (truckId: string) => ["visits", "truck", truckId] as const,
};

export function useVisitsByTruck(truckId: string | undefined) {
  return useQuery({
    queryKey: visitKeys.byTruck(truckId ?? ""),
    enabled: Boolean(truckId),
    queryFn: async (): Promise<VisitHistoryRow[]> => {
      const { data, error } = await db("service_visits")
        .select("*, service_line_items(subtotal)")
        .eq("truck_id", truckId as string)
        .order("visit_date", { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as unknown as VisitRowWithLineItems[];
      return rows.map(({ service_line_items, ...visit }) => ({
        ...visit,
        line_item_count: service_line_items.length,
        total: service_line_items.reduce(
          (sum, item) => sum + Number(item.subtotal),
          0
        ),
      }));
    },
  });
}
