import { llm, LLM_MODEL } from "@/lib/llm";
import { buildEvaluationMessages } from "@/lib/prompts";
import { DIMENSIONS } from "@/lib/rubric";
import {
  evaluationSchema,
  type Evaluation,
  type RawEvaluation,
} from "@/lib/schemas";
import type { EvaluationRequest, Role } from "@/types";

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object found");
  return JSON.parse(text.slice(start, end + 1));
}

function withOverall(parsed: RawEvaluation): Evaluation {
  const scores = DIMENSIONS.map((d) => parsed.dimensions[d.key].score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return { ...parsed, overall: Math.round(avg * 10) / 10 };
}

export async function runEvaluation(
  role: Role,
  input: EvaluationRequest,
  signal?: AbortSignal
): Promise<Evaluation> {
  const messages = buildEvaluationMessages(role, input);

  for (let attempt = 0; attempt < 2; attempt++) {
    const completion = await llm.chat.completions.create(
      {
        model: LLM_MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      },
      { signal }
    );

    const raw = completion.choices[0]?.message?.content ?? "";
    try {
      return withOverall(evaluationSchema.parse(extractJson(raw)));
    } catch (err) {
      console.warn(`Evaluation parse failed (attempt ${attempt + 1}):`, err);
    }
  }

  throw new Error("Model returned an invalid evaluation");
}