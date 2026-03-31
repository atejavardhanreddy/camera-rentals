import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./db/schema"

// Create a SQL client with the connection string
const connectionString = process.env.DATABASE_URL
const isServer = typeof window === 'undefined';

if (!connectionString && isServer) {
  const envKeys = Object.keys(process.env).join(", ");
  console.error("CRITICAL: DATABASE_URL is undefined in process.env");
  console.error("Available ENV keys:", envKeys);
  throw new Error(`DATABASE_URL is missing. (Context: ${isServer ? 'Server' : 'Client'}). Ensure .env contains DATABASE_URL and restart the dev server.`);
}

export const sql = neon(connectionString || "")

// Create a Drizzle client with the SQL client and schema
export const db = drizzle(sql, { schema })

export { schema }
export * from "./db/schema"
