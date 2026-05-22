import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function PageHeader({ title, subtitle, children }: Props) {
  return (
    <motion.div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}
