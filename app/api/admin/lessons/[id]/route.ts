import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { adminGuard } from "../../_helpers";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const guard = adminGuard(); if (guard) return guard;
  const data = await db.query.lessons.findFirst({ where: eq(lessons.id, Number(params.id)) });
  if (!data) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Params) {
  const guard = adminGuard(); if (guard) return guard;
  const body = await req.json();
  const [updated] = await db.update(lessons).set(body).where(eq(lessons.id, Number(params.id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = adminGuard(); if (guard) return guard;
  const [deleted] = await db.delete(lessons).where(eq(lessons.id, Number(params.id))).returning();
  return NextResponse.json(deleted);
}
