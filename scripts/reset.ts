import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  try {
    console.log("⚠️  Resetting database...");
    await db.delete(schema.userProgress);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.tracks);
    await db.delete(schema.familyGoals);
    await db.delete(schema.userSubscription);
    console.log("✅  Database reset.");
  } catch (e) {
    console.error(e);
    throw e;
  }
}

main();
