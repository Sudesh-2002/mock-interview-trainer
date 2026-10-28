import { CheckCircle2, TrendingUp } from "lucide-react";
import { ScoreBar } from "@/components/interview/ScoreBar";
import { DIMENSIONS } from "@/lib/rubric";
import type { Evaluation } from "@/lib/schemas";

function verdict(overall: number) {
  if (overall >= 8) return "Strong answer";
  if (overall >= 6) return "Solid answer";
  if (overall >= 4) return "Needs work";
  return "Weak answer";
}

export function FeedbackCard({ evaluation }: { evaluation: Evaluation }) {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Overall</p>
          <p className="text-lg font-semibold">{verdict(evaluation.overall)}</p>
        </div>
        <p className="text-4xl font-bold tabular-nums text-indigo-500">
          {evaluation.overall.toFixed(1)}
          <span className="text-lg text-slate-500">/10</span>
        </p>
      </div>

      <div className="space-y-5">
        {DIMENSIONS.map((d) => (
          <ScoreBar
            key={d.key}
            label={d.label}
            score={evaluation.dimensions[d.key].score}
            reasoning={evaluation.dimensions[d.key].reasoning}
          />
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> What worked
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
            {evaluation.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-amber-500" /> To improve
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
            {evaluation.improvements.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <details className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
        <summary className="cursor-pointer text-sm font-semibold">
          See a stronger version of your answer
        </summary>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {evaluation.improvedAnswer}
        </p>
      </details>
    </div>
  );
}