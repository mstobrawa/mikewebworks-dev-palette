import { PaletteStudio } from "@/components/palette-studio";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePalette, isPaletteId, searchParamToPalette } from "@/lib/palette";
import { createClient } from "@/lib/supabase/server";
import type { Palette } from "@/types/palette";

type GeneratorPageProps = {
  searchParams: Promise<{ palette?: string }>;
};

export default async function GeneratorPage({ searchParams }: GeneratorPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const user = supabase
    ? (
        await supabase.auth.getUser()
      ).data.user
    : null;

  let initialPalette: Palette | null = searchParamToPalette(params.palette);
  const paletteId = isPaletteId(params.palette) ? params.palette : null;

  if (!initialPalette && paletteId) {
    if (user && supabase) {
      const { data } = await supabase
        .from("palettes")
        .select("colors")
        .eq("id", paletteId)
        .eq("user_id", user.id)
        .single();

      initialPalette = ((data as { colors?: Palette } | null)?.colors) ?? null;
    } else {
      const adminClient = createAdminClient();

      if (adminClient) {
        const { data } = await adminClient
          .from("palettes")
          .select("colors")
          .eq("id", paletteId)
          .single();

        initialPalette = ((data as { colors?: Palette } | null)?.colors) ?? null;
      }
    }
  }

  const fallbackPalette = generatePalette("random");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <PaletteStudio initialPalette={initialPalette ?? fallbackPalette} canSave={Boolean(user)} />
    </div>
  );
}
