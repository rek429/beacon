import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { neon } from "@neondatabase/serverless";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { familyId } = await req.json();
  const sql = neon(process.env.DATABASE_URL!);

  const existing = await sql`
    SELECT invite_code FROM family_invites
    WHERE family_id = ${familyId}
    ORDER BY created_at DESC LIMIT 1
  `;

  if (existing.length > 0) {
    return NextResponse.json({ code: existing[0].invite_code });
  }

  const code = generateCode();
  await sql`
    INSERT INTO family_invites (family_id, family_name, invite_code, created_by)
    VALUES (${familyId}, '', ${code}, ${userId})
  `;

  return NextResponse.json({ code });
}