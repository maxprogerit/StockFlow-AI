import { navLinks } from "@/components/layout/navigation";
import { Menu } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current = useMemo(() => navLinks.find((link) => link.to === pathname)?.label ?? "Dashboard", [pathname]);

  return (
    <div className="glass mb-4 rounded-2xl p-3 lg:hidden">
      <div className="flex items-center justify-between">
        <Link to="/" className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-lg font-semibold text-transparent">
          StockFlow AI
        </Link>
        <button className="rounded-lg border border-white/10 p-2" onClick={() => setOpen((prev) => !prev)} type="button">
          <Menu className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-xs text-slate-400">{current}</div>
      {open && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs ${
                  isActive ? "bg-white/15 text-white" : "text-slate-300"
                }`
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
