import type { HarmonyMode, Palette, PaletteRole } from "@/types/palette";

type Hsl = {
  h: number;
  s: number;
  l: number;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wrapHue(hue: number) {
  return ((hue % 360) + 360) % 360;
}

function hslToHex({ h, s, l }: Hsl) {
  const saturation = s / 100;
  const lightness = l / 100;
  const hue = wrapHue(h) / 360;

  const hueToRgb = (p: number, q: number, t: number) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };

  let r: number;
  let g: number;
  let b: number;

  if (saturation === 0) {
    r = g = b = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    r = hueToRgb(p, q, hue + 1 / 3);
    g = hueToRgb(p, q, hue);
    b = hueToRgb(p, q, hue - 1 / 3);
  }

  const toHex = (value: number) => Math.round(value * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function getHueOffsets(mode: HarmonyMode) {
  switch (mode) {
    case "triadic":
      return { primary: 0, secondary: 120, accent: 240 };
    case "analogous":
      return { primary: 0, secondary: 20, accent: -20 };
    case "monochromatic":
      return { primary: 0, secondary: 10, accent: -8 };
    case "complementary":
      return { primary: 0, secondary: 20, accent: 180 };
    case "random":
    default:
      return { primary: 0, secondary: 20, accent: 180 };
  }
}

function buildPalette(baseHue: number, mode: HarmonyMode): Palette {
  const isDarkTheme = Math.random() < 0.5;
  const offsets = getHueOffsets(mode);
  const neutralHue = wrapHue(baseHue + randomInt(-18, 18));

  return {
    primary: hslToHex({
      h: baseHue + offsets.primary,
      s: randomInt(64, 84),
      l: isDarkTheme ? randomInt(52, 68) : randomInt(42, 56),
    }),
    secondary: hslToHex({
      h: baseHue + offsets.secondary,
      s: randomInt(48, 70),
      l: isDarkTheme ? randomInt(46, 62) : randomInt(50, 64),
    }),
    accent: hslToHex({
      h: baseHue + offsets.accent,
      s: randomInt(70, 92),
      l: isDarkTheme ? randomInt(58, 72) : randomInt(36, 52),
    }),
    background: hslToHex({
      h: neutralHue,
      s: randomInt(8, 18),
      l: isDarkTheme ? randomInt(8, 20) : randomInt(85, 96),
    }),
    text: hslToHex({
      h: neutralHue,
      s: randomInt(8, 18),
      l: isDarkTheme ? randomInt(88, 96) : randomInt(8, 18),
    }),
  };
}

export function generatePalette(mode: HarmonyMode, lockedColors: Partial<Record<PaletteRole, string>> = {}): Palette {
  const baseHue = randomInt(0, 359);
  const generated = buildPalette(baseHue, mode);

  return {
    primary: lockedColors.primary ?? generated.primary,
    secondary: lockedColors.secondary ?? generated.secondary,
    accent: lockedColors.accent ?? generated.accent,
    background: lockedColors.background ?? generated.background,
    text: lockedColors.text ?? generated.text,
  };
}

export function paletteToSearchParam(palette: Palette) {
  return encodeURIComponent(JSON.stringify(palette));
}

export function searchParamToPalette(value?: string | null): Palette | null {
  if (!value) return null;

  try {
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as Palette;
    if (!parsed.primary || !parsed.secondary || !parsed.accent || !parsed.background || !parsed.text) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
