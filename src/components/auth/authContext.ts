import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Access-code-gated self sign-up. Returns whether a session was created
  // immediately (Supabase "confirm email" off) or the user must confirm by
  // email first (confirm on).
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  // Sends a password-reset email that links back to /reset-password. Works for
  // a locked-out user who cannot sign in.
  sendPasswordReset: (email: string) => Promise<void>;
  // Self-service account management for the signed-in user. Both go through
  // supabase.auth.updateUser, so they need no elevated privileges: a user can
  // change their own display name and password without an admin or the
  // Supabase dashboard.
  updateDisplayName: (name: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

// Kept in its own module (not colocated with AuthProvider) so the provider
// file only exports a component, which keeps Vite fast refresh working.
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
