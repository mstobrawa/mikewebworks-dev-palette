import { getContrastLabel, getContrastRatio } from "@/lib/utils";
import type { Palette } from "@/types/palette";

type ContrastCheckerProps = {
  palette: Palette;
};

const checks: { label: string; foreground: keyof Palette; background: keyof Palette }[] = [
  { label: "Text / Background", foreground: "text", background: "background" },
  { label: "Primary / Background", foreground: "primary", background: "background" },
  { label: "Accent / Background", foreground: "accent", background: "background" },
];

export function ContrastChecker({ palette }: ContrastCheckerProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel sm:p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">Accessibility</p>
        <h2 className="text-2xl font-semibold text-ink">Contrast checks</h2>
        <p className="text-sm leading-7 text-muted">
          Quick WCAG checks for the most important foreground and background pairings.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {checks.map((check) => {
          const ratio = getContrastRatio(palette[check.foreground], palette[check.background]);
          const rating = getContrastLabel(ratio);
          const passes = ratio >= 4.5;

          return (
            <article
              key={check.label}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm text-muted">{check.label}</p>
              <p className="mt-3 text-2xl font-semibold text-ink">{ratio.toFixed(1)}:1</p>
              <p className={`mt-2 text-sm ${passes ? "text-cyan-100" : "text-amber-200"}`}>
                {passes ? "Pass" : "Alert"} {rating}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
