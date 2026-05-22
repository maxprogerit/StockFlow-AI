import { useToastStore } from "@/store/toast";
import { AnimatePresence, motion } from "framer-motion";

const tone = {
  default: "border-white/20 bg-slate-950/90",
  success: "border-emerald-400/40 bg-emerald-950/40",
  warning: "border-amber-400/40 bg-amber-950/40",
  danger: "border-red-400/40 bg-red-950/40"
};

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            className={`pointer-events-auto w-80 rounded-xl border p-3 text-left shadow-lg backdrop-blur-xl ${tone[toast.variant ?? "default"]}`}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            onClick={() => remove(toast.id)}
            type="button"
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && <p className="mt-1 text-xs text-slate-300">{toast.description}</p>}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
