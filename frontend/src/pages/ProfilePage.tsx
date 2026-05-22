import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToastStore } from "@/store/toast";
import { useAuthStore } from "@/store/auth";
import { Activity, ShieldCheck, UserCircle2 } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const pushToast = useToastStore((s) => s.push);

  return (
    <div className="space-y-4">
      <PageHeader title="User Profile" subtitle="Personal analytics, activity timeline, connected devices, and account controls." />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <UserCircle2 className="h-10 w-10 text-neon-blue" />
            </div>
            <div>
              <p className="text-lg font-semibold">{user?.fullName ?? "Operations Admin"}</p>
              <p className="text-xs text-slate-400">{user?.email ?? "admin@stockflow.ai"}</p>
            </div>
          </div>
          <Button className="mt-4 w-full">Upload avatar</Button>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Profile Statistics</p>
          <p className="mt-2 text-2xl font-semibold">248 actions</p>
          <p className="text-xs text-emerald-300">Last 30 days</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Security Score</p>
          <p className="mt-2 text-2xl font-semibold">92/100</p>
          <p className="text-xs text-emerald-300">MFA enabled • Device trust active</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Editable User Info</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input defaultValue={user?.fullName ?? "Operations Admin"} />
            <Input defaultValue={user?.email ?? "admin@stockflow.ai"} />
            <Input defaultValue="Head of Operations" />
            <Input defaultValue="+49 176 0000 1122" />
          </div>
          <Button className="mt-4" onClick={() => pushToast({ title: "Profile updated", description: "Your information was saved.", variant: "success" })}>
            Save profile
          </Button>
        </Card>
        <Card>
          <p className="text-sm font-semibold">Security Controls</p>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">Password updated 19 days ago</p>
            <p className="rounded-xl bg-white/5 p-3">MFA app linked</p>
            <p className="rounded-xl bg-white/5 p-3">2 trusted browsers</p>
          </div>
          <Button variant="outline" className="mt-3 w-full">
            Review devices
          </Button>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-neon-blue" /> Activity Timeline
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">Updated forecasting alert thresholds</p>
            <p className="rounded-xl bg-white/5 p-3">Exported monthly analytics PDF</p>
            <p className="rounded-xl bg-white/5 p-3">Approved supplier contract renewal</p>
          </div>
        </Card>
        <Card>
          <p className="mb-3 text-sm font-semibold">Recent Actions</p>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">Created PO-33982</p>
            <p className="rounded-xl bg-white/5 p-3">Adjusted Smart Conveyor Motor stock</p>
            <p className="rounded-xl bg-white/5 p-3">Triggered emergency restock workflow</p>
          </div>
        </Card>
        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-neon-purple" /> Connected Devices
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">MacBook Pro • Berlin • trusted</p>
            <p className="rounded-xl bg-white/5 p-3">Surface Laptop • Prague • trusted</p>
            <p className="rounded-xl bg-white/5 p-3">iPhone 15 • Milan • recent login</p>
          </div>
          <Button variant="outline" className="mt-3 w-full">
            Manage sessions
          </Button>
        </Card>
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold">Notification Preferences</p>
        <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-3">Critical alerts: Email + Mobile push</div>
          <div className="rounded-xl bg-white/5 p-3">Daily summary: 08:00 local time</div>
          <div className="rounded-xl bg-white/5 p-3">Report completion: In-app notification</div>
        </div>
      </Card>
    </div>
  );
}
