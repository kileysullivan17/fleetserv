import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Quote } from "@/types/database";
import { quoteDetailKeys } from "@/hooks/useQuoteDetail";
import { quoteKeys } from "@/hooks/useQuoteByVisit";
import { visitDetailKeys } from "@/hooks/useVisit";
import { visitKeys } from "@/hooks/useVisitsByTruck";
import { allVisitsKeys } from "@/hooks/useAllVisits";

interface QuoteActionInput {
  quote: Quote;
  truckId: string;
}

// Invalidate every view that reflects the quote or its linked visit: the
// quote detail, the quote-by-visit lookup, the visit detail, the truck's
// visit history, and the board.
function invalidateQuoteViews(
  queryClient: ReturnType<typeof useQueryClient>,
  quote: Quote,
  truckId: string
): void {
  void queryClient.invalidateQueries({
    queryKey: quoteDetailKeys.detail(quote.id),
  });
  void queryClient.invalidateQueries({
    queryKey: quoteKeys.byVisit(quote.visit_id),
  });
  void queryClient.invalidateQueries({
    queryKey: visitDetailKeys.detail(quote.visit_id),
  });
  void queryClient.invalidateQueries({
    queryKey: visitKeys.byTruck(truckId),
  });
  void queryClient.invalidateQueries({ queryKey: allVisitsKeys.board });
}

export function useAcceptQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quote }: QuoteActionInput): Promise<void> => {
      const { error: quoteError } = await db("quotes")
        .update({ status: "accepted" })
        .eq("id", quote.id);

      if (quoteError) throw quoteError;

      const { error: visitError } = await db("service_visits")
        .update({ status: "approved" })
        .eq("id", quote.visit_id);

      // Roll the quote status back to what it was if the visit update fails,
      // so an accepted quote never sits above a visit still reading as quoted.
      if (visitError) {
        await db("quotes")
          .update({ status: quote.status })
          .eq("id", quote.id);
        throw visitError;
      }
    },
    onSuccess: (_data, { quote, truckId }) => {
      invalidateQuoteViews(queryClient, quote, truckId);
    },
  });
}

export function useDeclineQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quote }: QuoteActionInput): Promise<void> => {
      // Decline touches the quote only. The visit stays quoted so a fresh
      // quote can be issued for it later.
      const { error } = await db("quotes")
        .update({ status: "declined" })
        .eq("id", quote.id);

      if (error) throw error;
    },
    onSuccess: (_data, { quote, truckId }) => {
      invalidateQuoteViews(queryClient, quote, truckId);
    },
  });
}
