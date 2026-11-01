export const AXIS = "#94a3b8";
export const GRID = "rgba(148, 163, 184, 0.25)";
export const ACCENT = "#6366f1";

export const tooltipProps = {
  contentStyle: {
    background: "var(--background)",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    borderRadius: 8,
    fontSize: 13,
  },
  labelStyle: { color: "var(--foreground)" },
  itemStyle: { color: "var(--foreground)" },
} as const;