"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const createFamily = async (familyName: string, role: string) => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) throw new Error("Unauthorized");

  const familyId = `family_${userId}_${Date.now()}`;
  const inviteCode = generateCode();

  // Save invite to DB using raw SQL via neon
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    INSERT INTO family_invites (family_id, family_name, invite_code, created_by)
    VALUES (${familyId}, ${familyName}, ${inviteCode}, ${userId})
  `;

  await db.update(userProgress).set({
    familyId,
    familyRole: role as any,
    familyName,
  } as any).where(eq(userProgress.userId, userId));

  revalidatePath("/settings");
  revalidatePath("/leaderboard");
  return inviteCode;
};

export const joinFamily = async (inviteCode: string, role: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);

  const rows = await sql`
    SELECT * FROM family_invites WHERE invite_code = ${inviteCode}
  `;

  if (!rows || rows.length === 0) throw new Error("Invalid invite code");

  const invite = rows[0];

  await db.update(userProgress).set({
    familyId: invite.family_id,
    familyRole: role as any,
    familyName: invite.family_name,
  } as any).where(eq(userProgress.userId, userId));

  revalidatePath("/settings");
  revalidatePath("/leaderboard");
};

export const leaveFamily = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.update(userProgress).set({
    familyId: null,
    familyName: null,
  } as any).where(eq(userProgress.userId, userId));

  revalidatePath("/settings");
  revalidatePath("/leaderboard");
};