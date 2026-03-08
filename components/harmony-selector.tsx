import type { HarmonyMode } from "@/types/palette";
import { cn } from "@/lib/utils";

const options: HarmonyMode[] = ["random", "complementary", "triadic", "analogous", "monochromatic"];

type HarmonySelectorProps = {
  value: HarmonyMode;
  onChange: (value: HarmonyMode) => void;
};

export function HarmonySelector({ value, onChange }: HarmonySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm capitalize transition",
            value === option
              ? "border-white/20 bg-white text-canvas"
              : "border-white/10 bg-white/5 text-muted hover:border-white/20 hover:text-ink"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
