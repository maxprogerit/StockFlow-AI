import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { ToastViewport } from "@/components/ui/toast";
import { useAuthStore } from "@/store/auth";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="p-4 lg:ml-72">
        <MobileNav />
        <header className="glass mb-4 rounded-2xl p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Breadcrumbs />
              <p className="text-xs text-slate-400">Real-time AI inventory intelligence across operations, orders, and warehouses.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs md:block">
                <p className="text-slate-400">Signed in as</p>
                <p className="font-medium text-slate-100">{user?.fullName ?? "Operations Admin"}</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <ToastViewport />
    </div>
  );
}

