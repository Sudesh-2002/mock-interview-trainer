"use client";

import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MAX_ANSWER_CHARS, MIN_ANSWER_CHARS } from "@/lib/rubric";

interface AnswerBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function AnswerBox({ value, onChange, onSubmit, loading }: AnswerBoxProps) {
  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const tooShort = trimmed.length < MIN_ANSWER_CHARS;

  return (
    <div>
      <label htmlFor="answer" className="mb-2 block text-sm font-medium">
        Your answer
      </label>
      <textarea
        id="answer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !tooShort && !loading) {
            onSubmit();
          }
        }}
        maxLength={MAX_ANSWER_CHARS}
        disabled={loading}
        rows={8}
        placeholder="Type your answer as if you were speaking in the interview..."
        className="w-full resize-y rounded-xl border border-slate-300 bg-transparent p-4 text-base leading-relaxed outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {words} {words === 1 ? "word" : "words"} · Ctrl+Enter to submit
        </span>
        <Button onClick={onSubmit} disabled={tooShort || loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {loading ? "Scoring..." : "Submit answer"}
        </Button>
      </div>
    </div>
  );
}