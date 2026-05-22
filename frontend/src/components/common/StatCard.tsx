import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, change, icon: Icon }: Props) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }}>
      <Card className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-emerald-300">{change}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-2">
            <Icon className="h-4 w-4 text-neon-blue" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
