import Link from "next/link";
import { ROLES } from "@/lib/roles";
import { buttonStyles } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Practice interviews. <span className="text-indigo-500">Get scored.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Pick a role, answer AI-generated questions, and get structured feedback
          on clarity, structure, and depth.
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

      <section id="roles" className="mt-20">
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
    </div>
  );
}