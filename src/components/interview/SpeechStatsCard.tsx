import { Gauge, Mic, Timer } from "lucide-react";
import { formatDuration, paceLabel, type SpeechStats } from "@/lib/speech-metrics";

export function SpeechStatsCard({ stats }: { stats: SpeechStats }) {
  return (
    <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
      <h3 className="flex items-center gap-2 font-semibold">
        <Mic className="h-4 w-4 text-indigo-500" />
        Speaking stats
      </h3>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500">
            <Gauge className="h-3.5 w-3.5" /> Pace
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {stats.wpm === null ? "–" : stats.wpm}
            {stats.wpm !== null && (
              <span className="ml-1 text-sm font-normal text-slate-500">wpm</span>
            )}
          </p>
          <p className="text-xs text-slate-500">
            {stats.wpm === null
              ? "Needs 10+ words and 10+ seconds"
              : paceLabel(stats.wpm)}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500">
            <Timer className="h-3.5 w-3.5" /> Time
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {formatDuration(stats.seconds)}
          </p>
          <p className="text-xs text-slate-500">{stats.words} words spoken</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Filler words
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {stats.fillerTotal}
          </p>
          <p className="text-xs text-slate-500">
            {stats.fillerTotal === 0 ? "None detected" : "Try to trim these"}
          </p>
        </div>
      </div>

      {stats.fillers.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {stats.fillers.map((f) => (
            <li
              key={f.label}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800"
            >
              {f.label} × {f.count}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Based on the dictated part of your answer only. Pace includes thinking
        pauses, so it reads lower than your true speaking rate. Filler
        detection is approximate, and browsers often leave out &ldquo;um&rdquo;
        and &ldquo;uh&rdquo; when transcribing.
      </p>
    </div>
  );
}