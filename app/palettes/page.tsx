import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Palette, PublicPaletteRecord } from "@/types/palette";

export const metadata: Metadata = {
  title: "Public palettes - Dev Palette Generator",
  description: "Browse public UI color palettes generated with Dev Palette Generator.",
};

export default async function PublicPalettesPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-sm text-muted shadow-panel">
          Supabase is not configured, so public palettes are unavailable right now.
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("palettes")
    .select("id, name, colors, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const palettes = (data as PublicPaletteRecord[] | null) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel sm:p-6">
        <div className="space-y-3 text-center lg:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">
            Public gallery
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Shared developer palettes
          </h1>
          <p className="text-sm leading-7 text-muted">
            Explore the latest public palettes and open any one to copy HEX values or share the link.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {palettes.map((palette) => {
          const colors = palette.colors as Palette;

          return (
            <Link
              key={palette.id}
              href={`/p/${palette.id}`}
              className="block rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel transition hover:border-white/20"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{palette.name}</h2>
                  <p className="text-sm text-muted">{formatDate(palette.created_at)}</p>
                </div>
                <span className="text-sm text-cyan-100/80">Open palette</span>
              </div>

              <div className="mt-5 grid gap-3 md:flex md:gap-0 md:overflow-hidden md:rounded-[1.5rem] md:border md:border-white/10">
                {Object.entries(colors).map(([role, value], index, entries) => (
                  <div
                    key={role}
                    className={[
                      "overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:flex-1 md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:border-white/10 md:bg-transparent md:last:border-r-0",
                      index === 0 ? "md:rounded-l-[1.5rem]" : "",
                      index === entries.length - 1 ? "md:rounded-r-[1.5rem]" : "",
                    ].join(" ")}
                  >
                    <div className="h-16 w-full" style={{ backgroundColor: value }} />
                    <div className="bg-black/20 px-3 py-2">
                      <p className="text-xs capitalize text-muted">{role}</p>
                      <p className="mt-1 break-all font-mono text-xs text-ink">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
