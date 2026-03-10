import { generateTailwindScale, getReadableTextColor } from "@/lib/palette";
import type { Palette } from "@/types/palette";

export type ExportFormat = "css" | "scss" | "tailwind" | "tokens";

function createShade(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

export function buildExport(format: ExportFormat, palette: Palette) {
  const primaryScale = generateTailwindScale(palette.primary);
  const secondaryScale = generateTailwindScale(palette.secondary);
  const accentScale = generateTailwindScale(palette.accent);
  const surfaceText = getReadableTextColor(palette.background);

  switch (format) {
    case "css":
      return `:root {
  --color-primary: ${palette.primary};
  --color-primary-light: ${createShade(palette.primary, "CC")};
  --color-primary-dark: ${createShade(palette.primary, "99")};
  --color-secondary: ${palette.secondary};
  --color-accent: ${palette.accent};
  --color-background: ${palette.background};
  --color-text: ${surfaceText};
}`;
    case "scss":
      return `$primary: ${palette.primary};
$primary-light: ${createShade(palette.primary, "CC")};
$primary-dark: ${createShade(palette.primary, "99")};
$secondary: ${palette.secondary};
$accent: ${palette.accent};
$background: ${palette.background};
$text: ${surfaceText};`;
    case "tailwind":
      return `theme: {
  extend: {
    colors: {
      brand: {
        primary: ${JSON.stringify(primaryScale, null, 8).replace(/"([^"]+)":/g, "$1:")},
        secondary: ${JSON.stringify(secondaryScale, null, 8).replace(/"([^"]+)":/g, "$1:")},
        accent: ${JSON.stringify(accentScale, null, 8).replace(/"([^"]+)":/g, "$1:")},
        background: "${palette.background}",
        text: "${surfaceText}"
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
            text: surfaceText,
            scales: {
              primary: primaryScale,
              secondary: secondaryScale,
              accent: accentScale,
            }
          }
        },
        null,
        2
      );
  }
}
