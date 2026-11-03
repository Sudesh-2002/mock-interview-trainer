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

function clean(value: string, max: number) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

const text = (max: number) =>
  z
    .string()
    .transform((s) => clean(s, max))
    .pipe(z.string().min(1));

export const jobContextSchema = z.object({
  title: text(80),
  company: z
    .string()
    .nullish()
    .transform((s) => (s ? clean(s, 80) || null : null)),
  seniority: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.enum(["junior", "mid", "senior"])),
  skills: z
    .array(text(40))
    .min(1)
    .transform((a) => a.slice(0, 12)),
  responsibilities: z
    .array(text(160))
    .default([])
    .transform((a) => a.slice(0, 6)),
});

export type JobContext = z.infer<typeof jobContextSchema>;

export function jobLabel(job: JobContext) {
  return job.company ? `${job.title} at ${job.company}` : job.title;
}