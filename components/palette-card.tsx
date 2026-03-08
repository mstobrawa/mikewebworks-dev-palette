import { hexToRgbString } from "@/lib/utils";
import type { PaletteRole } from "@/types/palette";

type PaletteCardProps = {
  label: PaletteRole;
  value: string;
};

export function PaletteCard({ label, value }: PaletteCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-panel">
      <div className="h-28 w-full" style={{ backgroundColor: value }} />
      <div className="space-y-2 px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium capitalize text-ink">{label}</h3>
          <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-xs text-muted">HEX</span>
        </div>
        <p className="font-mono text-sm text-ink">{value}</p>
        <p className="font-mono text-xs text-muted">rgb({hexToRgbString(value)})</p>
      </div>
    </div>
  );
}
