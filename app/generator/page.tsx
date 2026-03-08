import { PaletteStudio } from "@/components/palette-studio";
import { generatePalette, searchParamToPalette } from "@/lib/palette";
import { createClient } from "@/lib/supabase/server";

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

  const initialPalette = searchParamToPalette(params.palette) ?? generatePalette("random");

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
      <PaletteStudio initialPalette={initialPalette} canSave={Boolean(user)} />
    </div>
  );
}
