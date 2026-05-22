import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { suppliers, supplierPerformanceTrend } from "@/data/platformData";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function SuppliersPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Supplier Performance Hub" subtitle="Monitor supplier reliability, contracts, and procurement outcomes." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-400">Active Suppliers</p>
          <p className="mt-2 text-2xl font-semibold">{suppliers.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Avg Rating</p>
          <p className="mt-2 text-2xl font-semibold">{(suppliers.reduce((a, b) => a + b.rating, 0) / suppliers.length).toFixed(1)}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">On-time Delivery</p>
          <p className="mt-2 text-2xl font-semibold">{Math.round(suppliers.reduce((a, b) => a + b.onTimeRate, 0) / suppliers.length)}%</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Active Contracts</p>
          <p className="mt-2 text-2xl font-semibold">{suppliers.reduce((a, b) => a + b.activeContracts, 0)}</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Delivery Performance Trend</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierPerformanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="quality" fill="#2D8CFF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="delivery" fill="#8A4DFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Active Contracts</p>
          <div className="mt-3 space-y-2 text-sm">
            {suppliers.map((item) => (
              <div key={item.id} className="rounded-xl bg-white/5 p-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-300">{item.activeContracts} active contracts</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold">Supplier Management Table</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="pb-2">Supplier</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Contact</th>
                <th className="pb-2">Rating</th>
                <th className="pb-2">On-time</th>
                <th className="pb-2">Reliability</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="py-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.id}</p>
                  </td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3">{item.contact}</td>
                  <td className="py-3">{item.rating.toFixed(1)}</td>
                  <td className="py-3">{item.onTimeRate}%</td>
                  <td className="py-3">
                    <Badge variant={item.onTimeRate > 92 ? "success" : item.onTimeRate > 88 ? "warning" : "danger"}>
                      {item.onTimeRate > 92 ? "Excellent" : item.onTimeRate > 88 ? "Stable" : "At Risk"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
