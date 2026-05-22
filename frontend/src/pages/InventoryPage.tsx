import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { ArrowLeftRight, Boxes, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type InventoryItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  category?: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number;
  reorderLevel: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
};

type Warehouse = { id: string; name: string };
type Product = { id: string; name: string };
type Movement = { id: string; type: string; quantity: number; productName: string; warehouseName: string; occurredAt: string };

const inventoryForm = { productId: "", warehouseId: "", quantity: 0, reserved: 0, batchNumber: "" };

export default function InventoryPage() {
  const toast = useToastStore((s) => s.push);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [query, setQuery] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [newQty, setNewQty] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(inventoryForm);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transfer, setTransfer] = useState({ productId: "", fromWarehouseId: "", toWarehouseId: "", quantity: 0 });

  const load = async () => {
    try {
      const [{ data: inventory }, { data: wh }, { data: prod }, { data: mv }] = await Promise.all([
        api.get("/inventory", { params: { q: query, warehouseId: warehouseId || undefined, productId: productId || undefined, page, size: 10 } }),
        api.get("/warehouses"),
        api.get("/products", { params: { page: 0, size: 200 } }),
        api.get("/inventory/movements")
      ]);
      setItems(inventory.content || []);
      setTotalPages(Math.max(1, inventory.totalPages || 1));
      setWarehouses(wh || []);
      setProducts((prod.content || []).map((item: any) => ({ id: item.id, name: item.name })));
      setMovements(mv || []);
    } catch {
      toast({ title: "Failed to load inventory module", variant: "danger" });
    }
  };

  useEffect(() => {
    void load();
  }, [query, warehouseId, productId, page]);

  const lowStock = useMemo(() => items.filter((item) => item.status !== "IN_STOCK").length, [items]);

  const adjustQuantity = async () => {
    if (!selected) return;
    try {
      await api.patch(`/inventory/${selected.id}/quantity`, { quantity: newQty });
      toast({ title: "Quantity updated", variant: "success" });
      setAdjustOpen(false);
      await load();
    } catch {
      toast({ title: "Failed to update quantity", variant: "danger" });
    }
  };

  const createRecord = async () => {
    if (!createForm.productId || !createForm.warehouseId) {
      toast({ title: "Product and warehouse are required", variant: "warning" });
      return;
    }
    try {
      await api.post("/inventory", createForm);
      toast({ title: "Inventory record created", variant: "success" });
      setCreateOpen(false);
      setCreateForm(inventoryForm);
      await load();
    } catch {
      toast({ title: "Failed to create inventory record", variant: "danger" });
    }
  };

  const doTransfer = async () => {
    if (!transfer.productId || !transfer.fromWarehouseId || !transfer.toWarehouseId) {
      toast({ title: "Product and both warehouses are required", variant: "warning" });
      return;
    }
    try {
      await api.post("/inventory/transfer", transfer);
      toast({ title: "Stock transferred", variant: "success" });
      setTransferOpen(false);
      await load();
    } catch (error: any) {
      toast({ title: error.response?.data?.error ?? "Transfer failed", variant: "danger" });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Inventory Intelligence" subtitle="Live inventory records, quantity controls, transfer workflows, and movement history.">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            Create inventory
          </Button>
          <Button className="gap-2" onClick={() => setTransferOpen(true)}>
            <ArrowLeftRight className="h-4 w-4" />
            Transfer stock
          </Button>
        </div>
      </PageHeader>
      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search SKU, name, barcode..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
            <option value="">All warehouses</option>
            {warehouses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">All products</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState icon={Boxes} title="No inventory records yet" description="Add inventory once products and warehouses are created." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <p className="mb-3 text-sm font-semibold">
              Inventory Table • Low stock: <span className="text-amber-300">{lowStock}</span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2">Product</th>
                    <th className="pb-2">SKU / Barcode</th>
                    <th className="pb-2">Warehouse</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-white/10">
                      <td className="py-3">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-slate-400">{item.category || "Uncategorized"}</p>
                      </td>
                      <td className="py-3 text-xs">
                        <p>{item.sku}</p>
                        <p className="text-slate-400">{item.barcode}</p>
                      </td>
                      <td className="py-3">{item.warehouseName}</td>
                      <td className="py-3">{item.quantity}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-xs ${item.status === "OUT_OF_STOCK" ? "bg-red-500/20 text-red-300" : item.status === "LOW_STOCK" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>{item.status.replaceAll("_", " ")}</span>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => {
                            setSelected(item);
                            setNewQty(item.quantity);
                            setAdjustOpen(true);
                          }}
                        >
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))}>
                Prev
              </Button>
              <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>
                Next
              </Button>
            </div>
          </Card>
          <Card>
            <p className="mb-3 text-sm font-semibold">Recent Stock Movements</p>
            <div className="space-y-2 text-xs">
              {movements.slice(0, 8).map((item) => (
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
        </div>
      )}

      <Card>
        <p className="mb-3 text-sm font-semibold">Stock by Product</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items.map((item) => ({ name: item.productName, qty: item.quantity }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="qty" fill="#2D8CFF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)} title="Adjust Quantity">
        <div className="space-y-3">
          <p className="text-sm text-slate-300">{selected?.productName}</p>
          <Input type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} />
          <Button className="w-full" onClick={() => void adjustQuantity()}>
            Save
          </Button>
        </div>
      </Dialog>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="Create Inventory Record">
        <div className="space-y-3">
          <Select value={createForm.productId} onChange={(e) => setCreateForm((prev) => ({ ...prev, productId: e.target.value }))}>
            <option value="">Select product</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select value={createForm.warehouseId} onChange={(e) => setCreateForm((prev) => ({ ...prev, warehouseId: e.target.value }))}>
            <option value="">Select warehouse</option>
            {warehouses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Input type="number" placeholder="Quantity" value={createForm.quantity} onChange={(e) => setCreateForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))} />
          <Button className="w-full" onClick={() => void createRecord()}>
            Create
          </Button>
        </div>
      </Dialog>

      <Dialog open={transferOpen} onClose={() => setTransferOpen(false)} title="Transfer Stock">
        <div className="space-y-3">
          <Select value={transfer.productId} onChange={(e) => setTransfer((prev) => ({ ...prev, productId: e.target.value }))}>
            <option value="">Select product</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select value={transfer.fromWarehouseId} onChange={(e) => setTransfer((prev) => ({ ...prev, fromWarehouseId: e.target.value }))}>
            <option value="">From warehouse</option>
            {warehouses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select value={transfer.toWarehouseId} onChange={(e) => setTransfer((prev) => ({ ...prev, toWarehouseId: e.target.value }))}>
            <option value="">To warehouse</option>
            {warehouses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Input type="number" placeholder="Quantity" value={transfer.quantity} onChange={(e) => setTransfer((prev) => ({ ...prev, quantity: Number(e.target.value) }))} />
          <Button className="w-full" onClick={() => void doTransfer()}>
            Transfer
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
