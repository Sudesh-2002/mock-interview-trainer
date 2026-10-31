import { NextRequest } from "next/server";
import { z } from "zod";
import { llm, LLM_MODEL } from "@/lib/llm";
import { buildQuestionMessages } from "@/lib/prompts";
import { getRole } from "@/lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  roleSlug: z.string().min(1),
  difficulty: z.enum(["junior", "mid", "senior"]),
  previousQuestions: z.array(z.string().max(500)).max(20).default([]),
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

  try {
    const completion = await llm.chat.completions.create(
      {
        model: LLM_MODEL,
        messages: buildQuestionMessages({
          role,
          difficulty: parsed.data.difficulty,
          previousQuestions: parsed.data.previousQuestions,
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