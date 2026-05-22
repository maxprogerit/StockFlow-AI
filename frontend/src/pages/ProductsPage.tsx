import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { Plus, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  cost: number;
  lowStockThreshold: number;
  barcode: string;
  categoryId?: string;
  supplierId?: string;
};

type ProductAnalytics = { stock: number; salesUnits: number; grossRevenue: number; stockByWarehouse: { warehouse: string; quantity: number }[] };

const emptyProduct: Product = {
  id: "",
  sku: "",
  name: "",
  description: "",
  imageUrl: "",
  price: 0,
  cost: 0,
  lowStockThreshold: 10,
  barcode: "",
  categoryId: undefined,
  supplierId: undefined
};

export default function ProductsPage() {
  const toast = useToastStore((s) => s.push);
  const [items, setItems] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Product>(emptyProduct);
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { q: query, page, size: 9 } });
      setItems(data.content);
      setTotalPages(Math.max(1, data.totalPages || 1));
    } catch {
      toast({ title: "Failed to load products", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [query, page]);

  const save = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "warning" });
      return;
    }
    try {
      if (form.id) {
        await api.put(`/products/${form.id}`, form);
      } else {
        await api.post("/products", form);
      }
      setOpen(false);
      setForm(emptyProduct);
      toast({ title: "Product saved", variant: "success" });
      await load();
    } catch {
      toast({ title: "Failed to save product", variant: "danger" });
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast({ title: "Product deleted", variant: "success" });
      await load();
    } catch {
      toast({ title: "Delete failed", variant: "danger" });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Product Intelligence" subtitle="Connected product catalog with pricing, stock policy, and supplier linkage.">
        <Button
          className="gap-2"
          onClick={() => {
            setForm(emptyProduct);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </PageHeader>
      <Card>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search by name, SKU, barcode..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </Card>

      {!loading && items.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No products yet" description="Add first product to start inventory tracking and analytics." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="h-36 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-2">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full rounded-lg object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-300">No image</div>}
              </div>
              <div className="mt-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-400">
                  {item.sku} • {item.barcode}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-white/5 p-2">${item.price}</div>
                  <div className="rounded-lg bg-white/5 p-2">${item.cost} cost</div>
                  <div className="rounded-lg bg-white/5 p-2">ROP {item.lowStockThreshold}</div>
                </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setForm(item);
                    setOpen(true);
                    api.get(`/products/${item.id}/analytics`).then((r) => setAnalytics(r.data)).catch(() => setAnalytics(null));
                  }}
                >
                  Edit
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => void remove(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))}>
          Prev
        </Button>
        <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>
          Next
        </Button>
      </div>

      {analytics && (
        <Card>
          <p className="mb-2 text-sm font-semibold">Product Performance Analytics</p>
          <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-3">
            <p className="rounded-xl bg-white/5 p-3">Stock: {analytics.stock}</p>
            <p className="rounded-xl bg-white/5 p-3">Sales units: {analytics.salesUnits}</p>
            <p className="rounded-xl bg-white/5 p-3">Gross revenue: ${Number(analytics.grossRevenue).toLocaleString()}</p>
          </div>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {analytics.stockByWarehouse.map((item) => (
              <p key={item.warehouse} className="rounded-xl bg-white/5 p-3 text-xs text-slate-300">
                {item.warehouse}: {item.quantity}
              </p>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title={form.id ? "Edit Product" : "Create Product"}>
        <div className="space-y-3">
          <Input placeholder="Product name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input placeholder="SKU (optional)" value={form.sku} onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))} />
          <Input placeholder="Barcode (optional)" value={form.barcode} onChange={(e) => setForm((prev) => ({ ...prev, barcode: e.target.value }))} />
          <Input placeholder="Image URL" value={form.imageUrl || ""} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />
          <div className="grid grid-cols-3 gap-2">
            <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))} />
            <Input type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm((prev) => ({ ...prev, cost: Number(e.target.value) }))} />
            <Input type="number" placeholder="Reorder level" value={form.lowStockThreshold} onChange={(e) => setForm((prev) => ({ ...prev, lowStockThreshold: Number(e.target.value) }))} />
          </div>
          <Select value={form.description || ""} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}>
            <option value="">Description preset</option>
            <option value="Smart inventory hardware">Smart inventory hardware</option>
            <option value="Packaging consumables">Packaging consumables</option>
            <option value="Automation component">Automation component</option>
          </Select>
          <Button className="w-full" onClick={() => void save()}>
            Save Product
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
