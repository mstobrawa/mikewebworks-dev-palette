import type { Palette } from "@/types/palette";

export type ExportFormat = "css" | "scss" | "tailwind" | "tokens";

function createShade(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

export function buildExport(format: ExportFormat, palette: Palette) {
  switch (format) {
    case "css":
      return `:root {
  --color-primary: ${palette.primary};
  --color-primary-light: ${createShade(palette.primary, "CC")};
  --color-primary-dark: ${createShade(palette.primary, "99")};
  --color-secondary: ${palette.secondary};
  --color-accent: ${palette.accent};
  --color-background: ${palette.background};
  --color-text: ${palette.text};
}`;
    case "scss":
      return `$primary: ${palette.primary};
$primary-light: ${createShade(palette.primary, "CC")};
$primary-dark: ${createShade(palette.primary, "99")};
$secondary: ${palette.secondary};
$accent: ${palette.accent};
$background: ${palette.background};
$text: ${palette.text};`;
    case "tailwind":
      return `theme: {
  extend: {
    colors: {
      brand: {
        primary: "${palette.primary}",
        secondary: "${palette.secondary}",
        accent: "${palette.accent}",
        background: "${palette.background}",
        text: "${palette.text}"
      }
    }
  }
}`;
    case "tokens":
    default:
      return JSON.stringify(
        {
          color: {
            primary: palette.primary,
            secondary: palette.secondary,
            accent: palette.accent,
            background: palette.background,
            text: palette.text
          }
        },
        null,
        2
      );
  }
}
