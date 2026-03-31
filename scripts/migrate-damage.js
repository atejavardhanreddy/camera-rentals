const { neon } = require("@neondatabase/serverless");

async function migrate() {
  const sql = neon("postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log("Adding damage_charges to bookings...");
  try {
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS damage_charges NUMERIC DEFAULT 0`;
    console.log("Success!");
  } catch (e) {
    console.error("Failed:", e);
  }
}

migrate();
