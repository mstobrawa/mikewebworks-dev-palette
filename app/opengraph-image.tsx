import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const palette = ["#7DD3FC", "#0EA5E9", "#38BDF8", "#0F172A", "#E2E8F0"];

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
          background: "linear-gradient(180deg, #07111f 0%, #0f172a 100%)",
          color: "#e5f3ff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#7dd3fc" }}>
            Mike Webworks
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            Dev Palette Generator
          </div>
          <div style={{ fontSize: 32, color: "#b7c9db" }}>
            Generate UI color palettes
          </div>
        </div>
        <div style={{ display: "flex", gap: "18px" }}>
          {palette.map((color) => (
            <div
              key={color}
              style={{
                flex: 1,
                height: 220,
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,0.12)",
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
