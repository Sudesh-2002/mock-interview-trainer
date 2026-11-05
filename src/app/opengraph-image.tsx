import { ImageResponse } from "next/og";

export const alt = "InterviewPrep: AI Mock Interview Trainer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, color: "#a5b4fc" }}>
          InterviewPrep
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 24,
          }}
        >
          Practice interviews. Get scored.
        </div>
        <div
          style={{ display: "flex", fontSize: 34, color: "#cbd5e1", marginTop: 32 }}
        >
          AI questions · rubric feedback · voice input · progress tracking
        </div>
      </div>
    ),
    { ...size }
  );
}