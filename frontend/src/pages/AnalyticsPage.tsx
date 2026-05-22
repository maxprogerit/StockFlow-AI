import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyticsKpis, analyticsRevenue, products, warehouses } from "@/data/platformData";
import { Download, Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Advanced Analytics" subtitle="Unified business intelligence across revenue, turnover, and operational efficiency.">
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download analytics report
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analyticsKpis.map((item) => (
          <Card key={item.label}>
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            <p className="mt-1 text-xs text-emerald-300">{item.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Revenue, Turnover & Margin</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analyticsRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" fill="#2D8CFF" />
                <Line yAxisId="right" dataKey="turnover" stroke="#8A4DFF" />
                <Line yAxisId="right" dataKey="margin" stroke="#22c55e" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">AI Insights</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-xl bg-white/5 p-3">Profit margin grew 4.7pp in 3 months.</div>
            <div className="rounded-xl bg-white/5 p-3">Top product cluster contributes 41% of gross profit.</div>
            <div className="rounded-xl bg-white/5 p-3">Warehouse balancing could add +2.1% fill-rate.</div>
          </div>
          <div className="mt-3 rounded-xl border border-neon-purple/30 bg-neon-purple/10 p-3 text-xs">
            <Sparkles className="mb-2 h-4 w-4 text-neon-purple" />
            Forecast confidence remains above 82% across key categories.
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <p className="mb-3 text-sm font-semibold">Top Performing Products</p>
          <div className="space-y-2 text-sm">
            {products
              .slice()
              .sort((a, b) => b.soldThisMonth - a.soldThisMonth)
              .slice(0, 4)
              .map((product) => (
                <div key={product.id} className="rounded-xl bg-white/5 p-3">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-slate-400">Sold: {product.soldThisMonth} • Margin {product.margin}%</p>
                </div>
              ))}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Warehouse Efficiency</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={warehouses.map((item) => ({ name: item.name, value: item.throughput }))} dataKey="value" outerRadius={95} fill="#2D8CFF" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
