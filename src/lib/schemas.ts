import { z } from "zod";

const score = z.number().int().min(0).max(10);

const dimension = z.object({
  score,
  reasoning: z.string().min(1).max(500),
});

export const evaluationSchema = z.object({
  dimensions: z.object({
    structure: dimension,
    clarity: dimension,
    relevance: dimension,
    depth: dimension,
  }),
  strengths: z.array(z.string().min(1).max(300)).min(1).max(3),
  improvements: z.array(z.string().min(1).max(300)).min(1).max(3),
  improvedAnswer: z.string().min(1).max(2000),
});

export type RawEvaluation = z.infer<typeof evaluationSchema>;
export type Evaluation = RawEvaluation & { overall: number };