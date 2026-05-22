import {
  BellRing,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UserCircle2,
  Warehouse
} from "lucide-react";

export const navLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/warehouses", label: "Warehouses", icon: Warehouse },
  { to: "/products", label: "Products", icon: Store },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/forecasting", label: "Forecasting", icon: Sparkles },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/alerts", label: "Alerts", icon: BellRing },
  { to: "/reports", label: "Reports", icon: ClipboardList },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: UserCircle2 }
];

export const routeLabelMap = navLinks.reduce<Record<string, string>>((acc, link) => {
  acc[link.to] = link.label;
  return acc;
}, {});
