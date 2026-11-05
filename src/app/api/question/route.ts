import { NextRequest } from "next/server";
import { z } from "zod";
import { llm, LLM_MODEL } from "@/lib/llm";
import { buildQuestionMessages } from "@/lib/prompts";
import { CUSTOM_ROLE_SLUG, getRole } from "@/lib/roles";
import { jobContextSchema } from "@/lib/schemas";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const bodySchema = z.object({
  roleSlug: z.string().min(1),
  difficulty: z.enum(["junior", "mid", "senior"]),
  previousQuestions: z.array(z.string().max(500)).max(20).default([]),
  job: jobContextSchema.nullish(),
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
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const role = getRole(parsed.data.roleSlug);
  if (!role) {
    return Response.json({ error: "Unknown role" }, { status: 404 });
  }

  const isCustom = role.slug === CUSTOM_ROLE_SLUG;
  const job = isCustom ? (parsed.data.job ?? null) : null;
  if (isCustom && !job) {
    return Response.json(
      { error: "Analyze a job posting first." },
      { status: 400 }
    );
  }

  const limited = await enforceRateLimit(req, "question");
  if (limited) return limited;

  try {
    const completion = await llm.chat.completions.create(
      {
        model: LLM_MODEL,
        messages: buildQuestionMessages({
          role,
          difficulty: parsed.data.difficulty,
          previousQuestions: parsed.data.previousQuestions,
          job,
        }),
        temperature: 0.8,
        max_completion_tokens: 1000,
        reasoning_effort: "low",
        stream: true,
      },
      { signal: req.signal }
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
      cancel() {
        completion.controller.abort();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Question generation failed:", err);
    return Response.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}