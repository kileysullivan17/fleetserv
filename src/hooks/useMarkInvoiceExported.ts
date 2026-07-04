import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Invoice } from "@/types/database";
import { invoiceDetailKeys } from "@/hooks/useInvoiceDetail";

export function useMarkInvoiceExported(invoiceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<Invoice> => {
      const { data, error } = await db("invoices")
        .update({ qbo_export_url: new Date().toISOString() })
        .eq("id", invoiceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: invoiceDetailKeys.detail(invoiceId),
      });
      void queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
