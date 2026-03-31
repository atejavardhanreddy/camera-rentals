const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log("Adding new columns to bookings table...");
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0.00;`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS logistics_charges DECIMAL(10,2) DEFAULT 0.00;`;
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS late_fees DECIMAL(10,2) DEFAULT 0.00;`;
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

main();
