import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Welcome, {session.user.name ?? session.user.email}. Your progress
        charts arrive in Step 7.
      </p>
    </div>
  );
}