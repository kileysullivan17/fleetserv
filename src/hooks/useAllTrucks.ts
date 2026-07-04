import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Truck } from "@/types/database";

export interface TruckOption extends Truck {
  companies: { name: string } | null;
}

export function useAllTrucks() {
  return useQuery({
    queryKey: ["trucks", "all"],
    queryFn: async (): Promise<TruckOption[]> => {
      const { data, error } = await db("trucks")
        .select("*, companies(name)")
        .order("unit_number", { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as TruckOption[];
    },
  });
}
