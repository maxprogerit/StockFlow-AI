import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { useEffect, useState } from "react";

type Settings = {
  companyName: string;
  companyWebsite?: string;
  companyAddress?: string;
  currency: string;
  timezone: string;
  notificationsEnabled: boolean;
  lowStockThresholdDefault: number;
  forecastHorizonMonths: number;
  theme: string;
  apiKeyHint?: string;
};

export default function SettingsPage() {
  const toast = useToastStore((s) => s.push);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((r) => setSettings(r.data))
      .catch(() => toast({ title: "Failed to load settings", variant: "danger" }));
  }, []);

  const save = async () => {
    if (!settings) return;
    try {
      await api.put("/settings", settings);
      toast({ title: "Settings saved", variant: "success" });
    } catch {
      toast({ title: "Failed to save settings", variant: "danger" });
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-4">
      <PageHeader title="Platform Settings" subtitle="Persisted company and operational settings connected to PostgreSQL." />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Company & Preferences</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={settings.companyName} onChange={(e) => setSettings((prev) => (prev ? { ...prev, companyName: e.target.value } : prev))} placeholder="Company name" />
            <Input value={settings.companyWebsite || ""} onChange={(e) => setSettings((prev) => (prev ? { ...prev, companyWebsite: e.target.value } : prev))} placeholder="Company website" />
            <Input value={settings.companyAddress || ""} onChange={(e) => setSettings((prev) => (prev ? { ...prev, companyAddress: e.target.value } : prev))} placeholder="Company address" />
            <Select value={settings.currency} onChange={(e) => setSettings((prev) => (prev ? { ...prev, currency: e.target.value } : prev))}>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </Select>
            <Input value={settings.timezone} onChange={(e) => setSettings((prev) => (prev ? { ...prev, timezone: e.target.value } : prev))} placeholder="Timezone" />
            <Select value={settings.theme} onChange={(e) => setSettings((prev) => (prev ? { ...prev, theme: e.target.value } : prev))}>
              <option value="dark">dark</option>
              <option value="light">light</option>
            </Select>
            <Input type="number" value={settings.lowStockThresholdDefault} onChange={(e) => setSettings((prev) => (prev ? { ...prev, lowStockThresholdDefault: Number(e.target.value) } : prev))} placeholder="Low stock default" />
            <Input type="number" value={settings.forecastHorizonMonths} onChange={(e) => setSettings((prev) => (prev ? { ...prev, forecastHorizonMonths: Number(e.target.value) } : prev))} placeholder="Forecast horizon months" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant={settings.notificationsEnabled ? "default" : "outline"} onClick={() => setSettings((prev) => (prev ? { ...prev, notificationsEnabled: !prev.notificationsEnabled } : prev))}>
              Notifications {settings.notificationsEnabled ? "On" : "Off"}
            </Button>
            <Button onClick={() => void save()}>Save settings</Button>
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold">API & Security</p>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">API key hint: {settings.apiKeyHint || "not set"}</p>
            <p className="rounded-xl bg-white/5 p-3">User management: admin controlled</p>
            <p className="rounded-xl bg-white/5 p-3">Role-based permissions enabled</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
