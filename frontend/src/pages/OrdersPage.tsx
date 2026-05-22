import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { Plus, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type OrderLine = { productId: string; productName: string; quantity: number; unitPrice: number };
type Order = {
  id: string;
  type: "PURCHASE" | "CUSTOMER";
  orderNumber: string;
  partnerName: string;
  status: string;
  totalAmount: number;
  warehouseId?: string;
  warehouseName?: string;
  items: OrderLine[];
};

type Warehouse = { id: string; name: string };
type Product = { id: string; name: string; price: number; cost: number };
type Supplier = { id: string; name: string };

const initialCreate = { type: "CUSTOMER", partnerName: "", supplierId: "", warehouseId: "", status: "CREATED", items: [{ productId: "", quantity: 1, unitPrice: 0 }] };

export default function OrdersPage() {
  const toast = useToastStore((s) => s.push);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<Order | null>(null);
  const [create, setCreate] = useState(initialCreate);

  const load = async () => {
    try {
      const [{ data: orderData }, { data: wh }, { data: prod }, { data: sup }] = await Promise.all([
        api.get("/orders", { params: { type: type || undefined, status: status || undefined, q: q || undefined } }),
        api.get("/warehouses"),
        api.get("/products", { params: { page: 0, size: 200 } }),
        api.get("/suppliers")
      ]);
      setOrders(orderData || []);
      setWarehouses(wh || []);
      setProducts((prod.content || []).map((item: any) => ({ id: item.id, name: item.name, price: item.price, cost: item.cost })));
      setSuppliers((sup || []).map((item: any) => ({ id: item.id, name: item.name })));
    } catch {
      toast({ title: "Failed to load orders module", variant: "danger" });
    }
  };

  useEffect(() => {
    void load();
  }, [type, status, q]);

  const revenue = useMemo(() => orders.filter((item) => item.type === "CUSTOMER").reduce((sum, item) => sum + Number(item.totalAmount || 0), 0), [orders]);

  const createOrder = async () => {
    if (!create.warehouseId || !create.items[0].productId) {
      toast({ title: "Warehouse and product are required", variant: "warning" });
      return;
    }
    try {
      await api.post("/orders", {
        ...create,
        supplierId: create.supplierId || null,
        warehouseId: create.warehouseId || null,
        items: create.items.map((line) => ({ productId: line.productId, quantity: Number(line.quantity), unitPrice: Number(line.unitPrice) }))
      });
      toast({ title: "Order created", variant: "success" });
      setOpen(false);
      setCreate(initialCreate);
      await load();
    } catch (error: any) {
      toast({ title: error.response?.data?.error ?? "Create failed", variant: "danger" });
    }
  };

  const updateStatus = async (order: Order, nextStatus: string) => {
    try {
      await api.patch(`/orders/${order.type}/${order.id}/status`, { status: nextStatus });
      toast({ title: "Order status updated", variant: "success" });
      await load();
    } catch (error: any) {
      toast({ title: error.response?.data?.error ?? "Status update failed", variant: "danger" });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Order Orchestration Center" subtitle="Customer and purchase orders with real inventory impact and status flow.">
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Create order
        </Button>
      </PageHeader>
      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search order or partner..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="CUSTOMER">Customer orders</option>
            <option value="PURCHASE">Purchase orders</option>
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="CREATED">Created</option>
            <option value="PICKING">Picking</option>
            <option value="IN_TRANSIT">In transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </div>
      </Card>

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No orders yet" description="Create first order to activate order timeline and revenue analytics." />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
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
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-white/10">
                        <td className="py-3 font-medium">{order.orderNumber}</td>
                        <td className="py-3">{order.type}</td>
                        <td className="py-3">{order.partnerName}</td>
                        <td className="py-3">{order.warehouseName || "-"}</td>
                        <td className="py-3">${Number(order.totalAmount).toLocaleString()}</td>
                        <td className="py-3">{order.status}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => setDetails(order)}>
                              View
                            </Button>
                            <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => void updateStatus(order, "COMPLETED")}>
                              Complete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <p className="text-sm font-semibold">Revenue Impact</p>
              <p className="mt-2 text-2xl font-semibold">${revenue.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Based on customer orders</p>
              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <p className="rounded-xl bg-white/5 p-3">Inventory updates apply when order status moves to COMPLETED.</p>
                <p className="rounded-xl bg-white/5 p-3">Customer order completion deducts stock.</p>
                <p className="rounded-xl bg-white/5 p-3">Purchase order completion increments stock.</p>
              </div>
            </Card>
          </div>
          <Card>
            <p className="mb-3 text-sm font-semibold">Order Timeline</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orders.map((item) => ({ order: item.orderNumber, amount: Number(item.totalAmount || 0) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                  <XAxis dataKey="order" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8A4DFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Create Order">
        <div className="space-y-3">
          <Select value={create.type} onChange={(e) => setCreate((prev) => ({ ...prev, type: e.target.value }))}>
            <option value="CUSTOMER">Customer order</option>
            <option value="PURCHASE">Purchase order</option>
          </Select>
          <Input
            placeholder={create.type === "CUSTOMER" ? "Customer name" : "Partner name"}
            value={create.partnerName}
            onChange={(e) => setCreate((prev) => ({ ...prev, partnerName: e.target.value }))}
          />
          {create.type === "PURCHASE" && (
            <Select value={create.supplierId} onChange={(e) => setCreate((prev) => ({ ...prev, supplierId: e.target.value }))}>
              <option value="">Select supplier</option>
              {suppliers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          )}
          <Select value={create.warehouseId} onChange={(e) => setCreate((prev) => ({ ...prev, warehouseId: e.target.value }))}>
            <option value="">Select warehouse</option>
            {warehouses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select
            value={create.items[0].productId}
            onChange={(e) => {
              const product = products.find((item) => item.id === e.target.value);
              setCreate((prev) => ({
                ...prev,
                items: [{ ...prev.items[0], productId: e.target.value, unitPrice: create.type === "CUSTOMER" ? Number(product?.price || 0) : Number(product?.cost || 0) }]
              }));
            }}
          >
            <option value="">Select product</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Quantity"
              value={create.items[0].quantity}
              onChange={(e) => setCreate((prev) => ({ ...prev, items: [{ ...prev.items[0], quantity: Number(e.target.value) }] }))}
            />
            <Input
              type="number"
              placeholder="Unit price"
              value={create.items[0].unitPrice}
              onChange={(e) => setCreate((prev) => ({ ...prev, items: [{ ...prev.items[0], unitPrice: Number(e.target.value) }] }))}
            />
          </div>
          <Button className="w-full" onClick={() => void createOrder()}>
            Create order
          </Button>
        </div>
      </Dialog>

      <Dialog open={Boolean(details)} onClose={() => setDetails(null)} title="Order Details">
        <div className="space-y-2 text-sm">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="font-medium">{details?.orderNumber}</p>
            <p className="text-xs text-slate-400">
              {details?.type} • {details?.status}
            </p>
          </div>
          {(details?.items || []).map((line) => (
            <div key={line.productId} className="rounded-xl bg-white/5 p-3 text-xs">
              {line.productName} • {line.quantity} x ${line.unitPrice}
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
