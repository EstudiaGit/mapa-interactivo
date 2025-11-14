"use client";

import { useToastStore } from "@/hooks/useToastStore";
import { useEffect, useRef } from "react";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const liveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!liveRef.current) return;
    if (toasts.length === 0) return;
    const last = toasts[toasts.length - 1];
    liveRef.current.textContent = last.message;
  }, [toasts]);

  return (
    <>
      {/* aria-live region for screen readers */}
      <div ref={liveRef} aria-live="polite" className="sr-only" />
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[240px] max-w-[360px] rounded-md shadow-lg px-4 py-3 text-white border ${
              t.type === "success"
                ? "bg-green-600 border-green-500"
                : t.type === "error"
                ? "bg-red-600 border-red-500"
                : "bg-gray-800 border-gray-700"
            }`}
            role={t.type === "error" ? "alert" : "status"}
            aria-live={t.type === "error" ? "assertive" : "polite"}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 text-sm">{t.message}</div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-white/80 hover:text-white"
                aria-label="Cerrar notificación"
                title="Cerrar"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
