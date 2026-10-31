import type { Evaluation } from "@/lib/schemas";

export type Difficulty = "junior" | "mid" | "senior";

export interface Role {
  slug: string;
  title: string;
  description: string;
  topics: string[];
}

export interface QuestionRequest {
  roleSlug: string;
  difficulty: Difficulty;
  previousQuestions: string[];
}

export interface EvaluationRequest {
  roleSlug: string;
  difficulty: Difficulty;
  question: string;
  answer: string;
  sessionId?: string | null;
}

export type SaveStatus = "saved" | "anonymous" | "failed";

export interface EvaluateResponse {
  evaluation: Evaluation;
  sessionId: string | null;
  save: SaveStatus;
}