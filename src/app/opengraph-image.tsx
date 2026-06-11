import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CASA — Estudio Audiovisual · Sentite en casa.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F7F2E9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#9B8E85",
            textTransform: "uppercase",
            letterSpacing: 8,
            marginBottom: 48,
          }}
        >
          Villa Crespo · Buenos Aires
        </div>
        <div
          style={{
            fontSize: 220,
            color: "#1C1714",
            letterSpacing: 80,
            textIndent: 80,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          CASA
        </div>
        <div
          style={{
            width: 120,
            height: 2,
            background: "#B5623E",
            marginTop: 40,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 44,
            color: "#9B8E85",
            fontStyle: "italic",
          }}
        >
          Sentite en casa.
        </div>
      </div>
    ),
    { ...size },
  );
}
