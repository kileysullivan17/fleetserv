import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Kept in its own module (not colocated with AuthProvider) so the provider
// file only exports a component, which keeps Vite fast refresh working.
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
