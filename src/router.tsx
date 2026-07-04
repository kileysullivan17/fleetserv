import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { useAuth } from "@/hooks/useAuth";
import { FleetsPage } from "@/pages/FleetsPage";
import { CompanyDetailPage } from "@/pages/CompanyDetailPage";
import { TruckDetailPage } from "@/pages/TruckDetailPage";
import { VisitsPage } from "@/pages/VisitsPage";
import { NewVisitPage } from "@/pages/NewVisitPage";
import { VisitDetailPage } from "@/pages/VisitDetailPage";
import { QuotesPage } from "@/pages/QuotesPage";
import { QuoteDetailPage } from "@/pages/QuoteDetailPage";
import { InvoicesPage } from "@/pages/InvoicesPage";
import { InvoiceDetailPage } from "@/pages/InvoiceDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Gates every app route behind an authenticated session. RLS (migration 001)
// locks all tables to authenticated users, so unauthenticated requests would
// only ever load empty screens.
function RequireAuth() {
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

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          // Default: redirect root to /fleets
          { index: true, element: <Navigate to="/fleets" replace /> },
          { path: "fleets", element: <FleetsPage /> },
          { path: "fleets/:companyId", element: <CompanyDetailPage /> },
          {
            path: "fleets/:companyId/trucks/:truckId",
            element: <TruckDetailPage />,
          },
          { path: "visits", element: <VisitsPage /> },
          { path: "visits/new", element: <NewVisitPage /> },
          { path: "visits/:visitId", element: <VisitDetailPage /> },
          { path: "quotes", element: <QuotesPage /> },
          { path: "quotes/:quoteId", element: <QuoteDetailPage /> },
          { path: "invoices", element: <InvoicesPage /> },
          { path: "invoices/:invoiceId", element: <InvoiceDetailPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
