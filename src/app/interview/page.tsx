import Link from "next/link";
import { getRole, ROLES } from "@/lib/roles";
import { buttonStyles } from "@/components/ui/Button";

export default async function InterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role: roleSlug } = await searchParams;
  const role = getRole(roleSlug);

  if (!role) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Pick a role to begin</h1>
        <ul className="mt-6 space-y-2">
          {ROLES.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/interview?role=${r.slug}`}
                className="text-indigo-500 hover:underline"
              >
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm text-slate-500">Interview session</p>
      <h1 className="text-3xl font-bold">{role.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Question streaming arrives in Step 2.
      </p>
      <Link href="/" className={buttonStyles("secondary", "mt-6")}>
        Back home
      </Link>
    </div>
  );
}