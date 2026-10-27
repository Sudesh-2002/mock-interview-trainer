"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { QuestionRequest } from "@/types";

export type StreamStatus = "idle" | "streaming" | "done" | "error";

export function useQuestionStream() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (params: QuestionRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setQuestion("");
    setError(null);
    setStatus("streaming");

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setQuestion(full);
      }

      setStatus("done");
      return full.trim();
    } catch (err) {
      if ((err as Error).name === "AbortError") return null;
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      return null;
    }
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { question, status, error, generate };
}