import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { runEvaluation } from "@/lib/evaluate";
import { getRole } from "@/lib/roles";
import { MAX_ANSWER_CHARS, MIN_ANSWER_CHARS } from "@/lib/rubric";
import { saveAnswer } from "@/lib/save-answer";
import type { EvaluateResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  roleSlug: z.string().min(1),
  difficulty: z.enum(["junior", "mid", "senior"]),
  question: z.string().trim().min(5).max(500),
  answer: z.string().trim().min(MIN_ANSWER_CHARS).max(MAX_ANSWER_CHARS),
  sessionId: z.string().uuid().nullish(),
});

export async function POST(req: NextRequest) {
  if (!process.env.LLM_API_KEY) {
    return Response.json(
      { error: "Server is missing LLM_API_KEY" },
      { status: 500 }
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: `Answer must be ${MIN_ANSWER_CHARS}-${MAX_ANSWER_CHARS} characters.` },
      { status: 400 }
    );
  }

  const role = getRole(parsed.data.roleSlug);
  if (!role) {
    return Response.json({ error: "Unknown role" }, { status: 404 });
  }

  let evaluation;
  try {
    evaluation = await runEvaluation(role, parsed.data, req.signal);
  } catch (err) {
    console.error("Evaluation failed:", err);
    return Response.json(
      { error: "Could not score your answer. Please try again." },
      { status: 502 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    const body: EvaluateResponse = {
      evaluation,
      sessionId: null,
      save: "anonymous",
    };
    return Response.json(body);
  }

  try {
    const sessionId = await saveAnswer({
      userId,
      sessionId: parsed.data.sessionId,
      roleSlug: parsed.data.roleSlug,
      difficulty: parsed.data.difficulty,
      question: parsed.data.question,
      answer: parsed.data.answer,
      evaluation,
    });
    const body: EvaluateResponse = { evaluation, sessionId, save: "saved" };
    return Response.json(body);
  } catch (err) {
    console.error("Saving answer failed:", err);
    const body: EvaluateResponse = {
      evaluation,
      sessionId: parsed.data.sessionId ?? null,
      save: "failed",
    };
    return Response.json(body);
  }
}