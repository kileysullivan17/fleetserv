import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Quote } from "@/types/database";

export const quoteKeys = {
  byVisit: (visitId: string) => ["quotes", "visit", visitId] as const,
};

export function useQuoteByVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: quoteKeys.byVisit(visitId ?? ""),
    enabled: Boolean(visitId),
    queryFn: async (): Promise<Quote | null> => {
      const { data, error } = await db("quotes")
        .select("*")
        .eq("visit_id", visitId as string)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}
