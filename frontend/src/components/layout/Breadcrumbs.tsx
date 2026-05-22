import { routeLabelMap } from "@/components/layout/navigation";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ path: "/", label: "Dashboard" }];

  parts.forEach((part, index) => {
    const path = `/${parts.slice(0, index + 1).join("/")}`;
    crumbs.push({ path, label: routeLabelMap[path] ?? part });
  });

  return (
    <nav className="flex items-center gap-1 text-xs text-slate-400">
      {crumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3 w-3" />}
          {index === crumbs.length - 1 ? (
            <span className="text-slate-200">{crumb.label}</span>
          ) : (
            <Link className="hover:text-slate-100" to={crumb.path}>
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
