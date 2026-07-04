import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Database, Truck } from "@/types/database";
import { truckKeys } from "@/hooks/useTrucks";
import { companyKeys } from "@/hooks/useCompanies";

type TruckUpdate = Database["public"]["Tables"]["trucks"]["Update"];

export const truckDetailKeys = {
  detail: (id: string) => ["trucks", "detail", id] as const,
};

export function useTruck(truckId: string | undefined) {
  return useQuery({
    queryKey: truckDetailKeys.detail(truckId ?? ""),
    enabled: Boolean(truckId),
    queryFn: async (): Promise<Truck> => {
      const { data, error } = await db("trucks")
        .select("*")
        .eq("id", truckId as string)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateTruck(truckId: string, companyId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TruckUpdate): Promise<Truck> => {
      const { data, error } = await db("trucks")
        .update(input)
        .eq("id", truckId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: truckDetailKeys.detail(truckId),
      });
      if (companyId) {
        void queryClient.invalidateQueries({
          queryKey: truckKeys.byCompany(companyId),
        });
      }
      void queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
