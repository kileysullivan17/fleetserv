import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { ServiceLineItem } from "@/types/database";

export const lineItemKeys = {
  byVisit: (visitId: string) => ["lineItems", "visit", visitId] as const,
};

export function useLineItemsByVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: lineItemKeys.byVisit(visitId ?? ""),
    enabled: Boolean(visitId),
    queryFn: async (): Promise<ServiceLineItem[]> => {
      const { data, error } = await db("service_line_items")
        .select("*")
        .eq("visit_id", visitId as string)
        .order("id", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}
