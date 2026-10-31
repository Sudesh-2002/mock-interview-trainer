import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buttonStyles } from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Welcome, {session.user.name ?? session.user.email}. Progress charts
        arrive in Step 7.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/history" className={buttonStyles("primary")}>
          View history
        </Link>
        <Link href="/interview" className={buttonStyles("secondary")}>
          Practice
        </Link>
      </div>
    </div>
  );
}