import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Gates every app route behind an authenticated session. RLS (migration 001)
// locks all tables to authenticated users, so unauthenticated requests would
// only ever load empty screens.
export function RequireAuth() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-page text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
