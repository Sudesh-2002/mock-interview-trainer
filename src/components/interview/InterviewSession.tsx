"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnswerBox } from "@/components/interview/AnswerBox";
import { FeedbackCard } from "@/components/interview/FeedbackCard";
import { useQuestionStream } from "@/hooks/useQuestionStream";
import { useEvaluation } from "@/hooks/useEvaluation";
import { cn } from "@/lib/utils";
import type { Difficulty, Role } from "@/types";

const DIFFICULTIES: Difficulty[] = ["junior", "mid", "senior"];

export function InterviewSession({ role }: { role: Role }) {
  const [difficulty, setDifficulty] = useState<Difficulty>("mid");
  const [asked, setAsked] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const { question, status, error, generate } = useQuestionStream();
  const evaluation = useEvaluation();

  const isStreaming = status === "streaming";
  const isScoring = evaluation.status === "loading";
  const result = evaluation.status === "done" ? evaluation.data : null;
  const canAnswer = status === "done" && !result;

  async function handleGenerate() {
    evaluation.reset();
    setAnswer("");
    const text = await generate({
      roleSlug: role.slug,
      difficulty,
      previousQuestions: asked,
    });
    if (text) setAsked((prev) => [...prev, text]);
  }

  async function handleSubmit() {
    await evaluation.evaluate({
      roleSlug: role.slug,
      difficulty,
      question: question.trim(),
      answer: answer.trim(),
    });
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium">Difficulty</p>
        <div className="inline-flex rounded-lg border border-slate-300 p-1 dark:border-slate-700">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              disabled={isStreaming || isScoring}
              onClick={() => setDifficulty(d)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm capitalize transition-colors disabled:opacity-50",
                difficulty === d
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleGenerate} disabled={isStreaming || isScoring}>
        {isStreaming ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {asked.length === 0 ? "Generate question" : "Next question"}
      </Button>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {(question || isStreaming) && (
        <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Question {asked.length + (status === "done" ? 0 : 1)}
          </p>
          <p className="mt-2 text-lg leading-relaxed" aria-live="polite">
            {question}
            {isStreaming && (
              <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-indigo-500 align-middle" />
            )}
          </p>
        </div>
      )}

      {canAnswer && (
        <AnswerBox
          value={answer}
          onChange={setAnswer}
          onSubmit={handleSubmit}
          loading={isScoring}
        />
      )}

      {evaluation.error && (
        <p role="alert" className="text-sm text-red-500">
          {evaluation.error}
        </p>
      )}

      {result && <FeedbackCard evaluation={result} />}
    </div>
  );
}