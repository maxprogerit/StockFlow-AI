import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { EmptyState } from "@/components/common/EmptyState";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Boxes } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type DashboardOverview = {
  totalInventoryValue: number;
  totalProducts: number;
  totalWarehouses: number;
  lowStockItems: number;
  monthlyRevenue: number;
  inventoryValueChart: { month: string; value: number }[];
  categoryDistribution: { name: string; value: number }[];
  warehousePerformance: { name: string; units: number }[];
  recentOrders: { id: string; orderNumber: string; customer: string; status: string; amount: number }[];
  recentMovements: { id: string; type: string; quantity: number; productName: string; warehouseName: string; occurredAt: string }[];
  alerts: { id: string; severity: string; message: string }[];
  aiInsights: string[];
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/overview")
      .then((r) => setOverview(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && overview && overview.totalProducts === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">AI Inventory Command Center</h1>
        <EmptyState icon={Boxes} title="Your workspace is empty" description="Start by setting up your core entities, then your analytics and alerts will populate automatically.">
          <Button asChild>
            <Link to="/products">Add first product</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/warehouses">Create first warehouse</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/suppliers">Add supplier</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/orders">Create first order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/reports">Generate first report</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">AI Inventory Command Center</h1>
        <p className="text-sm text-slate-300">Live warehouse operations, predictive analytics, and revenue intelligence.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Inventory Value", `$${overview?.totalInventoryValue?.toLocaleString() ?? "..."}`],
          ["Monthly Revenue", `$${overview?.monthlyRevenue?.toLocaleString() ?? "..."}`],
          ["Products", overview?.totalProducts ?? "..."],
          ["Warehouses", overview?.totalWarehouses ?? "..."],
          ["Low Stock", overview?.lowStockItems ?? "..."]
        ].map(([label, value]) => (
          <motion.div key={String(label)} whileHover={{ y: -2 }}>
            <Card>
              <div className="text-xs text-slate-300">{label}</div>
              <div className="mt-2 text-2xl font-bold">{value}</div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-4 text-sm text-slate-300">Inventory value trend</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.inventoryValueChart ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#2D8CFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-4 text-sm text-slate-300">Category distribution</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overview?.categoryDistribution ?? []} dataKey="value" nameKey="name" outerRadius={120} fill="#8A4DFF" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 text-sm text-slate-300">Warehouse performance</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.warehousePerformance ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="units" fill="#8A4DFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-300">AI insights</div>
          <div className="mt-4 space-y-3 text-sm">
            {(overview?.aiInsights ?? []).map((insight) => (
              <p key={insight} className="rounded-xl bg-white/5 p-3">
                {insight}
              </p>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <div className="mb-3 text-sm text-slate-300">Recent orders</div>
          <div className="space-y-2 text-xs">
            {(overview?.recentOrders ?? []).slice(0, 5).map((order) => (
              <div key={order.id} className="rounded-xl bg-white/5 p-3">
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-slate-400">
                  {order.customer} • ${order.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-3 text-sm text-slate-300">Recent stock movements</div>
          <div className="space-y-2 text-xs">
            {(overview?.recentMovements ?? []).slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl bg-white/5 p-3">
                <p className="font-medium">
                  {item.type} • {item.quantity}
                </p>
                <p className="text-slate-400">
                  {item.productName} • {item.warehouseName}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
            <AlertTriangle className="h-4 w-4 text-amber-300" /> Stock alerts
          </div>
          <div className="space-y-2 text-xs">
            {(overview?.alerts ?? []).slice(0, 5).map((alert) => (
              <div key={alert.id} className="rounded-xl bg-white/5 p-3">
                <p className="font-medium">{alert.severity}</p>
                <p className="text-slate-400">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

