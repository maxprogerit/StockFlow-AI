import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const url = mode === "login" ? "/auth/login" : "/auth/register";
    const payload = mode === "login" ? { email, password } : { fullName, email, password };
    const { data } = await api.post(url, payload);
    setSession(data);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="mb-4 text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <form className="space-y-3" onSubmit={submit}>
          {mode === "register" && (
            <input className="w-full rounded-xl border border-white/10 bg-white/5 p-2" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          )}
          <input className="w-full rounded-xl border border-white/10 bg-white/5 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-xl border border-white/10 bg-white/5 p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

