import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/Button";
import { safeRedirectPath } from "@/lib/utils";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const target = safeRedirectPath(callbackUrl);

  const session = await auth();
  if (session?.user) redirect(target);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Save your sessions and track your progress over time.
      </p>

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-500">
          Sign-in failed. Please try again.
        </p>
      )}

      <form
        className="mt-8"
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: target });
        }}
      >
        <Button type="submit" className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </form>
    </div>
  );
}