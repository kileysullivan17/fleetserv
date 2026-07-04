import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
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

export const router = createBrowserRouter([
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
]);
