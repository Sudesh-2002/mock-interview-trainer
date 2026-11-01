import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative";
}

export function StatCard({ label, value, hint, tone = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p
        className={cn(
          "mt-1 text-3xl font-bold tabular-nums",
          tone === "positive" && "text-emerald-500",
          tone === "negative" && "text-red-500"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}