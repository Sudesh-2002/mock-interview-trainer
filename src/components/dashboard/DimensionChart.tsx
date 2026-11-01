"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ACCENT, AXIS, GRID, tooltipProps } from "@/components/dashboard/chart-theme";

export interface DimensionPoint {
  label: string;
  score: number;
}

export function DimensionChart({ data }: { data: DimensionPoint[] }) {
  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label="Bar chart of your average score for each rubric dimension"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 32, bottom: 0, left: 8 }}
        >
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fill: AXIS, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={80}
            tick={{ fill: AXIS, fontSize: 13 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            {...tooltipProps}
            cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
            formatter={(value) => [`${value}/10`, "Average"]}
          />
          <Bar
            dataKey="score"
            fill={ACCENT}
            radius={[0, 4, 4, 0]}
            barSize={22}
            label={{ position: "right", fill: AXIS, fontSize: 12 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}