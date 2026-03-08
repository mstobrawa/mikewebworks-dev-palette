import type { HarmonyMode, Palette } from "@/types/palette";

type Hsl = {
  h: number;
  s: number;
  l: number;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hslToHex({ h, s, l }: Hsl) {
  const saturation = s / 100;
  const lightness = l / 100;
  const hue = h / 360;

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

function buildPaletteFromHues(hues: number[]): Palette {
  const mapped = hues.map((hue, index) =>
    hslToHex({
      h: (hue + 360) % 360,
      s: [72, 62, 78, 24, 18][index],
      l: [54, 58, 64, 11, 90][index]
    })
  );

  return {
    primary: mapped[0],
    secondary: mapped[1],
    accent: mapped[2],
    background: mapped[3],
    text: mapped[4]
  };
}

export function generatePalette(mode: HarmonyMode): Palette {
  const baseHue = randomInt(0, 359);

  switch (mode) {
    case "complementary":
      return buildPaletteFromHues([baseHue, baseHue + 180, baseHue + 24, baseHue - 8, baseHue + 180]);
    case "triadic":
      return buildPaletteFromHues([baseHue, baseHue + 120, baseHue + 240, baseHue - 15, baseHue + 160]);
    case "analogous":
      return buildPaletteFromHues([baseHue, baseHue + 25, baseHue - 25, baseHue - 6, baseHue + 10]);
    case "monochromatic":
      return {
        primary: hslToHex({ h: baseHue, s: 74, l: 54 }),
        secondary: hslToHex({ h: baseHue, s: 65, l: 42 }),
        accent: hslToHex({ h: baseHue, s: 92, l: 66 }),
        background: hslToHex({ h: baseHue, s: 28, l: 10 }),
        text: hslToHex({ h: baseHue, s: 22, l: 93 })
      };
    case "random":
    default:
      return {
        primary: hslToHex({ h: baseHue, s: randomInt(64, 86), l: randomInt(46, 62) }),
        secondary: hslToHex({ h: randomInt(0, 359), s: randomInt(40, 72), l: randomInt(48, 65) }),
        accent: hslToHex({ h: randomInt(0, 359), s: randomInt(74, 96), l: randomInt(58, 72) }),
        background: hslToHex({ h: baseHue, s: randomInt(12, 28), l: randomInt(8, 14) }),
        text: hslToHex({ h: baseHue, s: randomInt(10, 24), l: randomInt(88, 96) })
      };
  }
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
