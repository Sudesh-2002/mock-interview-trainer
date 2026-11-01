"use client";

import { useCallback, useEffect, useRef } from "react";
import { Loader2, Mic, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { MAX_ANSWER_CHARS, MIN_ANSWER_CHARS } from "@/lib/rubric";
import { buildSpeechStats, type SpeechStats } from "@/lib/speech-metrics";
import { cn } from "@/lib/utils";

interface AnswerBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (speech: SpeechStats | null) => void;
  loading: boolean;
}

export function AnswerBox({ value, onChange, onSubmit, loading }: AnswerBoxProps) {
  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const tooShort = trimmed.length < MIN_ANSWER_CHARS;

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleSpeech = useCallback(
    (segment: string) => {
      const current = valueRef.current;
      const separator = current.length > 0 && !/\s$/.test(current) ? " " : "";
      const next = (current + separator + segment).slice(0, MAX_ANSWER_CHARS);
      valueRef.current = next;
      onChange(next);
    },
    [onChange]
  );

  const speech = useSpeechRecognition({ onFinalText: handleSpeech });

  const canSubmit = !tooShort && !loading && !speech.listening;

  function submit() {
    if (!canSubmit) return;
    onSubmit(buildSpeechStats(speech.spokenText, speech.listeningSeconds));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor="answer" className="text-sm font-medium">
          Your answer
        </label>

        {speech.supported && (
          <button
            type="button"
            onClick={speech.listening ? speech.stop : speech.start}
            disabled={loading}
            aria-pressed={speech.listening}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
              speech.listening
                ? "border-red-500 text-red-500"
                : "border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            )}
          >
            {speech.listening ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                <Square className="h-3.5 w-3.5" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Dictate
              </>
            )}
          </button>
        )}
      </div>

      <textarea
        id="answer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit();
        }}
        maxLength={MAX_ANSWER_CHARS}
        disabled={loading}
        rows={8}
        placeholder="Type your answer, or press Dictate and speak it as if you were in the interview..."
        className="w-full resize-y rounded-xl border border-slate-300 bg-transparent p-4 text-base leading-relaxed outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-700"
      />

      {speech.listening && (
        <div className="mt-2 text-sm">
          <p className="italic text-slate-500">
            {speech.interim || "Listening..."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Audio is processed by your browser&apos;s speech service.
          </p>
        </div>
      )}

      {speech.error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {speech.error}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {words} {words === 1 ? "word" : "words"} · Ctrl+Enter to submit
        </span>
        <Button onClick={submit} disabled={!canSubmit}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {loading ? "Scoring..." : speech.listening ? "Stop recording first" : "Submit answer"}
        </Button>
      </div>
    </div>
  );
}