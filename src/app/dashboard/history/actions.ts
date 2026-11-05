"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db, interviewSessions } from "@/db";

export async function deleteSession(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) throw new Error("Invalid session id");

  await db
    .delete(interviewSessions)
    .where(
      and(
        eq(interviewSessions.id, id.data),
        eq(interviewSessions.userId, session.user.id)
      )
    );

  redirect("/dashboard/history");
}