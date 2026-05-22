import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToastStore } from "@/store/toast";
import { useState } from "react";

const tabs = ["Account", "Company", "Notifications", "Appearance", "Security", "API Keys", "Roles", "Billing", "Integrations"] as const;
type Tab = (typeof tabs)[number];

export default function SettingsPage() {
  const pushToast = useToastStore((s) => s.push);
  const [tab, setTab] = useState<Tab>("Account");

  return (
    <div className="space-y-4">
      <PageHeader title="Platform Settings" subtitle="Configure account, organization, security controls, and integrations." />
      <Card>
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <Button key={item} variant={tab === item ? "default" : "outline"} className="h-8 px-3 text-xs" onClick={() => setTab(item)}>
              {item}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">{tab} Settings</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Company name" defaultValue="StockFlow Intelligence GmbH" />
            <Input placeholder="Primary email" defaultValue="ops@stockflow.ai" />
            <Select defaultValue="UTC+02:00">
              <option>UTC+02:00</option>
              <option>UTC+01:00</option>
              <option>UTC+00:00</option>
            </Select>
            <Input placeholder="Webhook endpoint" defaultValue="https://api.stockflow.ai/hooks/inventory" />
          </div>
          <div className="mt-3 rounded-xl bg-white/5 p-3 text-xs text-slate-300">
            Security policy: MFA enforced, session timeout 30 minutes, JWT rotation enabled.
          </div>
          <Button className="mt-4" onClick={() => pushToast({ title: "Settings saved", description: `${tab} preferences updated.`, variant: "success" })}>
            Save changes
          </Button>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Billing</p>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">Plan: Enterprise AI</p>
            <p className="rounded-xl bg-white/5 p-3">Seats: 48 / 60</p>
            <p className="rounded-xl bg-white/5 p-3">Next invoice: 2026-06-01</p>
          </div>
          <Button variant="outline" className="mt-3 w-full">
            Manage subscription
          </Button>
        </Card>
      </div>
    </div>
  );
}
