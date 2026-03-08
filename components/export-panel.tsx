"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { buildExport, type ExportFormat } from "@/lib/exports";
import type { Palette } from "@/types/palette";
import { cn } from "@/lib/utils";

const formats: { id: ExportFormat; label: string }[] = [
  { id: "css", label: "CSS Variables" },
  { id: "scss", label: "SCSS Variables" },
  { id: "tailwind", label: "Tailwind Config" },
  { id: "tokens", label: "Design Tokens" }
];

type ExportPanelProps = {
  palette: Palette;
};

export function ExportPanel({ palette }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => buildExport(format, palette), [format, palette]);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Developer export</p>
          <p className="text-sm text-muted">Copy implementation-ready tokens for your stack.</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-ink transition hover:border-white/20 hover:bg-white/10"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy to clipboard"}
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {formats.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFormat(item.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              format === item.id
                ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                : "border-white/10 text-muted hover:border-white/20 hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <pre className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-black/30 p-5 font-mono text-xs leading-6 text-cyan-100">
        <code>{output}</code>
      </pre>
    </section>
  );
}
