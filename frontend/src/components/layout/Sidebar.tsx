import { NavLink } from "react-router-dom";
import { Boxes, Building2, ChartNoAxesCombined, LayoutDashboard, Settings, ShoppingCart, Siren, Sparkles, Store, Truck, Warehouse } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/warehouses", label: "Warehouses", icon: Warehouse },
  { to: "/products", label: "Products", icon: Store },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/forecasting", label: "Forecasting", icon: Sparkles },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/alerts", label: "Alerts", icon: Siren },
  { to: "/reports", label: "Reports", icon: Building2 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="glass fixed left-4 top-4 hidden h-[calc(100vh-2rem)] w-64 rounded-2xl p-4 lg:block">
      <div className="mb-8 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-2xl font-bold text-transparent">StockFlow AI</div>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

