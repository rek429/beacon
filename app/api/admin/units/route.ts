import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { adminGuard, listResponse } from "../_helpers";

export async function GET() {
  const guard = adminGuard(); if (guard) return guard;
  const data = await db.query.units.findMany();
  return listResponse(data, data.length);
}

export async function POST(req: Request) {
  const guard = adminGuard(); if (guard) return guard;
  const body = await req.json();
  const [created] = await db.insert(units).values(body).returning();
  return NextResponse.json(created);
}
