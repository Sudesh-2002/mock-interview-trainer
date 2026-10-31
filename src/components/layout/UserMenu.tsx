import Link from "next/link";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { buttonStyles } from "@/components/ui/Button";

export async function UserMenu() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link href="/sign-in" className={buttonStyles("secondary", "py-2")}>
        Sign in
      </Link>
    );
  }

  const name = session.user.name ?? session.user.email ?? "User";

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="text-sm font-medium hover:text-indigo-500"
      >
        Dashboard
      </Link>
      <span
        title={name}
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white"
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          aria-label="Sign out"
          title="Sign out"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}