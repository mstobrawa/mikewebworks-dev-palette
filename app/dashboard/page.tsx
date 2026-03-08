import Link from "next/link";
import { SavedPaletteList } from "@/components/saved-palette-list";
import { createClient } from "@/lib/supabase/server";
import type { PaletteRecord } from "@/types/palette";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-panel">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">Pro feature</p>
          <h1 className="mt-4 text-4xl font-semibold text-ink">Sign in to access your saved palettes.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted">
            Connect Supabase Auth, sign in, and your dashboard will list every palette you store from the generator.
          </p>
          <Link
            href="/generator"
            className="mt-8 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink"
          >
            Go to generator
          </Link>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("palettes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">Dashboard</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">Saved palettes</h1>
        <p className="mt-3 text-sm leading-7 text-muted">Your reusable color systems, stored in Supabase and ready for client work.</p>
      </div>
      <SavedPaletteList initialPalettes={(data as PaletteRecord[]) ?? []} />
    </div>
  );
}
