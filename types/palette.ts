export type HarmonyMode =
  | "random"
  | "complementary"
  | "triadic"
  | "analogous"
  | "monochromatic";

export type PaletteRole = "primary" | "secondary" | "accent" | "background" | "text";

export type Palette = Record<PaletteRole, string>;

export type PaletteRecord = {
  id: string;
  name: string;
  colors: Palette;
  created_at: string;
  user_id: string;
};

export type PublicPaletteRecord = Omit<PaletteRecord, "user_id">;
