import { and, avg, count, countDistinct, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { answers, db, interviewSessions } from "@/db";

const uuidSchema = z.string().uuid();

const round1 = (n: number) => Math.round(n * 10) / 10;
const toNumber = (v: string | null) => (v === null ? null : Number(v));

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

  return rows.map((r) => ({ ...r, avgOverall: toNumber(r.avgOverall) }));
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

export interface DashboardStats {
  totals: {
    answers: number;
    sessions: number;
    avgOverall: number | null;
  };
  dimensionAverages: {
    structure: number;
    clarity: number;
    relevance: number;
    depth: number;
  } | null;
  recent: { date: Date; overall: number }[];
  byRole: { roleSlug: string; answers: number; avgOverall: number }[];
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const mine = eq(interviewSessions.userId, userId);
  const joinSessions = eq(answers.sessionId, interviewSessions.id);

  const [totalsRows, recentRows, roleRows] = await Promise.all([
    db
      .select({
        answerCount: count(answers.id),
        sessionCount: countDistinct(answers.sessionId),
        overall: avg(answers.overall),
        structure: avg(answers.structureScore),
        clarity: avg(answers.clarityScore),
        relevance: avg(answers.relevanceScore),
        depth: avg(answers.depthScore),
      })
      .from(answers)
      .innerJoin(interviewSessions, joinSessions)
      .where(mine),

    db
      .select({ createdAt: answers.createdAt, overall: answers.overall })
      .from(answers)
      .innerJoin(interviewSessions, joinSessions)
      .where(mine)
      .orderBy(desc(answers.createdAt))
      .limit(30),

    db
      .select({
        roleSlug: interviewSessions.roleSlug,
        answerCount: count(answers.id),
        overall: avg(answers.overall),
      })
      .from(answers)
      .innerJoin(interviewSessions, joinSessions)
      .where(mine)
      .groupBy(interviewSessions.roleSlug)
      .orderBy(desc(count(answers.id))),
  ]);

  const t = totalsRows[0];
  const hasAnswers = t.answerCount > 0;

  return {
    totals: {
      answers: t.answerCount,
      sessions: t.sessionCount,
      avgOverall: hasAnswers ? round1(Number(t.overall)) : null,
    },
    dimensionAverages: hasAnswers
      ? {
          structure: round1(Number(t.structure)),
          clarity: round1(Number(t.clarity)),
          relevance: round1(Number(t.relevance)),
          depth: round1(Number(t.depth)),
        }
      : null,
    recent: recentRows
      .map((r) => ({ date: r.createdAt, overall: r.overall }))
      .reverse(),
    byRole: roleRows.map((r) => ({
      roleSlug: r.roleSlug,
      answers: r.answerCount,
      avgOverall: round1(Number(r.overall)),
    })),
  };
}