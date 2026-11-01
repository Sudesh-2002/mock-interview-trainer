import { getRole } from "@/lib/roles";

interface RoleRow {
  roleSlug: string;
  answers: number;
  avgOverall: number;
}

export function RoleBreakdown({ rows }: { rows: RoleRow[] }) {
  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.roleSlug}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">
              {getRole(r.roleSlug)?.title ?? r.roleSlug}
            </span>
            <span className="tabular-nums text-slate-500">
              {r.avgOverall.toFixed(1)}/10 · {r.answers}{" "}
              {r.answers === 1 ? "answer" : "answers"}
            </span>
          </div>
          <div
            className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={r.avgOverall}
            aria-valuemin={0}
            aria-valuemax={10}
            aria-label={`${getRole(r.roleSlug)?.title ?? r.roleSlug} average score`}
          >
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${r.avgOverall * 10}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}