import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { Plus, Truck } from "lucide-react";
import { useEffect, useState } from "react";

type Supplier = {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  rating?: number;
  active: boolean;
  productsCount: number;
  purchaseOrdersCount: number;
};

const emptySupplier: Supplier = { id: "", name: "", contactEmail: "", contactPhone: "", address: "", rating: 4, active: true, productsCount: 0, purchaseOrdersCount: 0 };

export default function SuppliersPage() {
  const toast = useToastStore((s) => s.push);
  const [items, setItems] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Supplier>(emptySupplier);

  const load = async () => {
    try {
      const { data } = await api.get("/suppliers");
      setItems(data || []);
    } catch {
      toast({ title: "Failed to load suppliers", variant: "danger" });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    if (!form.name.trim()) {
      toast({ title: "Supplier name is required", variant: "warning" });
      return;
    }
    try {
      if (form.id) {
        await api.put(`/suppliers/${form.id}`, form);
      } else {
        await api.post("/suppliers", form);
      }
      toast({ title: "Supplier saved", variant: "success" });
      setOpen(false);
      setForm(emptySupplier);
      await load();
    } catch {
      toast({ title: "Failed to save supplier", variant: "danger" });
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/suppliers/${id}`);
      toast({ title: "Supplier deleted", variant: "success" });
      await load();
    } catch {
      toast({ title: "Delete failed", variant: "danger" });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Supplier Performance Hub" subtitle="Real supplier records, contacts, ratings, and procurement history.">
        <Button
          className="gap-2"
          onClick={() => {
            setForm(emptySupplier);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add supplier
        </Button>
      </PageHeader>
      {items.length === 0 ? (
        <EmptyState icon={Truck} title="No suppliers yet" description="Add supplier to link products and purchase orders." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-2">Supplier</th>
                  <th className="pb-2">Contact</th>
                  <th className="pb-2">Rating</th>
                  <th className="pb-2">Products</th>
                  <th className="pb-2">Purchase Orders</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="py-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.address || "-"}</p>
                    </td>
                    <td className="py-3 text-xs">
                      <p>{item.contactEmail || "-"}</p>
                      <p className="text-slate-400">{item.contactPhone || "-"}</p>
                    </td>
                    <td className="py-3">{item.rating?.toFixed(1) ?? "-"}</td>
                    <td className="py-3">{item.productsCount}</td>
                    <td className="py-3">{item.purchaseOrdersCount}</td>
                    <td className="py-3">{item.active ? "Active" : "Inactive"}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => {
                            setForm(item);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => void remove(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title={form.id ? "Edit Supplier" : "Create Supplier"}>
        <div className="space-y-3">
          <Input placeholder="Supplier name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input placeholder="Contact email" value={form.contactEmail || ""} onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))} />
          <Input placeholder="Contact phone" value={form.contactPhone || ""} onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))} />
          <Input placeholder="Address" value={form.address || ""} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
          <Input type="number" step="0.1" placeholder="Rating" value={form.rating || 4} onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))} />
          <Button className="w-full" onClick={() => void save()}>
            Save supplier
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
