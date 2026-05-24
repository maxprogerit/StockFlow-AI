import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  description: string;
  icon: LucideIcon;
}>;

export function EmptyState({ title, description, icon: Icon, children }: Props) {
  return (
    <Card className="flex min-h-52 flex-col items-center justify-center text-center">
      <div className="rounded-full bg-white/10 p-3">
        <Icon className="h-5 w-5 text-neon-purple" />
      </div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-300">{description}</p>
      {children && <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>}
    </Card>
  );
}
