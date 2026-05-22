import { create } from "zustand";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
};

type ToastState = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    window.setTimeout(() => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })), 3800);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }))
}));
