import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_9XWygLHiY0Ix@ep-little-wildflower-aq84xl2x.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
} satisfies Config;