import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capacityTrend, warehouses } from "@/data/platformData";
import { Activity, Globe2, Gauge, Warehouse } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function WarehousesPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Warehouse Operations Grid" subtitle="Capacity planning, utilization analytics, and live facility performance." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active Sites" value={`${warehouses.length}`} change="4 geo-distributed hubs" icon={Warehouse} />
        <StatCard label="Average Capacity" value={`${Math.round(warehouses.reduce((a, b) => a + b.capacityPercent, 0) / warehouses.length)}%`} change="+6% vs last month" icon={Gauge} />
        <StatCard label="Daily Throughput" value={`${warehouses.reduce((a, b) => a + b.throughput, 0).toLocaleString()} units`} change="+8.7% weekly" icon={Activity} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Capacity Usage Trend</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capacityTrend}>
                <defs>
                  <linearGradient id="wh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D8CFF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2D8CFF" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="berlin" stroke="#2D8CFF" fill="url(#wh)" />
                <Area type="monotone" dataKey="prague" stroke="#8A4DFF" fillOpacity={0} />
                <Area type="monotone" dataKey="warsaw" stroke="#22c55e" fillOpacity={0} />
                <Area type="monotone" dataKey="milan" stroke="#f59e0b" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Warehouse Map Visualization</p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 p-4">
            <Globe2 className="mb-2 h-5 w-5 text-neon-blue" />
            <p className="text-sm">EU network routing overview</p>
            <p className="mt-1 text-xs text-slate-300">Berlin ↔ Prague high load corridor</p>
            <p className="text-xs text-slate-300">Warsaw outbound peak in next 8 hours</p>
            <p className="text-xs text-slate-300">Milan underutilized, transfer recommended</p>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            {warehouses.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <span>{item.name}</span>
                <Badge variant={item.status === "Online" ? "success" : item.status === "Congested" ? "warning" : "danger"}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <p className="mb-3 text-sm font-semibold">Inventory Distribution</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={warehouses.map((item) => ({ name: item.name, value: item.throughput }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#2D8CFF"
                  label
                  animationDuration={900}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Warehouse Performance Table</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-2">Warehouse</th>
                  <th className="pb-2">Location</th>
                  <th className="pb-2">Manager</th>
                  <th className="pb-2">Capacity</th>
                  <th className="pb-2">Throughput</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((item) => (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3">{item.location}</td>
                    <td className="py-3">{item.manager}</td>
                    <td className="py-3">{item.capacityPercent}%</td>
                    <td className="py-3">{item.throughput.toLocaleString()}</td>
                    <td className="py-3">
                      <Badge variant={item.status === "Online" ? "success" : item.status === "Congested" ? "warning" : "danger"}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid gap-2 text-xs text-slate-300 md:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-3">Live activity: 34 incoming trucks</div>
            <div className="rounded-xl bg-white/5 p-3">Storage utilization AI optimization: +11%</div>
            <div className="rounded-xl bg-white/5 p-3">Dock cycle average: 28 minutes</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
