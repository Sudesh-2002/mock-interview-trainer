"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Evaluation } from "@/lib/schemas";
import type { EvaluationRequest } from "@/types";

export type EvaluationStatus = "idle" | "loading" | "done" | "error";

export function useEvaluation() {
  const [data, setData] = useState<Evaluation | null>(null);
  const [status, setStatus] = useState<EvaluationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const evaluate = useCallback(async (params: EvaluationRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setData(null);
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Request failed");

      setData(json as Evaluation);
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setData(null);
    setError(null);
    setStatus("idle");
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { data, status, error, evaluate, reset };
}