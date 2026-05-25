import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { tracks } from "@/db/schema";
import { adminGuard, listResponse } from "../_helpers";

export async function GET() {
  const guard = adminGuard(); if (guard) return guard;
  const data = await db.query.tracks.findMany();
  return listResponse(data, data.length);
}

export async function POST(req: Request) {
  const guard = adminGuard(); if (guard) return guard;
  const body = await req.json();
  const [created] = await db.insert(tracks).values(body).returning();
  return NextResponse.json(created);
}
