"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type ToastState = {
  id: number;
  message: string;
};

export function ToastHost() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    let timeoutId: number | null = null;

    const onToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      const nextToast = {
        id: Date.now(),
        message: customEvent.detail.message,
      };

      setToast(nextToast);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setToast((current) => (current?.id === nextToast.id ? null : current));
      }, 1600);
    };

    window.addEventListener("app:toast", onToast);

    return () => {
      window.removeEventListener("app:toast", onToast);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-[80] flex justify-center px-4">
      <button
        type="button"
        onClick={() => setToast(null)}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-[#0b1222]/95 px-4 py-2 text-sm text-cyan-100 shadow-panel backdrop-blur-md"
      >
        <CheckCircle2 className="h-4 w-4" />
        {toast.message}
      </button>
    </div>
  );
}
