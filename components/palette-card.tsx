"use client";

import { useState } from "react";
import { copyText, hexToRgbString } from "@/lib/utils";
import type { PaletteRole } from "@/types/palette";

type PaletteCardProps = {
  label: PaletteRole;
  value: string;
};

export function PaletteCard({ label, value }: PaletteCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="block w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-panel transition hover:border-white/20"
    >
      <div className="h-28 w-full" style={{ backgroundColor: value }} />
      <div className="space-y-2 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium capitalize text-ink">{label}</h3>
          <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-xs text-muted">
            {copied ? "Copied" : "HEX"}
          </span>
        </div>
        <p className="break-all font-mono text-sm text-ink">{value}</p>
        <p className="break-all font-mono text-xs text-muted">rgb({hexToRgbString(value)})</p>
      </div>
    </button>
  );
}
