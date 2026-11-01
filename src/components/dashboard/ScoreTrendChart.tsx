"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ACCENT, AXIS, GRID, tooltipProps } from "@/components/dashboard/chart-theme";

export interface TrendPoint {
  n: number;
  date: string;
  overall: number;
}

export function ScoreTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label="Line chart of the overall score for your most recent answers"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            dataKey="n"
            tick={{ fill: AXIS, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fill: AXIS, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            {...tooltipProps}
            labelFormatter={(label) => {
              const point = data.find((d) => d.n === Number(label));
              return `Answer ${label}${point ? ` · ${point.date}` : ""}`;
            }}
            formatter={(value) => [`${value}/10`, "Overall"]}
          />
          <Line
            type="monotone"
            dataKey="overall"
            stroke={ACCENT}
            strokeWidth={2}
            dot={{ r: 3, fill: ACCENT }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}