import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type {
  Company,
  Quote,
  ServiceLineItem,
  ServiceVisit,
  Truck,
} from "@/types/database";

export interface QuoteDetail extends Quote {
  service_visits:
    | (ServiceVisit & {
        trucks: (Truck & { companies: Company | null }) | null;
        service_line_items: ServiceLineItem[];
      })
    | null;
}

export const quoteDetailKeys = {
  detail: (id: string) => ["quotes", "detail", id] as const,
};

export function useQuoteDetail(quoteId: string | undefined) {
  return useQuery({
    queryKey: quoteDetailKeys.detail(quoteId ?? ""),
    enabled: Boolean(quoteId),
    queryFn: async (): Promise<QuoteDetail> => {
      const { data, error } = await db("quotes")
        .select(
          "*, service_visits(*, trucks(*, companies(*)), service_line_items(*))"
        )
        .eq("id", quoteId as string)
        .single();

      if (error) throw error;
      return data as unknown as QuoteDetail;
    },
  });
}
