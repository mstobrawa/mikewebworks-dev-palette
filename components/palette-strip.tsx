"use client";

import { type MouseEvent, useState } from "react";
import { Copy, Lock, LockOpen } from "lucide-react";
import { showToast } from "@/lib/toast";
import { cn, copyText, hexToRgbString } from "@/lib/utils";
import type { Palette, PaletteRole } from "@/types/palette";

type PaletteStripProps = {
  palette: Palette;
  compact?: boolean;
  className?: string;
  lockedRoles?: Partial<Record<PaletteRole, boolean>>;
  onToggleLock?: (role: PaletteRole) => void;
};

export function PaletteStrip({
  palette,
  compact = false,
  className,
  lockedRoles,
  onToggleLock,
}: PaletteStripProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const entries = Object.entries(palette) as [PaletteRole, string][];

  async function handleCopy(event: MouseEvent<HTMLButtonElement>, role: PaletteRole, value: string) {
    event.stopPropagation();
    event.preventDefault();
    await copyText(value);
    setCopiedKey(role);
    showToast("Copied!");
    window.setTimeout(() => setCopiedKey((current) => (current === role ? null : current)), 1200);
  }

  if (compact) {
    return (
      <div className={cn("grid gap-2 md:flex md:h-24 md:w-full md:gap-0 md:overflow-hidden md:rounded-lg", className)}>
        {entries.map(([role, value], index) => (
          <div
            key={role}
            className={cn(
              "relative h-24 w-full overflow-hidden rounded-lg border border-white/10 transition hover:opacity-95 md:flex-1 md:rounded-none md:border-y md:border-l-0 md:border-r md:border-white/10 md:first:border-l md:last:border-r",
              lockedRoles?.[role] && "opacity-95",
              index === 0 && "md:rounded-l-lg",
              index === entries.length - 1 && "md:rounded-r-lg",
            )}
          >
            <button
              type="button"
              onClick={(event) => void handleCopy(event, role, value)}
              className="h-full w-full"
              style={{ backgroundColor: value }}
            >
              <span className="absolute right-2 top-2 rounded-full bg-black/35 px-2 py-1 font-mono text-[10px] text-white/90 backdrop-blur-sm">
                {copiedKey === role ? "Copied!" : value}
              </span>
            </button>
            {onToggleLock ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  onToggleLock(role);
                }}
                className="absolute left-2 top-2 inline-flex rounded-full bg-black/35 p-1 text-white/90 backdrop-blur-sm"
              >
                {lockedRoles?.[role] ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 md:flex md:gap-0 md:overflow-hidden md:rounded-[1.5rem] md:border md:border-white/10", className)}>
      {entries.map(([role, value], index) => (
        <div
          key={role}
          className={cn(
            "relative overflow-hidden border border-white/10 bg-white/5 text-left transition hover:border-white/20 md:min-w-0 md:flex-1 md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:border-white/10 md:bg-transparent md:shadow-none md:last:border-r-0",
            compact ? "rounded-2xl" : "rounded-3xl shadow-panel",
            lockedRoles?.[role] && "opacity-95",
            index === 0 && "md:rounded-l-[1.5rem]",
            index === entries.length - 1 && "md:rounded-r-[1.5rem]",
          )}
        >
          <button
            type="button"
            onClick={(event) => void handleCopy(event, role, value)}
            className="block h-full w-full text-left"
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
          {onToggleLock ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onToggleLock(role);
              }}
              className="absolute left-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/90 backdrop-blur-sm transition hover:border-white/20"
            >
              {lockedRoles?.[role] ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
