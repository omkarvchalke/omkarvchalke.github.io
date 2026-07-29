import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Omkar Vilas Chalke";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DISCIPLINES = [
  "Backend",
  "Cloud",
  "Data Engineering",
  "Artificial Intelligence",
  "Architecture",
];

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#0A0B0C",
        backgroundImage:
          "linear-gradient(rgba(244,239,230,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,230,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        {DISCIPLINES.map((d) => (
          <div
            key={d}
            style={{
              display: "flex",
              fontSize: 20,
              color: "#B7B0A2",
              border: "1px solid rgba(244,239,230,0.16)",
              borderRadius: 6,
              padding: "6px 14px",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          color: "#F4EFE6",
          lineHeight: 1.1,
          maxWidth: 980,
        }}
      >
        I build scalable software, intelligent data platforms, and AI-powered
        applications.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#34A876",
          marginTop: 40,
        }}
      >
        Omkar Vilas Chalke
      </div>
    </div>,
    { ...size }
  );
}
