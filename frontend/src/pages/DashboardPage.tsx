import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Metrics = { totalProducts: number; totalWarehouses: number; lowStockItems: number; totalRevenue: number };

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  useEffect(() => {
    api.get("/dashboard/metrics").then((r) => setMetrics(r.data)).catch(() => undefined);
  }, []);

  const trend = useMemo(
    () => [
      { month: "Jan", value: 11000 },
      { month: "Feb", value: 13500 },
      { month: "Mar", value: 12200 },
      { month: "Apr", value: 16800 },
      { month: "May", value: 19000 },
      { month: "Jun", value: 22100 }
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">AI Inventory Command Center</h1>
        <p className="text-sm text-slate-300">Live warehouse operations, predictive analytics, and revenue intelligence.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Revenue", `$${metrics?.totalRevenue?.toLocaleString() ?? "..."}`],
          ["Products", metrics?.totalProducts ?? "..."],
          ["Warehouses", metrics?.totalWarehouses ?? "..."],
          ["Low Stock", metrics?.lowStockItems ?? "..."]
        ].map(([label, value]) => (
          <motion.div key={String(label)} whileHover={{ y: -2 }}>
            <Card>
              <div className="text-xs text-slate-300">{label}</div>
              <div className="mt-2 text-2xl font-bold">{value}</div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 text-sm text-slate-300">Revenue overview</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D8CFF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8A4DFF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2D8CFF" fillOpacity={1} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-300">AI insights</div>
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-xl bg-white/5 p-3">Demand likely to increase 14% next month for electronics category.</p>
            <p className="rounded-xl bg-white/5 p-3">Warehouse East is approaching 87% capacity. Balance transfers recommended.</p>
            <p className="rounded-xl bg-white/5 p-3">Top margin SKU: SF-ULTRA-12 with stable procurement costs.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

