import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { alerts } from "@/data/platformData";
import { useToastStore } from "@/store/toast";
import { BellRing, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function AlertsPage() {
  const pushToast = useToastStore((s) => s.push);
  const [severity, setSeverity] = useState("All");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      alerts.filter((item) => {
        const bySeverity = severity === "All" || item.severity === severity;
        const byCategory = category === "All" || item.category === category;
        const byQuery = item.title.toLowerCase().includes(query.toLowerCase());
        return bySeverity && byCategory && byQuery;
      }),
    [severity, category, query]
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Real-time Alert Center" subtitle="Smart notifications for low stock, expiry, warehouse incidents, and delays.">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => pushToast({ title: "Notification settings synced", description: "Alert thresholds and channels were updated.", variant: "success" })}
        >
          <Settings2 className="h-4 w-4" />
          Notification settings
        </Button>
      </PageHeader>
      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search alerts..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            {["All", "Low", "Medium", "High", "Critical"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {["All", "Low Stock", "Expiry", "Warehouse Issue", "Delay"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Button>Apply filters</Button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Smart Alert Cards</p>
          <div className="space-y-3">
            {filtered.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-neon-blue/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{alert.title}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      alert.severity === "Critical"
                        ? "bg-red-500/20 text-red-300"
                        : alert.severity === "High"
                          ? "bg-amber-500/20 text-amber-300"
                          : alert.severity === "Medium"
                            ? "bg-sky-500/20 text-sky-300"
                            : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {alert.category} • {alert.timestamp}
                </p>
                <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm">{alert.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Notification Timeline</p>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">16:40 - Critical queue delay detected</p>
            <p className="rounded-xl bg-white/5 p-3">16:28 - Shelf-life warning triggered</p>
            <p className="rounded-xl bg-white/5 p-3">16:10 - Reorder threshold crossed</p>
            <p className="rounded-xl bg-white/5 p-3">15:56 - Supplier delay notice received</p>
          </div>
          <div className="mt-4 rounded-xl border border-neon-purple/30 bg-neon-purple/10 p-3 text-xs">
            <BellRing className="mb-1 h-4 w-4 text-neon-purple" />
            AI recommendation: reroute incoming container to Berlin Hub.
          </div>
        </Card>
      </div>
    </div>
  );
}
