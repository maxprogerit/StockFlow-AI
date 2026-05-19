import { AppShell } from "@/components/layout/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import AuthPage from "@/pages/AuthPage";
import { SimplePage } from "@/pages/SimplePage";
import { useAuthStore } from "@/store/auth";
import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function Protected({ children }: { children: ReactElement }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        path="*"
        element={
          <Protected>
            <AppShell>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/inventory" element={<SimplePage title="Inventory" subtitle="Batch tracking, low-stock thresholds, barcode workflows, and stock movement feed." />} />
                <Route path="/warehouses" element={<SimplePage title="Warehouses" subtitle="Capacity utilization, location overview, and inventory distribution analytics." />} />
                <Route path="/products" element={<SimplePage title="Products" subtitle="Catalog management, pricing and cost analysis, supplier-linked product intelligence." />} />
                <Route path="/orders" element={<SimplePage title="Orders" subtitle="Purchase and customer orders with lifecycle and shipment state monitoring." />} />
                <Route path="/analytics" element={<SimplePage title="Analytics" subtitle="Revenue, turnover, margin, and multi-period trend reporting." />} />
                <Route path="/forecasting" element={<SimplePage title="Forecasting" subtitle="AI demand forecasts, restock recommendations, and seasonal trend predictions." />} />
                <Route path="/suppliers" element={<SimplePage title="Suppliers" subtitle="Supplier performance, lead-time reliability, and contact management." />} />
                <Route path="/alerts" element={<SimplePage title="Alerts" subtitle="Real-time smart notifications, low stock warnings, and warehouse incident timeline." />} />
                <Route path="/reports" element={<SimplePage title="Reports" subtitle="PDF and Excel exports, scheduled report pipelines, and financial reporting snapshots." />} />
                <Route path="/settings" element={<SimplePage title="Settings" subtitle="Profile, company settings, user roles, notification preferences, and API key controls." />} />
              </Routes>
            </AppShell>
          </Protected>
        }
      />
    </Routes>
  );
}

