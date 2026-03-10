import { getContrastRatio } from "@/lib/utils";
import type { HarmonyMode, Palette, PaletteRole, TailwindScale } from "@/types/palette";

type Hsl = {
  h: number;
  s: number;
  l: number;
};

const tailwindStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wrapHue(hue: number) {
  return ((hue % 360) + 360) % 360;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToHsl(hex: string): Hsl {
  const normalized = hex.replace("#", "");
  const parts =
    normalized.length === 3
      ? normalized.split("").map((part) => part + part)
      : normalized.match(/.{1,2}/g);

  if (!parts || parts.length !== 3) {
    return { h: 0, s: 0, l: 0 };
  }

  const [r, g, b] = parts.map((part) => parseInt(part, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness * 100 };
  }

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case r:
      hue = (g - b) / delta + (g < b ? 6 : 0);
      break;
    case g:
      hue = (b - r) / delta + 2;
      break;
    default:
      hue = (r - g) / delta + 4;
      break;
  }

  return {
    h: Math.round(hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
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

function createPerceptualLightness(base: number, variance: number) {
  const eased = base + variance;
  return clamp(Math.round(eased), 4, 96);
}

function getTextOnColor(background: string) {
  const light = "#FFFFFF";
  const dark = "#111111";

  return getContrastRatio(light, background) >= getContrastRatio(dark, background)
    ? light
    : dark;
}

function ensureReadableText(background: string, preferredText?: string) {
  const automatic = getTextOnColor(background);

  if (!preferredText) {
    return automatic;
  }

  return getContrastRatio(preferredText, background) >= 4.5
    ? preferredText
    : automatic;
}

function buildPalette(baseHue: number, mode: HarmonyMode): Palette {
  const isDarkTheme = Math.random() < 0.5;
  const offsets = getHueOffsets(mode);
  const neutralHue = wrapHue(baseHue + randomInt(-18, 18));

  const palette = {
    primary: hslToHex({
      h: baseHue + offsets.primary,
      s: randomInt(64, 82),
      l: createPerceptualLightness(isDarkTheme ? 58 : 48, randomInt(-4, 4)),
    }),
    secondary: hslToHex({
      h: baseHue + offsets.secondary,
      s: randomInt(42, 64),
      l: createPerceptualLightness(isDarkTheme ? 54 : 58, randomInt(-5, 5)),
    }),
    accent: hslToHex({
      h: baseHue + offsets.accent,
      s: randomInt(72, 90),
      l: createPerceptualLightness(isDarkTheme ? 64 : 44, randomInt(-4, 4)),
    }),
    background: hslToHex({
      h: neutralHue,
      s: randomInt(8, 16),
      l: createPerceptualLightness(isDarkTheme ? 11 : 93, randomInt(-4, 3)),
    }),
    text: "#111111",
  };

  return {
    ...palette,
    text: ensureReadableText(palette.background),
  };
}

export function generatePalette(mode: HarmonyMode, lockedColors: Partial<Record<PaletteRole, string>> = {}): Palette {
  const baseHue = randomInt(0, 359);
  const generated = buildPalette(baseHue, mode);

  const nextPalette = {
    primary: lockedColors.primary ?? generated.primary,
    secondary: lockedColors.secondary ?? generated.secondary,
    accent: lockedColors.accent ?? generated.accent,
    background: lockedColors.background ?? generated.background,
    text: lockedColors.text ?? generated.text,
  };

  return {
    ...nextPalette,
    text: lockedColors.text ?? ensureReadableText(nextPalette.background, nextPalette.text),
  };
}

export function generateSimilarPalette(
  palette: Palette,
  lockedColors: Partial<Record<PaletteRole, string>> = {},
): Palette {
  const nextPalette = (Object.entries(palette) as [PaletteRole, string][])
    .reduce<Palette>((accumulator, [role, value]) => {
      if (lockedColors[role]) {
        accumulator[role] = lockedColors[role]!;
        return accumulator;
      }

      if (role === "text") {
        accumulator.text = value;
        return accumulator;
      }

      const hsl = hexToHsl(value);
      const saturationShift = randomInt(-8, 8);
      const lightnessShift = role === "background" ? randomInt(-5, 5) : randomInt(-8, 8);

      accumulator[role] = hslToHex({
        h: wrapHue(hsl.h + randomInt(-6, 6)),
        s: clamp(hsl.s + saturationShift, 6, 96),
        l: clamp(hsl.l + lightnessShift, role === "background" ? 8 : 18, role === "background" ? 96 : 82),
      });

      return accumulator;
    }, { ...palette });

  return {
    ...nextPalette,
    text: lockedColors.text ?? ensureReadableText(nextPalette.background, nextPalette.text),
  };
}

export function generateTailwindScale(baseColor: string): TailwindScale {
  const base = hexToHsl(baseColor);
  const curve = {
    50: 95,
    100: 90,
    200: 82,
    300: 72,
    400: 62,
    500: base.l,
    600: 46,
    700: 38,
    800: 28,
    900: 20,
  } satisfies Record<typeof tailwindStops[number], number>;

  return tailwindStops.reduce<TailwindScale>((accumulator, stop) => {
    const nextSaturation =
      stop < 500
        ? clamp(base.s - Math.round((500 - stop) / 80), 8, 96)
        : clamp(base.s + Math.round((stop - 500) / 130), 8, 96);

    accumulator[stop] = hslToHex({
      h: base.h,
      s: nextSaturation,
      l: stop === 500 ? base.l : curve[stop],
    });

    return accumulator;
  }, {} as TailwindScale);
}

export function getReadableTextColor(background: string) {
  return ensureReadableText(background);
}

export function isPaletteId(value?: string | null) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
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
