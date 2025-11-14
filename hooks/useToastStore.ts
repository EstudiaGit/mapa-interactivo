"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info";
export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  timeout?: number; // ms
};

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type ToastState = {
  toasts: Toast[];
  enqueue: (t: Omit<Toast, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  enqueue: (t) => {
    const id = t.id ?? genId();
    const toast: Toast = { id, type: t.type, message: t.message, timeout: t.timeout ?? 3000 };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => {
        get().dismiss(id);
      }, toast.timeout);
    }
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
