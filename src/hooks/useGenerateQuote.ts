import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Quote } from "@/types/database";
import { visitDetailKeys } from "@/hooks/useVisit";
import { quoteKeys } from "@/hooks/useQuoteByVisit";
import { visitKeys } from "@/hooks/useVisitsByTruck";
import { allQuotesKeys } from "@/hooks/useAllQuotes";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function isoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

interface GenerateQuoteInput {
  visitId: string;
  truckId: string;
  taxRate: number;
  lineItemSubtotals: number[];
}

export function useGenerateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      visitId,
      taxRate,
      lineItemSubtotals,
    }: GenerateQuoteInput): Promise<Quote> => {
      const subtotal = roundMoney(
        lineItemSubtotals.reduce((sum, s) => sum + s, 0)
      );
      const tax_amount = roundMoney(subtotal * (taxRate / 100));
      const total = roundMoney(subtotal + tax_amount);

      const issued = new Date();
      const expiry = new Date(issued);
      expiry.setDate(expiry.getDate() + 30);

      const { data: quote, error: quoteError } = await db("quotes")
        .insert({
          visit_id: visitId,
          issued_date: isoDate(issued),
          expiry_date: isoDate(expiry),
          subtotal,
          tax_amount,
          total,
          pdf_url: "",
          status: "draft",
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      const { error: visitError } = await db("service_visits")
        .update({ status: "quoted" })
        .eq("id", visitId);

      // Roll back the quote if the status update fails, so the visit
      // never points at a quote while still reading as a draft.
      if (visitError) {
        await db("quotes").delete().eq("id", quote.id);
        throw visitError;
      }

      return quote;
    },
    onSuccess: (_quote, { visitId, truckId }) => {
      void queryClient.invalidateQueries({
        queryKey: visitDetailKeys.detail(visitId),
      });
      void queryClient.invalidateQueries({
        queryKey: quoteKeys.byVisit(visitId),
      });
      void queryClient.invalidateQueries({
        queryKey: visitKeys.byTruck(truckId),
      });
      void queryClient.invalidateQueries({ queryKey: allQuotesKeys.list });
    },
  });
}
