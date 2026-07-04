import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Invoice, Quote } from "@/types/database";
import { visitDetailKeys } from "@/hooks/useVisit";
import { visitKeys } from "@/hooks/useVisitsByTruck";

function isoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Reads the highest existing invoice number and allocates the next one.
// Fine for a single-operator prototype. Under concurrent writers this can
// collide; the production fix is a Postgres sequence or an RPC that
// allocates atomically.
async function nextInvoiceNumber(): Promise<string> {
  const { data, error } = await db("invoices")
    .select("invoice_number")
    .order("invoice_number", { ascending: false })
    .limit(1);

  if (error) throw error;

  const last = data?.[0]?.invoice_number;
  const lastN = last ? parseInt(last.replace(/\D/g, ""), 10) : 0;
  const nextN = Number.isNaN(lastN) ? 1 : lastN + 1;
  return `INV-${String(nextN).padStart(4, "0")}`;
}

interface CreateInvoiceInput {
  quote: Quote;
  truckId: string;
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quote }: CreateInvoiceInput): Promise<Invoice> => {
      const invoice_number = await nextInvoiceNumber();

      const issued = new Date();
      const due = new Date(issued);
      due.setDate(due.getDate() + 30);

      const { data: invoice, error: invoiceError } = await db("invoices")
        .insert({
          visit_id: quote.visit_id,
          quote_id: quote.id,
          invoice_number,
          issued_date: isoDate(issued),
          due_date: isoDate(due),
          subtotal: Number(quote.subtotal),
          tax_amount: Number(quote.tax_amount),
          total: Number(quote.total),
          qbo_export_url: null,
          status: "draft",
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      const { error: visitError } = await db("service_visits")
        .update({ status: "invoiced" })
        .eq("id", quote.visit_id);

      // Roll back the invoice if the visit status update fails
      if (visitError) {
        await db("invoices").delete().eq("id", invoice.id);
        throw visitError;
      }

      return invoice;
    },
    onSuccess: (_invoice, { quote, truckId }) => {
      void queryClient.invalidateQueries({
        queryKey: visitDetailKeys.detail(quote.visit_id),
      });
      void queryClient.invalidateQueries({
        queryKey: visitKeys.byTruck(truckId),
      });
      void queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
