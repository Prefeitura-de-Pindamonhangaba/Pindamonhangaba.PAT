import { and, eq, gt, lte } from "drizzle-orm";
import { db } from "@/shared/lib/db/client";
import { sessions } from "../models/session-schema";

export async function createSession(session: typeof sessions.$inferInsert) {
  await db().transaction(async (tx) => {
    await tx.delete(sessions).where(lte(sessions.expiresAt, new Date()));
    await tx.insert(sessions).values(session);
  });
}

export async function findSession(digest: string) {
  const [session] = await db()
    .select()
    .from(sessions)
    .where(
      and(eq(sessions.digest, digest), gt(sessions.expiresAt, new Date())),
    );
  return session;
}

export async function revokeSession(digest: string) {
  await db().delete(sessions).where(eq(sessions.digest, digest));
}
