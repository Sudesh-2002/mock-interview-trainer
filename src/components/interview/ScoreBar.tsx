import { cn } from "@/lib/utils";

function barColor(score: number) {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  return "bg-red-500";
}

interface ScoreBarProps {
  label: string;
  score: number;
  reasoning: string;
}

export function ScoreBar({ label, score, reasoning }: ScoreBarProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-slate-500">{score}/10</span>
      </div>
      <div
        className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-all", barColor(score))}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
        {reasoning}
      </p>
    </div>
  );
}