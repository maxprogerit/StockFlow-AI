import { AppShell } from "@/components/layout/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import AuthPage from "@/pages/AuthPage";
import InventoryPage from "@/pages/InventoryPage";
import WarehousesPage from "@/pages/WarehousesPage";
import ProductsPage from "@/pages/ProductsPage";
import OrdersPage from "@/pages/OrdersPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ForecastingPage from "@/pages/ForecastingPage";
import SuppliersPage from "@/pages/SuppliersPage";
import AlertsPage from "@/pages/AlertsPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
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
        path="/"
        element={
          <Protected>
            <AppShell />
          </Protected>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="warehouses" element={<WarehousesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="forecasting" element={<ForecastingPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

