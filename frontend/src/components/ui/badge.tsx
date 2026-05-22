import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}>;

const variants = {
  default: "border-white/15 bg-white/5 text-slate-200",
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  danger: "border-red-400/30 bg-red-500/10 text-red-300",
  info: "border-sky-400/30 bg-sky-500/10 text-sky-300"
};

export function Badge({ variant = "default", className, children }: Props) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", variants[variant], className)}>{children}</span>;
}
