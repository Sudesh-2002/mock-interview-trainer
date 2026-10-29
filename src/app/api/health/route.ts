import { count } from "drizzle-orm";
import { db, users } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json(
      { ok: false, error: "DATABASE_URL is missing" },
      { status: 500 }
    );
  }

  try {
    await db.select({ total: count() }).from(users);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err);
    return Response.json(
      { ok: false, error: "Database unreachable or not migrated" },
      { status: 500 }
    );
  }
}