import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
})
