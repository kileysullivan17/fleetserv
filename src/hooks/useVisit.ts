import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Company, ServiceVisit, Truck } from "@/types/database";

export interface VisitDetail extends ServiceVisit {
  trucks: (Truck & { companies: Company | null }) | null;
}

export const visitDetailKeys = {
  detail: (id: string) => ["visits", "detail", id] as const,
};

export function useVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: visitDetailKeys.detail(visitId ?? ""),
    enabled: Boolean(visitId),
    queryFn: async (): Promise<VisitDetail> => {
      const { data, error } = await db("service_visits")
        .select("*, trucks(*, companies(*))")
        .eq("id", visitId as string)
        .single();

      if (error) throw error;
      return data as unknown as VisitDetail;
    },
  });
}
