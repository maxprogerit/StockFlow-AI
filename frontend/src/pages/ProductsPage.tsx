import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { products, productPerformance, type ProductItem } from "@/data/platformData";
import { useToastStore } from "@/store/toast";
import { Grid2X2, List, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ViewType = "grid" | "table";

export default function ProductsPage() {
  const pushToast = useToastStore((s) => s.push);
  const [view, setView] = useState<ViewType>("grid");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<ProductItem | null>(null);
  const [price, setPrice] = useState(0);

  const categories = useMemo(() => ["All", ...new Set(products.map((item) => item.category))], []);
  const filtered = useMemo(
    () =>
      products.filter((item) => {
        const byQuery = item.name.toLowerCase().includes(query.toLowerCase());
        const byCategory = category === "All" || item.category === category;
        return byQuery && byCategory;
      }),
    [query, category]
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Product Intelligence" subtitle="Manage catalog performance, stock levels, and pricing insights.">
        <div className="flex gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")} className="gap-2">
            <Grid2X2 className="h-4 w-4" /> Grid
          </Button>
          <Button variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")} className="gap-2">
            <List className="h-4 w-4" /> Table
          </Button>
        </div>
      </PageHeader>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
          <Button variant="outline">Advanced filters</Button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Product Performance</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415544" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#2D8CFF" fill="#2D8CFF22" />
                <Area type="monotone" dataKey="profit" stroke="#8A4DFF" fill="#8A4DFF22" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Pricing Insights</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-xl bg-white/5 p-3">High margin segment: Tracking (+44%)</div>
            <div className="rounded-xl bg-white/5 p-3">Best seller: Quantum Pallet Sensor</div>
            <div className="rounded-xl bg-white/5 p-3">Reprice suggestion: ArcFlow Conveyor Unit +2.8%</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <p className="mb-3 text-sm font-semibold">Categories</p>
          <div className="space-y-2 text-sm">
            {categories.filter((item) => item !== "All").map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <span>{item}</span>
                <span className="text-xs text-slate-400">{products.filter((product) => product.category === item).length}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Best Selling Products</p>
          <div className="grid gap-2 md:grid-cols-3">
            {products
              .slice()
              .sort((a, b) => b.soldThisMonth - a.soldThisMonth)
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="rounded-xl bg-white/5 p-3 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-400">Sold {item.soldThisMonth} this month</p>
                  <p className="mt-1 text-xs text-emerald-300">{item.stock} units available</p>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No products match the current filters" description="Try changing category or search text to view catalog items." />
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} className="group transition hover:border-neon-purple/30">
              <img src={item.image} alt={item.name} className="h-36 w-full rounded-xl object-cover" />
              <div className="mt-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-400">{item.category}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-white/5 p-2">${item.price}</div>
                  <div className="rounded-lg bg-white/5 p-2">{item.margin}% margin</div>
                  <div className="rounded-lg bg-white/5 p-2">{item.stock} in stock</div>
                </div>
                <Button variant="outline" className="mt-3 w-full" onClick={() => (setSelected(item), setPrice(item.price))}>
                  Edit product
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Margin</th>
                  <th className="pb-2">Stock</th>
                  <th className="pb-2">Sales</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3">{item.category}</td>
                    <td className="py-3">${item.price}</td>
                    <td className="py-3">{item.margin}%</td>
                    <td className="py-3">{item.stock}</td>
                    <td className="py-3">{item.soldThisMonth}</td>
                    <td className="py-3 text-right">
                      <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => (setSelected(item), setPrice(item.price))}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={Boolean(selected)} title="Edit Product" onClose={() => setSelected(null)}>
        <div className="space-y-3">
          <p className="text-sm text-slate-300">{selected?.name}</p>
          <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          <Button
            className="w-full"
            onClick={() => {
              pushToast({ title: "Product updated", description: `${selected?.name} price changed to $${price}.`, variant: "success" });
              setSelected(null);
            }}
          >
            Save product
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
