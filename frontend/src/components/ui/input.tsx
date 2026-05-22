import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-neon-blue/60", className)} {...props} />;
}
