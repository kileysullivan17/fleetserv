import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// These are pulled from environment variables set in .env.local (local dev)
// and Vercel project settings (production / preview deployments).
// Both vars are safe to expose in the browser: they are Supabase anon-key
// credentials gated by Row Level Security policies.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Add them to .env.local for local dev, and to Vercel environment variables for deployments."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Typed helper: returns the typed table query builder.
// Usage: db("companies").select("*")
export const db = <T extends keyof Database["public"]["Tables"]>(table: T) =>
  supabase.from(table);
