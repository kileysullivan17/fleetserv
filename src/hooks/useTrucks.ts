import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Database, Truck } from "@/types/database";
import { companyKeys } from "@/hooks/useCompanies";

type TruckInsert = Database["public"]["Tables"]["trucks"]["Insert"];

export const truckKeys = {
  byCompany: (companyId: string) => ["trucks", "company", companyId] as const,
};

export function useTrucksByCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: truckKeys.byCompany(companyId ?? ""),
    enabled: Boolean(companyId),
    queryFn: async (): Promise<Truck[]> => {
      const { data, error } = await db("trucks")
        .select("*")
        .eq("company_id", companyId as string)
        .order("unit_number", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateTruck(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TruckInsert): Promise<Truck> => {
      const { data, error } = await db("trucks")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: truckKeys.byCompany(companyId),
      });
      // Truck count on the companies list changes
      void queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
