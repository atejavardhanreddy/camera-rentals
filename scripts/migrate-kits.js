const { neon } = require("@neondatabase/serverless");

async function migrate() {
  const sql = neon("postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log("Adding Kits & Bundles support...");
  try {
    // 1. Add is_kit column to equipment
    await sql`
      ALTER TABLE equipment ADD COLUMN IF NOT EXISTS is_kit BOOLEAN DEFAULT false;
    `;
    console.log("- Added is_kit column to equipment.");

    // 2. Create kit_items table
    await sql`
      CREATE TABLE IF NOT EXISTS kit_items (
        id SERIAL PRIMARY KEY,
        kit_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
        item_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log("- Created kit_items table.");

    console.log("Success: Kits & Bundles support added to database.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
