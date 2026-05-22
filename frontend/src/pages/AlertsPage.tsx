import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { BellRing } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Alert = { id: string; type: string; severity: string; message: string; read: boolean; resolved: boolean };

export default function AlertsPage() {
  const toast = useToastStore((s) => s.push);
  const [items, setItems] = useState<Alert[]>([]);
  const [severity, setSeverity] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/alerts");
      setItems(data || []);
    } catch {
      toast({ title: "Failed to load alerts", variant: "danger" });
    }
  };

  useEffect(() => {
    void load();

    const base = String(api.defaults.baseURL || "").replace("/api", "");
    const wsUrl = base.replace(/^http/, "ws") + "/ws";
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send("CONNECT\naccept-version:1.2\nheart-beat:10000,10000\n\n\0");
      socket.send("SUBSCRIBE\nid:alerts-sub\ndestination:/topic/alerts\n\n\0");
    };

    socket.onmessage = (event) => {
      if (!event.data.includes("MESSAGE")) return;
      const body = event.data.split("\n\n")[1]?.replace("\0", "");
      if (!body) return;
      try {
        const payload = JSON.parse(body);
        setItems((prev) => [payload, ...prev]);
      } catch {}
    };

    return () => socket.close();
  }, []);

  const filtered = useMemo(() => items.filter((item) => !severity || item.severity === severity), [items, severity]);

  const read = async (id: string, value: boolean) => {
    try {
      await api.patch(`/alerts/${id}/read`, { read: value });
      await load();
    } catch {
      toast({ title: "Failed to update alert", variant: "danger" });
    }
  };

  const resolve = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/resolve`);
      await load();
    } catch {
      toast({ title: "Failed to resolve alert", variant: "danger" });
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/alerts/${id}`);
      await load();
    } catch {
      toast({ title: "Failed to delete alert", variant: "danger" });
    }
  };

  const readAll = async () => {
    try {
      await api.patch("/alerts/read-all");
      await load();
    } catch {
      toast({ title: "Failed to mark alerts", variant: "danger" });
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Real-time Alert Center" subtitle="Business-rule alerts with read, resolve, and delete actions.">
        <div className="flex gap-2">
          <Select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-36">
            <option value="">All severity</option>
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
            <option>CRITICAL</option>
          </Select>
          <Button variant="outline" onClick={() => void readAll()}>
            Mark all as read
          </Button>
        </div>
      </PageHeader>

      {filtered.length === 0 ? (
        <EmptyState icon={BellRing} title="No alerts yet" description="Alerts will appear automatically from low stock, forecast, and order signals." />
      ) : (
        <Card>
          <div className="space-y-3">
            {filtered.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {alert.type} • {alert.severity}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => void read(alert.id, !alert.read)}>
                      {alert.read ? "Unread" : "Read"}
                    </Button>
                    <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => void resolve(alert.id)}>
                      Resolve
                    </Button>
                    <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => void remove(alert.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-300">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
