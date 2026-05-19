import { Card } from "@/components/ui/card";

export function SimplePage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <Card>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </Card>
    </div>
  );
}

