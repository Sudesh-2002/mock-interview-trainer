import { NextRequest } from "next/server";
import { z } from "zod";
import { extractJob, NotAJobPostingError } from "@/lib/extract-job";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const bodySchema = z.object({
  description: z.string().trim().min(100).max(8000),
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
      { error: "Paste the full job description (100 to 8000 characters)." },
      { status: 400 }
    );
  }

  const limited = await enforceRateLimit(req, "job");
  if (limited) return limited;

  try {
    const job = await extractJob(parsed.data.description, req.signal);
    return Response.json(job);
  } catch (err) {
    if (err instanceof NotAJobPostingError) {
      return Response.json(
        { error: "That doesn't look like a job posting. Paste the full description." },
        { status: 422 }
      );
    }
    console.error("Job analysis failed:", err);
    return Response.json(
      { error: "Could not analyze the posting. Please try again." },
      { status: 502 }
    );
  }
}