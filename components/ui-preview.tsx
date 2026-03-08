import type { Palette } from "@/types/palette";

type UIPreviewProps = {
  palette: Palette;
};

export function UIPreview({ palette }: UIPreviewProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 shadow-panel">
      <div className="border-b border-white/10 px-6 py-4 text-sm text-muted" style={{ backgroundColor: palette.background }}>
        Live UI preview
      </div>
      <div className="space-y-6 p-6" style={{ backgroundColor: palette.background, color: palette.text }}>
        <div
          className="flex items-center justify-between rounded-2xl border px-4 py-3"
          style={{ borderColor: `${palette.text}22`, backgroundColor: `${palette.secondary}18` }}
        >
          <div>
            <p className="text-sm opacity-80">Navbar</p>
            <p className="font-medium">Mike Webworks</p>
          </div>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: palette.primary, color: palette.background }}
          >
            New palette
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-[1.75rem] border p-6" style={{ borderColor: `${palette.text}18` }}>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: `${palette.accent}20`, color: palette.accent }}
            >
              Heading preview
            </span>
            <h3 className="text-3xl font-semibold">Build a sharper interface system in minutes.</h3>
            <p className="max-w-xl text-sm leading-7 opacity-80">
              Test contrast, hierarchy, and rhythm with palette-aware components before pushing colors into code.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full px-5 py-3 text-sm font-medium"
                style={{ backgroundColor: palette.primary, color: palette.background }}
              >
                Primary button
              </button>
              <button
                type="button"
                className="rounded-full border px-5 py-3 text-sm"
                style={{ borderColor: `${palette.text}22`, color: palette.text }}
              >
                Secondary button
              </button>
            </div>
          </div>
          <div
            className="rounded-[1.75rem] border p-6"
            style={{ backgroundColor: `${palette.secondary}16`, borderColor: `${palette.text}18` }}
          >
            <p className="text-sm opacity-80">Card preview</p>
            <h4 className="mt-3 text-xl font-semibold">Release palette v2.1</h4>
            <p className="mt-3 text-sm leading-7 opacity-80">
              Accent highlights show alert states, focus rings, badges, and lightweight data visualization.
            </p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: palette.accent, color: palette.background }}>
                Accent
              </span>
              <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: `${palette.text}20` }}>
                Token-ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
