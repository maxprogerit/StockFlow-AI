import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart, Line } from "recharts";
import { useEffect, useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";

type Analytics = {
  revenue: number;
  profitMargin: number;
  inventoryTurnover: number;
  stockValue: number;
  orderVolume: number;
  warehouseEfficiency: number;
  suppliersCount: number;
  topProducts: { name: string; units: number }[];
  trend: { month: string; revenue: number }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    api.get("/analytics").then((r) => setData(r.data)).catch(() => setData(null));
  }, []);

  if (!data) {
    return <EmptyState icon={ChartNoAxesCombined} title="Analytics unavailable" description="Create products, inventory, and orders to generate analytics metrics." />;
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Advanced Analytics" subtitle="Revenue, margin, turnover, top products, and operational efficiency from live data." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-400">Revenue</p>
          <p className="mt-2 text-2xl font-semibold">${Number(data.revenue).toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Profit Margin</p>
          <p className="mt-2 text-2xl font-semibold">{Number(data.profitMargin).toFixed(2)}%</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Inventory Turnover</p>
          <p className="mt-2 text-2xl font-semibold">{Number(data.inventoryTurnover).toFixed(2)}x</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Stock Value</p>
          <p className="mt-2 text-2xl font-semibold">${Number(data.stockValue).toLocaleString()}</p>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Revenue Trend</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line dataKey="revenue" stroke="#2D8CFF" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="mb-3 text-sm font-semibold">Operational KPIs</p>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">Order volume: {data.orderVolume}</p>
            <p className="rounded-xl bg-white/5 p-3">Warehouse efficiency: {data.warehouseEfficiency}%</p>
            <p className="rounded-xl bg-white/5 p-3">Suppliers tracked: {data.suppliersCount}</p>
          </div>
        </Card>
      </div>
      <Card>
        <p className="mb-3 text-sm font-semibold">Best Selling Products</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="units" fill="#8A4DFF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
