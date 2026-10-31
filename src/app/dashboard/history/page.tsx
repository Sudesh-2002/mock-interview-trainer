import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buttonStyles } from "@/components/ui/Button";
import { getUserSessions } from "@/lib/queries";
import { getRole } from "@/lib/roles";

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard/history");

  const sessions = await getUserSessions(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/dashboard" className="text-sm text-indigo-500 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-2 text-3xl font-bold">Session history</h1>

      {sessions.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">
            No sessions yet. Answer a question while signed in and it will
            show up here.
          </p>
          <Link href="/interview" className={buttonStyles("primary", "mt-4")}>
            Start practicing
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/dashboard/history/${s.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-500 dark:border-slate-800"
              >
                <div>
                  <p className="font-medium">
                    {getRole(s.roleSlug)?.title ?? s.roleSlug}
                  </p>
                  <p className="text-sm capitalize text-slate-500">
                    {s.difficulty} · {dateFormat.format(s.createdAt)} ·{" "}
                    {s.answerCount} {s.answerCount === 1 ? "answer" : "answers"}
                  </p>
                </div>
                {s.avgOverall !== null && (
                  <p className="text-2xl font-bold tabular-nums text-indigo-500">
                    {s.avgOverall.toFixed(1)}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}