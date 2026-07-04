import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type {
  Company,
  Invoice,
  ServiceLineItem,
  ServiceVisit,
  Truck,
} from "@/types/database";

export interface InvoiceDetail extends Invoice {
  service_visits:
    | (ServiceVisit & {
        trucks: (Truck & { companies: Company | null }) | null;
        service_line_items: ServiceLineItem[];
      })
    | null;
}

export const invoiceDetailKeys = {
  detail: (id: string) => ["invoices", "detail", id] as const,
};

export function useInvoiceDetail(invoiceId: string | undefined) {
  return useQuery({
    queryKey: invoiceDetailKeys.detail(invoiceId ?? ""),
    enabled: Boolean(invoiceId),
    queryFn: async (): Promise<InvoiceDetail> => {
      const { data, error } = await db("invoices")
        .select(
          "*, service_visits(*, trucks(*, companies(*)), service_line_items(*))"
        )
        .eq("id", invoiceId as string)
        .single();

      if (error) throw error;
      return data as unknown as InvoiceDetail;
    },
  });
}
