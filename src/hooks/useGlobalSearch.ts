import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import type { HawaiiCounty, ServiceVisitStatus } from "@/types/database";

export interface CompanyResult {
  id: string;
  name: string;
  hawaii_county: HawaiiCounty;
}

export interface TruckResult {
  id: string;
  company_id: string;
  unit_number: string;
  make: string;
  model: string;
  year: number;
}

export interface VisitResult {
  id: string;
  visit_date: string;
  technician_name: string;
  status: ServiceVisitStatus;
  trucks: { unit_number: string } | null;
}

export interface GlobalSearchResults {
  companies: CompanyResult[];
  trucks: TruckResult[];
  visits: VisitResult[];
}

// PostgREST or= filters treat commas and parens as syntax
function sanitizeQuery(query: string): string {
  return query.replace(/[,()%]/g, " ").trim();
}

// Accepts YYYY-MM-DD or MM/DD/YYYY and returns ISO, else null
function parseAsDate(query: string): string | null {
  const iso = query.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return query;
  const us = query.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) {
    const [, month, day, year] = us;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return null;
}

function useDebounced(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function useGlobalSearch(rawQuery: string) {
  const query = useDebounced(sanitizeQuery(rawQuery), 250);
  const enabled = query.length >= 2;

  return useQuery({
    queryKey: ["globalSearch", query],
    enabled,
    staleTime: 1000 * 30,
    queryFn: async (): Promise<GlobalSearchResults> => {
      const pattern = `%${query}%`;
      const dateQuery = parseAsDate(query);

      let visitsQuery = db("service_visits")
        .select("id, visit_date, technician_name, status, trucks(unit_number)")
        .limit(5);
      visitsQuery = dateQuery
        ? visitsQuery.eq("visit_date", dateQuery)
        : visitsQuery.ilike("technician_name", pattern);

      const [companiesRes, trucksRes, visitsRes] = await Promise.all([
        db("companies")
          .select("id, name, hawaii_county")
          .ilike("name", pattern)
          .order("name")
          .limit(5),
        db("trucks")
          .select("id, company_id, unit_number, make, model, year")
          .or(
            `unit_number.ilike.${pattern},make.ilike.${pattern},model.ilike.${pattern}`
          )
          .order("unit_number")
          .limit(5),
        visitsQuery.order("visit_date", { ascending: false }),
      ]);

      if (companiesRes.error) throw companiesRes.error;
      if (trucksRes.error) throw trucksRes.error;
      if (visitsRes.error) throw visitsRes.error;

      return {
        companies: (companiesRes.data ?? []) as unknown as CompanyResult[],
        trucks: (trucksRes.data ?? []) as unknown as TruckResult[],
        visits: (visitsRes.data ?? []) as unknown as VisitResult[],
      };
    },
  });
}
