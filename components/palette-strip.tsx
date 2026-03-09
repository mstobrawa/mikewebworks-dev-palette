"use client";

import { type MouseEvent, useState } from "react";
import { Copy } from "lucide-react";
import { showToast } from "@/lib/toast";
import { cn, hexToRgbString } from "@/lib/utils";
import type { Palette, PaletteRole } from "@/types/palette";

type PaletteStripProps = {
  palette: Palette;
  compact?: boolean;
  className?: string;
};

export function PaletteStrip({ palette, compact = false, className }: PaletteStripProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const entries = Object.entries(palette) as [PaletteRole, string][];

  async function handleCopy(event: MouseEvent<HTMLButtonElement>, role: PaletteRole, value: string) {
    event.stopPropagation();
    event.preventDefault();
    await navigator.clipboard.writeText(value);
    setCopiedKey(role);
    showToast("Copied!");
    window.setTimeout(() => setCopiedKey((current) => (current === role ? null : current)), 1200);
  }

  if (compact) {
    return (
      <div className={cn("grid gap-2 md:flex md:w-full md:gap-0 md:overflow-hidden md:rounded-xl", className)}>
        {entries.map(([role, value], index) => (
          <button
            key={role}
            type="button"
            onClick={(event) => void handleCopy(event, role, value)}
            className={cn(
              "relative h-16 w-full overflow-hidden rounded-lg border border-white/10 transition hover:opacity-95 md:flex-1 md:rounded-none md:border-y md:border-l-0 md:border-r md:border-white/10 md:first:border-l md:last:border-r",
              index === 0 && "md:rounded-l-xl",
              index === entries.length - 1 && "md:rounded-r-xl",
            )}
            style={{ backgroundColor: value }}
          >
            <span className="absolute right-2 top-2 rounded-full bg-black/35 px-2 py-1 font-mono text-[10px] text-white/90 backdrop-blur-sm">
              {copiedKey === role ? "Copied!" : value}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 md:flex md:gap-0 md:overflow-hidden md:rounded-[1.5rem] md:border md:border-white/10", className)}>
      {entries.map(([role, value], index) => (
        <button
          key={role}
          type="button"
          onClick={(event) => void handleCopy(event, role, value)}
          className={cn(
            "overflow-hidden border border-white/10 bg-white/5 text-left transition hover:border-white/20 md:min-w-0 md:flex-1 md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:border-white/10 md:bg-transparent md:shadow-none md:last:border-r-0",
            compact ? "rounded-2xl" : "rounded-3xl shadow-panel",
            index === 0 && "md:rounded-l-[1.5rem]",
            index === entries.length - 1 && "md:rounded-r-[1.5rem]",
          )}
        >
          <div className={cn("w-full", compact ? "h-16" : "h-28")} style={{ backgroundColor: value }} />
          <div className={cn("space-y-2", compact ? "px-3 py-2" : "px-4 py-4 sm:px-5")}>
            <div className="flex items-center justify-between gap-3">
              <h3 className={cn("font-medium capitalize text-ink", compact ? "text-xs" : "text-sm")}>{role}</h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] text-muted">
                <Copy className="h-3 w-3" />
                {copiedKey === role ? "Copied!" : "HEX"}
              </span>
            </div>
            <p className={cn("break-all font-mono text-ink", compact ? "text-xs" : "text-sm")}>{value}</p>
            {!compact ? (
              <p className="break-all font-mono text-xs text-muted">rgb({hexToRgbString(value)})</p>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  );
}
