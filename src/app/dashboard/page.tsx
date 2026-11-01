import Link from "next/link";
import { redirect } from "next/navigation";
import { Target } from "lucide-react";
import { auth } from "@/auth";
import { buttonStyles } from "@/components/ui/Button";
import { DimensionChart } from "@/components/dashboard/DimensionChart";
import { RoleBreakdown } from "@/components/dashboard/RoleBreakdown";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { getDashboardStats } from "@/lib/queries";
import { DIMENSIONS } from "@/lib/rubric";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

const cardClass = "rounded-xl border border-slate-200 p-6 dark:border-slate-800";

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

function trendDelta(scores: number[]) {
  if (scores.length < 8) return null;
  const last = scores.slice(-5);
  const previous = scores.slice(-10, -5);
  return Math.round((mean(last) - mean(previous)) * 10) / 10;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");

  const { totals, dimensionAverages, recent, byRole } = await getDashboardStats(
    session.user.id
  );

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Welcome back, {session.user.name ?? session.user.email}.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard/history" className={buttonStyles("secondary")}>
          View history
        </Link>
        <Link href="/interview" className={buttonStyles("primary")}>
          Practice
        </Link>
      </div>
    </div>
  );

  if (totals.answers === 0 || !dimensionAverages) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        {header}
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-lg font-medium">No answers yet</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Answer a question while signed in and your progress will appear
            here.
          </p>
          <Link href="/interview" className={buttonStyles("primary", "mt-5")}>
            Start practicing
          </Link>
        </div>
      </div>
    );
  }

  const trend = recent.map((r, i) => ({
    n: i + 1,
    date: dateFormat.format(r.date),
    overall: r.overall,
  }));

  const delta = trendDelta(recent.map((r) => r.overall));

  const dimensionRows = DIMENSIONS.map((d) => ({
    key: d.key,
    label: d.label,
    tip: d.tip,
    score: dimensionAverages[d.key],
  }));
  const weakest = dimensionRows.reduce((min, d) =>
    d.score < min.score ? d : min
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-16">
      {header}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Answers" value={String(totals.answers)} />
        <StatCard label="Sessions" value={String(totals.sessions)} />
        <StatCard
          label="Average score"
          value={`${totals.avgOverall?.toFixed(1)}/10`}
        />
        <StatCard
          label="Recent trend"
          value={delta === null ? "–" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}
          hint={
            delta === null
              ? "Needs 8+ answers"
              : "Last 5 answers vs the 5 before"
          }
          tone={
            delta === null || delta === 0
              ? "default"
              : delta > 0
                ? "positive"
                : "negative"
          }
        />
      </div>

      <section className={cardClass}>
        <h2 className="font-semibold">Overall score over time</h2>
        <p className="mb-4 text-sm text-slate-500">
          Your last {trend.length} {trend.length === 1 ? "answer" : "answers"}
        </p>
        <ScoreTrendChart data={trend} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className={cardClass}>
          <h2 className="font-semibold">Average by dimension</h2>
          <p className="mb-4 text-sm text-slate-500">Across all answers</p>
          <DimensionChart
            data={dimensionRows.map((d) => ({ label: d.label, score: d.score }))}
          />
        </section>

        <section className={cardClass}>
          <h2 className="flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4 text-amber-500" />
            Focus area
          </h2>
          {totals.answers >= 3 ? (
            <>
              <p className="mt-4 text-2xl font-bold">{weakest.label}</p>
              <p className="text-sm text-slate-500">
                Your lowest average: {weakest.score.toFixed(1)}/10
              </p>
              <p className="mt-4 text-slate-700 dark:text-slate-300">
                {weakest.tip}
              </p>
            </>
          ) : (
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Answer at least 3 questions to see which dimension needs the most
              work.
            </p>
          )}
        </section>
      </div>

      <section className={cardClass}>
        <h2 className="font-semibold">By role</h2>
        <p className="mb-4 text-sm text-slate-500">
          Average overall score for each role you practised
        </p>
        <RoleBreakdown rows={byRole} />
      </section>
    </div>
  );
}