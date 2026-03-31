const { neon } = require("@neondatabase/serverless");

async function migrate() {
  const sql = neon("postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log("Adding maintenance columns and table...");
  try {
    // Add columns to equipment
    await sql`
      ALTER TABLE equipment 
      ADD COLUMN IF NOT EXISTS last_service_date TIMESTAMP WITH TIME ZONE;
    `;
    console.log("- last_service_date added if not exists.");

    await sql`
      ALTER TABLE equipment 
      ADD COLUMN IF NOT EXISTS next_service_due TIMESTAMP WITH TIME ZONE;
    `;
    console.log("- next_service_due added if not exists.");

    // Create maintenance logs table
    await sql`
      CREATE TABLE IF NOT EXISTS equipment_maintenance_logs (
        id SERIAL PRIMARY KEY,
        equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
        service_type TEXT NOT NULL,
        description TEXT,
        cost NUMERIC(12, 2) DEFAULT 0,
        performed_by TEXT,
        service_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completion_date TIMESTAMP WITH TIME ZONE,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("- equipment_maintenance_logs table created/ensured.");

    console.log("Success: Maintenance schema updates applied.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
