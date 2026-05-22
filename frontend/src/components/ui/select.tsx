import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-neon-purple/60", className)} {...props}>
      {children}
    </select>
  );
}
