import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useToastStore } from "@/store/toast";
import { ShieldCheck, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  timezone?: string;
  jobTitle?: string;
  role: string;
  profileCompletion: number;
  recentActions: { action: string; module: string; metadata: string; createdAt: string }[];
};

export default function ProfilePage() {
  const toast = useToastStore((s) => s.push);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/profile");
      setProfile(data);
    } catch {
      toast({ title: "Failed to load profile", variant: "danger" });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    if (!profile) return;
    try {
      await api.patch("/profile", profile);
      toast({ title: "Profile updated", variant: "success" });
      await load();
    } catch {
      toast({ title: "Failed to update profile", variant: "danger" });
    }
  };

  const savePassword = async () => {
    try {
      await api.patch("/profile/password", { password });
      toast({ title: "Password updated", variant: "success" });
      setPasswordOpen(false);
      setPassword("");
    } catch (error: any) {
      toast({ title: error.response?.data?.error ?? "Password update failed", variant: "danger" });
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <PageHeader title="User Profile" subtitle="Editable profile, account activity, sessions, and security controls." />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} className="h-14 w-14 rounded-2xl object-cover" alt={profile.fullName} />
            ) : (
              <div className="rounded-2xl bg-white/10 p-3">
                <UserCircle2 className="h-10 w-10 text-neon-blue" />
              </div>
            )}
            <div>
              <p className="text-lg font-semibold">{profile.fullName || "New user"}</p>
              <p className="text-xs text-slate-400">{profile.email}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-300">Role: {profile.role}</p>
          <p className="text-xs text-slate-300">Profile completion: {profile.profileCompletion}%</p>
        </Card>
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Editable User Info</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={profile.fullName || ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, fullName: e.target.value } : prev))} placeholder="Full name" />
            <Input value={profile.jobTitle || ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, jobTitle: e.target.value } : prev))} placeholder="Job title" />
            <Input value={profile.avatarUrl || ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, avatarUrl: e.target.value } : prev))} placeholder="Avatar URL" />
            <Input value={profile.timezone || ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, timezone: e.target.value } : prev))} placeholder="Timezone" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => void save()}>Save profile</Button>
            <Button variant="outline" onClick={() => setPasswordOpen(true)}>
              Change password
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <p className="mb-3 text-sm font-semibold">Recent Actions</p>
          <div className="space-y-2 text-xs text-slate-300">
            {profile.recentActions.length === 0 ? (
              <p className="rounded-xl bg-white/5 p-3">No activity yet. Start using modules to build account history.</p>
            ) : (
              profile.recentActions.map((action, index) => (
                <p key={`${action.action}-${index}`} className="rounded-xl bg-white/5 p-3">
                  [{action.module}] {action.action} - {action.metadata || "No details"}
                </p>
              ))
            )}
          </div>
        </Card>
        <Card>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-neon-purple" /> Connected Sessions
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="rounded-xl bg-white/5 p-3">Current browser session active</p>
            <p className="rounded-xl bg-white/5 p-3">JWT + refresh token secured</p>
            <p className="rounded-xl bg-white/5 p-3">Role permissions: {profile.role}</p>
          </div>
        </Card>
      </div>

      <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)} title="Change Password">
        <div className="space-y-3">
          <Input type="password" placeholder="New password (min 8)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" onClick={() => void savePassword()}>
            Update password
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
