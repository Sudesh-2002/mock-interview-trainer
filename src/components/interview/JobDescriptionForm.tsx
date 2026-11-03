"use client";

import { useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { JobContext } from "@/lib/schemas";

const MIN_CHARS = 100;
const MAX_CHARS = 8000;

export function JobDescriptionForm({
  onAnalyzed,
}: {
  onAnalyzed: (job: JobContext) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const length = text.trim().length;
  const tooShort = length < MIN_CHARS;

  async function analyze() {
    if (tooShort || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/job/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text.trim() }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Could not analyze the posting.");
      onAnalyzed(json as JobContext);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label htmlFor="job-description" className="mb-2 block text-sm font-medium">
        Paste the job description
      </label>
      <textarea
        id="job-description"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_CHARS}
        disabled={loading}
        rows={12}
        placeholder="Paste the full job posting here: title, responsibilities and requirements..."
        className="w-full resize-y rounded-xl border border-slate-300 bg-transparent p-4 text-base leading-relaxed outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700"
      />

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          {length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters ·
          the posting is analysed once and not stored
        </span>
        <Button onClick={analyze} disabled={tooShort || loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSearch className="mr-2 h-4 w-4" />
          )}
          {loading ? "Analysing..." : "Analyse posting"}
        </Button>
      </div>
    </div>
  );
}