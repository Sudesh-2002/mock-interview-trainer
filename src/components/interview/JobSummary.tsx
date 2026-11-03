import { Briefcase } from "lucide-react";
import type { JobContext } from "@/lib/schemas";

export function JobSummary({ job }: { job: JobContext }) {
  return (
    <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
            <Briefcase className="h-3.5 w-3.5" /> Practising for
          </p>
          <h2 className="mt-1 text-xl font-semibold">{job.title}</h2>
          {job.company && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {job.company}
            </p>
          )}
        </div>
        <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium capitalize text-indigo-500">
          {job.seniority} level
        </span>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800"
          >
            {skill}
          </li>
        ))}
      </ul>

      {job.responsibilities.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
          {job.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}