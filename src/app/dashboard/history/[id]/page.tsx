import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { FeedbackCard } from "@/components/interview/FeedbackCard";
import { getSessionWithAnswers } from "@/lib/queries";
import { getRole } from "@/lib/roles";

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/dashboard/history/${id}`)}`);
  }

  const data = await getSessionWithAnswers(session.user.id, id);
  if (!data) notFound();

  const role = getRole(data.roleSlug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/dashboard/history"
        className="text-sm text-indigo-500 hover:underline"
      >
        ← All sessions
      </Link>
      <h1 className="mt-2 text-3xl font-bold">
        {role?.title ?? data.roleSlug}
      </h1>
      <p className="mt-1 text-sm capitalize text-slate-500">
        {data.difficulty} · {dateFormat.format(data.createdAt)} ·{" "}
        {data.answers.length} {data.answers.length === 1 ? "answer" : "answers"}
      </p>

      <div className="mt-10 space-y-12">
        {data.answers.map((a, i) => (
          <section key={a.id} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Question {i + 1}
              </p>
              <p className="mt-1 text-lg leading-relaxed">{a.question}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Your answer
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {a.answer}
              </p>
            </div>
            <FeedbackCard evaluation={a.evaluation} />
          </section>
        ))}
      </div>
    </div>
  );
}