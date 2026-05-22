import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { Plus, Warehouse as WarehouseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Warehouse = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  active: boolean;
  stockUnits: number;
  inventoryValue: number;
  capacityUsagePercent: number;
};

const emptyWarehouse = { id: "", name: "", location: "", capacity: 1000, active: true, stockUnits: 0, inventoryValue: 0, capacityUsagePercent: 0 };

export default function WarehousesPage() {
  const toast = useToastStore((s) => s.push);
  const [items, setItems] = useState<Warehouse[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Warehouse>(emptyWarehouse);

  const load = async () => {
    try {
      const { data } = await api.get("/warehouses");
      setItems(data);
    } catch {
      toast({ title: "Failed to load warehouses", variant: "danger" });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    if (!form.name.trim()) {
      toast({ title: "Warehouse name is required", variant: "warning" });
      return;
    }
    try {
      if (form.id) {
        await api.put(`/warehouses/${form.id}`, form);
      } else {
        await api.post("/warehouses", form);
      }
      setOpen(false);
      setForm(emptyWarehouse);
      toast({ title: "Warehouse saved", variant: "success" });
      await load();
    } catch (error: any) {
      toast({ title: error.response?.data?.error ?? "Save failed", variant: "danger" });
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/warehouses/${id}`);
      toast({ title: "Warehouse deleted", variant: "success" });
      await load();
    } catch (error: any) {
      toast({ title: error.response?.data?.error ?? "Delete failed", variant: "danger" });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Warehouse Operations Grid" subtitle="Create, manage, and monitor warehouse capacity and value.">
        <Button
          className="gap-2"
          onClick={() => {
            setForm(emptyWarehouse);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Create warehouse
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState icon={WarehouseIcon} title="No warehouses yet" description="Create first warehouse to start receiving and distributing inventory." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <Card key={item.id}>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-slate-400">{item.location}</p>
                <div className="mt-2 text-xs text-slate-300">
                  <p>Capacity usage: {item.capacityUsagePercent}%</p>
                  <p>Units: {item.stockUnits}</p>
                  <p>Value: ${Number(item.inventoryValue).toLocaleString()}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setForm(item);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => void remove(item.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Card>
            <p className="mb-3 text-sm font-semibold">Capacity Usage</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={items}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="capacityUsagePercent" fill="#2D8CFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title={form.id ? "Edit Warehouse" : "Create Warehouse"}>
        <div className="space-y-3">
          <Input placeholder="Warehouse name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
          <Input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm((prev) => ({ ...prev, capacity: Number(e.target.value) }))} />
          <Button className="w-full" onClick={() => void save()}>
            Save warehouse
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
