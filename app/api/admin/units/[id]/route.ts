import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { adminGuard } from "../../_helpers";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const guard = adminGuard(); if (guard) return guard;
  const data = await db.query.units.findFirst({ where: eq(units.id, Number(params.id)) });
  if (!data) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Params) {
  const guard = adminGuard(); if (guard) return guard;
  const body = await req.json();
  const [updated] = await db.update(units).set(body).where(eq(units.id, Number(params.id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = adminGuard(); if (guard) return guard;
  const [deleted] = await db.delete(units).where(eq(units.id, Number(params.id))).returning();
  return NextResponse.json(deleted);
}
