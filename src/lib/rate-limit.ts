import { lt, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db, rateLimits } from "@/db";

export type RateLimitScope = "question" | "evaluate" | "job";

const WINDOW_SECONDS = 60 * 60;

const LIMITS: Record<RateLimitScope, { anonymous: number; signedIn: number }> = {
  question: { anonymous: 20, signedIn: 60 },
  evaluate: { anonymous: 15, signedIn: 45 },
  job: { anonymous: 5, signedIn: 15 },
};

const GLOBAL_DAILY_LIMIT = 3000;

/** Atomically increments a counter and returns the new value. */
async function hit(key: string): Promise<number> {
  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1 })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: { count: sql`${rateLimits.count} + 1` },
    })
    .returning({ count: rateLimits.count });
  return row.count;
}

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function tooMany(message: string, retryAfterSeconds: number) {
  return Response.json(
    { error: message },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}

/**
 * Returns a 429 Response when the caller is over a limit, otherwise null.
 * Call it after validating input and before spending LLM tokens.
 * If the database check itself fails, the request is allowed (and logged)
 * so a hiccup doesn't take the whole app down.
 */
export async function enforceRateLimit(
  req: Request,
  scope: RateLimitScope
): Promise<Response | null> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const identity = userId ? `u:${userId}` : `ip:${clientIp(req)}`;
    const limit = userId ? LIMITS[scope].signedIn : LIMITS[scope].anonymous;

    const nowSeconds = Math.floor(Date.now() / 1000);
    const window = Math.floor(nowSeconds / WINDOW_SECONDS);
    const retryAfter = WINDOW_SECONDS - (nowSeconds % WINDOW_SECONDS);

    const used = await hit(`${scope}:${identity}:${window}`);
    if (used > limit) {
      const minutes = Math.ceil(retryAfter / 60);
      return tooMany(
        `You've reached the hourly limit for this feature. Try again in about ${minutes} ${minutes === 1 ? "minute" : "minutes"}${userId ? "." : ", or sign in for a higher limit."}`,
        retryAfter
      );
    }

    const day = Math.floor(nowSeconds / 86_400);
    const globalUsed = await hit(`global:${day}`);
    if (globalUsed > GLOBAL_DAILY_LIMIT) {
      return tooMany(
        "The demo has reached its daily usage limit. Please come back tomorrow.",
        86_400 - (nowSeconds % 86_400)
      );
    }

    if (Math.random() < 0.02) {
      const cutoff = new Date(Date.now() - 2 * 86_400_000);
      await db.delete(rateLimits).where(lt(rateLimits.createdAt, cutoff));
    }

    return null;
  } catch (err) {
    console.error("Rate limit check failed (allowing request):", err);
    return null;
  }
}