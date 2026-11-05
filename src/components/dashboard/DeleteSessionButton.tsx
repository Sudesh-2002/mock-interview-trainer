"use client";

import { Trash2 } from "lucide-react";
import { deleteSession } from "@/app/dashboard/history/actions";

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  return (
    <form
      action={deleteSession}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Delete this session and all its answers? This cannot be undone."
          )
        ) {
          e.preventDefault();
        }
      }}
      className="mt-4"
    >
      <input type="hidden" name="id" value={sessionId} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
      >
        <Trash2 className="h-4 w-4" />
        Delete session
      </button>
    </form>
  );
}