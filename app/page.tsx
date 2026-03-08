import Link from "next/link";
import { ArrowRight, Code2, DatabaseZap, SwatchBook } from "lucide-react";

const features = [
  {
    icon: SwatchBook,
    title: "Harmony-based generation",
    description: "Random, complementary, triadic, analogous, and monochromatic palettes tuned for UI work."
  },
  {
    icon: Code2,
    title: "Developer exports",
    description: "Copy CSS variables, SCSS variables, Tailwind config, and design tokens in one click."
  },
  {
    icon: DatabaseZap,
    title: "Save your systems",
    description: "Supabase-backed dashboard for storing production palettes as part of your SaaS workflow."
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100">
            Mike Webworks
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-ink md:text-6xl">
              Generate polished color systems and export them straight into code.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Dev Palette Generator helps frontend teams and solo builders create modern palettes, preview UI states, and ship design tokens fast.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition hover:scale-[1.01]"
            >
              Open generator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink"
            >
              View dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
          <div className="grid gap-4">
            <div className="grid grid-cols-5 overflow-hidden rounded-[1.5rem] border border-white/10">
              {["#7DD3FC", "#0EA5E9", "#38BDF8", "#0F172A", "#E2E8F0"].map((color) => (
                <span key={color} className="h-28" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-muted">Feature preview</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                  <div>
                    <p className="text-xs text-muted">Tailwind export</p>
                    <p className="font-mono text-sm text-cyan-100">brand.primary: "#7DD3FC"</p>
                  </div>
                  <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">copy</span>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-lg font-semibold text-ink">Minimal, dark, dev-first</p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    Instant previews show whether your palette holds up across cards, buttons, navigation, and body copy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
            <feature.icon className="h-8 w-8 text-cyan-200" />
            <h2 className="mt-6 text-xl font-semibold text-ink">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
