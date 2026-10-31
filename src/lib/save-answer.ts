import { and, eq } from "drizzle-orm";
import { answers, db, interviewSessions } from "@/db";
import type { Evaluation } from "@/lib/schemas";
import type { Difficulty } from "@/types";

interface SaveAnswerInput {
  userId: string;
  sessionId?: string | null;
  roleSlug: string;
  difficulty: Difficulty;
  question: string;
  answer: string;
  evaluation: Evaluation;
}

export async function saveAnswer(input: SaveAnswerInput): Promise<string> {
  const { userId, roleSlug, difficulty, question, answer, evaluation } = input;

  const answerValues = (sessionId: string) => ({
    sessionId,
    question,
    answer,
    structureScore: evaluation.dimensions.structure.score,
    clarityScore: evaluation.dimensions.clarity.score,
    relevanceScore: evaluation.dimensions.relevance.score,
    depthScore: evaluation.dimensions.depth.score,
    overall: evaluation.overall,
    evaluation,
  });

  if (input.sessionId) {
    const [existing] = await db
      .select({ id: interviewSessions.id })
      .from(interviewSessions)
      .where(
        and(
          eq(interviewSessions.id, input.sessionId),
          eq(interviewSessions.userId, userId),
          eq(interviewSessions.roleSlug, roleSlug),
          eq(interviewSessions.difficulty, difficulty)
        )
      )
      .limit(1);

    if (existing) {
      await db.insert(answers).values(answerValues(existing.id));
      return existing.id;
    }
  }

  const newId = crypto.randomUUID();
  await db.batch([
    db
      .insert(interviewSessions)
      .values({ id: newId, userId, roleSlug, difficulty }),
    db.insert(answers).values(answerValues(newId)),
  ]);
  return newId;
}