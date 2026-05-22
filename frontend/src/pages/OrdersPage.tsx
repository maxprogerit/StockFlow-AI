import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { orderRevenueTrend, orders, type OrderItem } from "@/data/platformData";
import { useToastStore } from "@/store/toast";
import { Activity, CircleDollarSign, Filter, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function OrdersPage() {
  const pushToast = useToastStore((s) => s.push);
  const [kind, setKind] = useState("All");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<OrderItem | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const byType = kind === "All" || order.type === kind;
        const byStatus = status === "All" || order.status === status;
        const byQuery = `${order.id} ${order.partner}`.toLowerCase().includes(query.toLowerCase());
        return byType && byStatus && byQuery;
      }),
    [kind, status, query]
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Order Orchestration Center" subtitle="Track purchase and sales lifecycles with shipment and revenue intelligence." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Open Orders" value={`${orders.length}`} change="+8 today" icon={Activity} />
        <StatCard label="Sales Volume" value={`$${orders.filter((o) => o.type === "Sales").reduce((a, b) => a + b.total, 0).toLocaleString()}`} change="+12.2%" icon={CircleDollarSign} />
        <StatCard label="Shipment SLA" value="96.7%" change="+1.3%" icon={Truck} />
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search order ID or partner..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select value={kind} onChange={(e) => setKind(e.target.value)}>
            {["All", "Sales", "Purchase"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", "Created", "Picking", "In Transit", "Delivered"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Advanced filters
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Revenue Analytics</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderRevenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#2D8CFF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="purchase" fill="#8A4DFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Live Order Activity</p>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">SO-78421 moved to In Transit</p>
            <p className="rounded-xl bg-white/5 p-3">PO-33982 receiving docs validated</p>
            <p className="rounded-xl bg-white/5 p-3">SO-78388 assigned to Milan route</p>
            <p className="rounded-xl bg-white/5 p-3">Carrier ETA recalculated by AI</p>
          </div>
        </Card>
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold">Recent Orders</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="pb-2">Order</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Partner</th>
                <th className="pb-2">Warehouse</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-white/10">
                  <td className="py-3 font-medium">{order.id}</td>
                  <td className="py-3">{order.type}</td>
                  <td className="py-3">{order.partner}</td>
                  <td className="py-3">{order.warehouse}</td>
                  <td className="py-3">${order.total.toLocaleString()}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3 text-right">
                    <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => setSelected(order)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={Boolean(selected)} title="Order Details" onClose={() => setSelected(null)}>
        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="font-medium">{selected?.id}</p>
            <p className="text-xs text-slate-300">{selected?.partner}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/5 p-2">Status: {selected?.status}</div>
            <div className="rounded-lg bg-white/5 p-2">Warehouse: {selected?.warehouse}</div>
            <div className="rounded-lg bg-white/5 p-2">Date: {selected?.date}</div>
            <div className="rounded-lg bg-white/5 p-2">Total: ${selected?.total.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3 text-xs text-slate-300">
            Timeline: Created → Picking → In Transit → Delivered
          </div>
          <Button
            className="w-full"
            onClick={() => {
              pushToast({ title: "Order synced", description: `${selected?.id} status timeline refreshed.` });
              setSelected(null);
            }}
          >
            Sync shipment status
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
