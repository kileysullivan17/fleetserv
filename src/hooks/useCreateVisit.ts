import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Database, ServiceVisit } from "@/types/database";
import { visitKeys } from "@/hooks/useVisitsByTruck";

type VisitInsert = Database["public"]["Tables"]["service_visits"]["Insert"];
type LineItemInsert =
  Database["public"]["Tables"]["service_line_items"]["Insert"];

interface CreateVisitInput {
  visit: VisitInsert;
  lineItems: Omit<LineItemInsert, "visit_id">[];
}

export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      visit,
      lineItems,
    }: CreateVisitInput): Promise<ServiceVisit> => {
      const { data: createdVisit, error: visitError } = await db(
        "service_visits"
      )
        .insert(visit)
        .select()
        .single();

      if (visitError) throw visitError;

      if (lineItems.length > 0) {
        const rows: LineItemInsert[] = lineItems.map((item) => ({
          ...item,
          visit_id: createdVisit.id,
        }));
        const { error: itemsError } = await db("service_line_items").insert(
          rows
        );

        // Roll back the orphaned visit if line items fail to insert
        if (itemsError) {
          await db("service_visits").delete().eq("id", createdVisit.id);
          throw itemsError;
        }
      }

      return createdVisit;
    },
    onSuccess: (visit) => {
      void queryClient.invalidateQueries({
        queryKey: visitKeys.byTruck(visit.truck_id),
      });
    },
  });
}
