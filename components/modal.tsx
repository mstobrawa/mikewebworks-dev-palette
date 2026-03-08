"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  canClose?: boolean;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  actions,
  icon,
  canClose = true,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-md">
      <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6">
        <div
          className="absolute inset-0"
          onClick={() => {
            if (canClose) {
              onClose();
            }
          }}
        />
        <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b1222]/95 p-6 shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              {icon ? (
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                  {icon}
                </div>
              ) : null}
              <div>
                <h2 className="text-2xl font-semibold text-ink">{title}</h2>
                {description ? (
                  <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={!canClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition hover:border-white/20 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {children ? <div className="mt-6">{children}</div> : null}
          {actions ? <div className="mt-6 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        </div>
      </div>
    </div>
  );
}
