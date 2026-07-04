import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { ServiceVisitStatus } from "@/types/database";
import { allVisitsKeys, type VisitBoardRow } from "@/hooks/useAllVisits";
import { visitDetailKeys } from "@/hooks/useVisit";
import { visitKeys } from "@/hooks/useVisitsByTruck";

interface UpdateStatusInput {
  visitId: string;
  truckId: string;
  status: ServiceVisitStatus;
}

export function useUpdateVisitStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ visitId, status }: UpdateStatusInput) => {
      const { error } = await db("service_visits")
        .update({ status })
        .eq("id", visitId);

      if (error) throw error;
    },
    // Optimistic: move the card immediately, roll back on failure
    onMutate: async ({ visitId, status }) => {
      await queryClient.cancelQueries({ queryKey: allVisitsKeys.board });
      const previous = queryClient.getQueryData<VisitBoardRow[]>(
        allVisitsKeys.board
      );
      queryClient.setQueryData<VisitBoardRow[]>(
        allVisitsKeys.board,
        (rows) =>
          rows?.map((row) =>
            row.id === visitId ? { ...row, status } : row
          ) ?? []
      );
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(allVisitsKeys.board, context.previous);
      }
    },
    onSettled: (_data, _error, { visitId, truckId }) => {
      void queryClient.invalidateQueries({ queryKey: allVisitsKeys.board });
      void queryClient.invalidateQueries({
        queryKey: visitDetailKeys.detail(visitId),
      });
      void queryClient.invalidateQueries({
        queryKey: visitKeys.byTruck(truckId),
      });
    },
  });
}
