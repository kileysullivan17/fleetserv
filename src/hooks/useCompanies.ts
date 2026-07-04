import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { Company, Database } from "@/types/database";

export interface CompanyWithTruckCount extends Company {
  truck_count: number;
}

type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

interface CompanyRowWithCount extends Company {
  trucks: { count: number }[];
}

export const companyKeys = {
  all: ["companies"] as const,
  detail: (id: string) => ["companies", id] as const,
};

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.all,
    queryFn: async (): Promise<CompanyWithTruckCount[]> => {
      const { data, error } = await db("companies")
        .select("*, trucks(count)")
        .order("name", { ascending: true });

      if (error) throw error;

      const rows = (data ?? []) as unknown as CompanyRowWithCount[];
      return rows.map(({ trucks, ...company }) => ({
        ...company,
        truck_count: trucks[0]?.count ?? 0,
      }));
    },
  });
}

export function useCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: companyKeys.detail(companyId ?? ""),
    enabled: Boolean(companyId),
    queryFn: async (): Promise<Company> => {
      const { data, error } = await db("companies")
        .select("*")
        .eq("id", companyId as string)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CompanyInsert): Promise<Company> => {
      const { data, error } = await db("companies")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}

export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CompanyUpdate): Promise<Company> => {
      const { data, error } = await db("companies")
        .update(input)
        .eq("id", companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyKeys.all });
      void queryClient.invalidateQueries({
        queryKey: companyKeys.detail(companyId),
      });
    },
  });
}
