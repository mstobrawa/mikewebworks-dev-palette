import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Palette } from "@/types/palette";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{ id: string }>;
};

async function loadPalette(id: string) {
  const supabase = createAdminClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("palettes")
    .select("colors")
    .eq("id", id)
    .single();

  return (data?.colors as Palette | undefined) ?? null;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { id } = await params;
  const palette = (await loadPalette(id)) ?? {
    primary: "#7DD3FC",
    secondary: "#0EA5E9",
    accent: "#38BDF8",
    background: "#0F172A",
    text: "#E2E8F0",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: palette.background,
          color: palette.text,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: palette.accent }}>
            Dev Palette Generator
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            Shared Palette
          </div>
        </div>
        <div style={{ display: "flex", gap: "18px" }}>
          {Object.values(palette).map((color) => (
            <div
              key={color}
              style={{
                flex: 1,
                height: 240,
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,0.14)",
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
