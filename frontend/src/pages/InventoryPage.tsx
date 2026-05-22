import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";
import { inventoryItems, stockMovement, type InventoryItem } from "@/data/platformData";
import { useToastStore } from "@/store/toast";
import { AlertTriangle, ArrowLeftRight, Boxes, Pencil, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const pageSize = 5;

export default function InventoryPage() {
  const loading = useSimulatedLoading();
  const toast = useToastStore((s) => s.push);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [warehouse, setWarehouse] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [editQty, setEditQty] = useState(0);

  const categories = useMemo(() => ["All", ...new Set(inventoryItems.map((item) => item.category))], []);
  const warehouses = useMemo(() => ["All", ...new Set(inventoryItems.map((item) => item.warehouse))], []);

  const filtered = useMemo(
    () =>
      inventoryItems.filter((item) => {
        const bySearch = `${item.name} ${item.sku} ${item.barcode}`.toLowerCase().includes(search.toLowerCase());
        const byCategory = category === "All" || item.category === category;
        const byWarehouse = warehouse === "All" || item.warehouse === warehouse;
        return bySearch && byCategory && byWarehouse;
      }),
    [search, category, warehouse]
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const lowStockCount = inventoryItems.filter((item) => item.quantity <= item.reorderPoint).length;
  const stockValue = inventoryItems.reduce((acc, item) => acc + item.value, 0);

  const openEdit = (item: InventoryItem) => {
    setSelected(item);
    setEditQty(item.quantity);
  };

  const submitQuickEdit = () => {
    if (!selected) return;
    toast({ title: "Inventory updated", description: `${selected.name} quantity set to ${editQty}.`, variant: "success" });
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Inventory Intelligence" subtitle="Track stock, movement velocity, and replenishment risks in real time." />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Active SKUs" value={`${inventoryItems.length}`} change="+12 this week" icon={Boxes} />
          <StatCard label="Low Stock Risk" value={`${lowStockCount}`} change="-3 from yesterday" icon={AlertTriangle} />
          <StatCard label="Inventory Value" value={`$${stockValue.toLocaleString()}`} change="+4.2% MoM" icon={ArrowLeftRight} />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input className="pl-9" placeholder="Search by product, SKU, barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
            <Select value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
              {warehouses.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
          </div>
          {paginated.length === 0 ? (
            <EmptyState icon={Search} title="No inventory matches current filters" description="Try broadening categories or warehouse scope to see stock records." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2">Item</th>
                    <th className="pb-2">SKU / Barcode</th>
                    <th className="pb-2">Warehouse</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item) => {
                    const low = item.quantity <= item.reorderPoint;
                    return (
                      <tr key={item.id} className="border-t border-white/10">
                        <td className="py-3">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </td>
                        <td className="py-3 text-xs">
                          <p>{item.sku}</p>
                          <p className="text-slate-400">{item.barcode}</p>
                        </td>
                        <td className="py-3">{item.warehouse}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-1 text-xs ${low ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>{low ? "Low stock" : "Healthy"}</span>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => openEdit(item)}>
                            <Pencil className="mr-1 h-3 w-3" />
                            Quick edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <p>
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="text-sm font-semibold">Recent Stock Changes</p>
            <div className="mt-3 space-y-2 text-sm">
              {inventoryItems.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-xl bg-white/5 p-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    {item.lastMovement} • {item.warehouse}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-sm font-semibold">Movement History</p>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              <p>Inbound shipment +320 units (Berlin Hub)</p>
              <p>Cross-dock transfer 54 units (Prague → Milan)</p>
              <p>Outbound dispatch 210 units (Warsaw Dock)</p>
              <p>Emergency restock order generated for SCM-1930</p>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold">Animated Stock Movement</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockMovement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="inbound" fill="#2D8CFF" radius={[8, 8, 0, 0]} animationDuration={950} />
              <Bar dataKey="outbound" fill="#8A4DFF" radius={[8, 8, 0, 0]} animationDuration={950} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Dialog open={Boolean(selected)} title="Quick Edit Quantity" onClose={() => setSelected(null)}>
        <div className="space-y-3">
          <p className="text-sm text-slate-300">{selected?.name}</p>
          <Input type="number" min={0} value={editQty} onChange={(e) => setEditQty(Number(e.target.value))} />
          <Button className="w-full" onClick={submitQuickEdit}>
            Save change
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
