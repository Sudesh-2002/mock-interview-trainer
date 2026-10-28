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
}