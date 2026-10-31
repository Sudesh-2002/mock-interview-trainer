import { and, avg, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { answers, db, interviewSessions } from "@/db";

const uuidSchema = z.string().uuid();

export async function getUserSessions(userId: string, limit = 50) {
  const rows = await db
    .select({
      id: interviewSessions.id,
      roleSlug: interviewSessions.roleSlug,
      difficulty: interviewSessions.difficulty,
      createdAt: interviewSessions.createdAt,
      answerCount: count(answers.id),
      avgOverall: avg(answers.overall),
    })
    .from(interviewSessions)
    .leftJoin(answers, eq(answers.sessionId, interviewSessions.id))
    .where(eq(interviewSessions.userId, userId))
    .groupBy(interviewSessions.id)
    .orderBy(desc(interviewSessions.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    ...r,
    avgOverall: r.avgOverall === null ? null : Number(r.avgOverall),
  }));
}

export async function getSessionWithAnswers(userId: string, sessionId: string) {
  if (!uuidSchema.safeParse(sessionId).success) return null;

  const found = await db.query.interviewSessions.findFirst({
    where: and(
      eq(interviewSessions.id, sessionId),
      eq(interviewSessions.userId, userId)
    ),
    with: {
      answers: {
        orderBy: (a, { asc }) => [asc(a.createdAt)],
      },
    },
  });

  return found ?? null;
}