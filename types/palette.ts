export type HarmonyMode =
  | "random"
  | "complementary"
  | "triadic"
  | "analogous"
  | "monochromatic";

export type PaletteRole = "primary" | "secondary" | "accent" | "background" | "text";

export type Palette = Record<PaletteRole, string>;

export type TailwindShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type TailwindScale = Record<TailwindShade, string>;

export type PaletteRecord = {
  id: string;
  name: string;
  colors: Palette;
  created_at: string;
  user_id: string | null;
};

export type PublicPaletteRecord = Omit<PaletteRecord, "user_id">;
