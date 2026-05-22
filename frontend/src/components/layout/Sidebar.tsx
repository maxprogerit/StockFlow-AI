import { NavLink } from "react-router-dom";
import { navLinks } from "./navigation";

export function Sidebar() {
  return (
    <aside className="glass fixed left-4 top-4 hidden h-[calc(100vh-2rem)] w-64 rounded-2xl p-4 lg:block">
      <div className="mb-8">
        <p className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-2xl font-bold text-transparent">StockFlow AI</p>
        <p className="mt-1 text-xs text-slate-400">Enterprise Intelligence OS</p>
      </div>
      <nav className="space-y-1.5">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                isActive
                  ? "bg-gradient-to-r from-neon-blue/25 to-neon-purple/25 text-white shadow-lg shadow-neon-blue/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4 transition group-hover:scale-110" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

