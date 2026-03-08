import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { ContrastChecker } from "@/components/contrast-checker";
import { PaletteStrip } from "@/components/palette-strip";
import { ShareLinkButton } from "@/components/share-link-button";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Palette, PublicPaletteRecord } from "@/types/palette";

type PublicPalettePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const title = "Color palette – Dev Palette Generator";
  const description = "Generate UI color palettes and export them directly to CSS, SCSS, and Tailwind.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPalettePage({ params }: PublicPalettePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    notFound();
  }

  const { data, error } = await supabase
    .from("palettes")
    .select("id, name, colors, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const palette = data as PublicPaletteRecord;
  const colors = palette.colors as Palette;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">
              Public palette
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {palette.name}
            </h1>
            <p className="text-sm leading-7 text-muted">
              Shared on {formatDate(palette.created_at)}. Click any color to copy its HEX value.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-end">
            <ShareLinkButton path={`/p/${palette.id}`} defaultLabel="Share palette" />
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:scale-[1.01]"
            >
              <ExternalLink className="h-4 w-4" />
              Open generator
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-6 px-1 sm:px-0">
        <PaletteStrip palette={colors} />
      </section>

      <div className="mt-6">
        <ContrastChecker palette={colors} />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-cyan-300/15"
        >
          <Sparkles className="h-4 w-4" />
          <span>Crafted by Mike Webworks</span>
        </Link>
      </div>
    </div>
  );
}
