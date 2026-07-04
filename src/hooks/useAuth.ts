import { useContext } from "react";
import {
  AuthContext,
  type AuthContextValue,
} from "@/components/auth/AuthProvider";

// Reads the auth context. Throws if used outside AuthProvider so a missing
// provider surfaces immediately instead of as a silent null session.
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return ctx;
}
