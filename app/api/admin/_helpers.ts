import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export function adminGuard() {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return null;
}

export function listResponse(data: unknown[], total: number) {
  return NextResponse.json(data, {
    headers: {
      "X-Total-Count": String(total),
      "Content-Range": `items 0-${total}/${total}`,
      "Access-Control-Expose-Headers": "Content-Range, X-Total-Count",
    },
  });
}