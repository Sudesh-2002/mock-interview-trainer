import Link from "next/link";
import { AlertTriangle, CheckCircle2, LogIn } from "lucide-react";
import type { SaveStatus } from "@/types";

interface SaveNoticeProps {
  save: SaveStatus;
  sessionId: string | null;
  returnTo: string;
}

export function SaveNotice({ save, sessionId, returnTo }: SaveNoticeProps) {
  if (save === "saved" && sessionId) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        Saved to your history.{" "}
        <Link
          href={`/dashboard/history/${sessionId}`}
          className="text-indigo-500 hover:underline"
        >
          View session
        </Link>
      </p>
    );
  }

  if (save === "anonymous") {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <LogIn className="h-4 w-4 text-indigo-500" />
        <span>
          <Link
            href={`/sign-in?callbackUrl=${encodeURIComponent(returnTo)}`}
            className="text-indigo-500 hover:underline"
          >
            Sign in
          </Link>{" "}
          to save your answers and track your progress.
        </span>
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 text-sm text-amber-600">
      <AlertTriangle className="h-4 w-4" />
      Your score is shown above, but we couldn&apos;t save this answer.
    </p>
  );
}