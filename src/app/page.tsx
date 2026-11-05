import Link from "next/link";
import { Briefcase, ListChecks, Mic, TrendingUp } from "lucide-react";
import { ROLES } from "@/lib/roles";
import { buttonStyles } from "@/components/ui/Button";

const STEPS = [
  {
    title: "Pick a role",
    text: "Choose a role and level, or paste a real job posting to get questions tailored to it.",
  },
  {
    title: "Answer in writing or out loud",
    text: "Type your answer or dictate it, just as you would in the interview.",
  },
  {
    title: "Get scored, then improve",
    text: "Receive rubric feedback with a stronger rewrite, then watch your progress build.",
  },
];

const FEATURES = [
  {
    icon: ListChecks,
    title: "Structured scoring",
    text: "Every answer is scored on structure, clarity, relevance and depth, with reasoning you can act on.",
  },
  {
    icon: Briefcase,
    title: "Job-posting mode",
    text: "Paste a job description and the questions follow the skills that employer actually asks for.",
  },
  {
    icon: Mic,
    title: "Voice practice",
    text: "Dictate your answers and see your speaking pace and filler words afterwards.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    text: "Sign in with GitHub to save sessions and see score trends and your weakest area.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Practice interviews. <span className="text-indigo-500">Get scored.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Pick a role, answer AI-generated questions, and get structured
          feedback on clarity, structure, and depth. No sign-up needed to try
          it.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/interview" className={buttonStyles("primary")}>
            Start practicing
          </Link>
          <Link href="#roles" className={buttonStyles("secondary")}>
            Browse roles
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="roles" className="mt-20 scroll-mt-8">
        <h2 className="text-2xl font-semibold">Choose a role</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <Link
              key={role.slug}
              href={`/interview?role=${role.slug}`}
              className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-500 hover:shadow-md dark:border-slate-800"
            >
              <h3 className="font-semibold">{role.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {role.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {role.topics.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs dark:bg-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold">What you get</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10">
                <Icon className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}