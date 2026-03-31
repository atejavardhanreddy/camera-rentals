const { neon } = require("@neondatabase/serverless");

async function migrate() {
  const sql = neon("postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log("Creating RMS tables...");
  try {
    // 1. Clients Table (Service-based business terminology)
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        id_proof_url TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("- Clients table created/ensured.");

    // Bookings Table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id),
        status TEXT DEFAULT 'pending', -- pending, confirmed, out, returned, cancelled
        total_amount NUMERIC(12, 2) DEFAULT 0,
        paid_amount NUMERIC(12, 2) DEFAULT 0,
        discount NUMERIC(12, 2) DEFAULT 0,
        logistics_charges NUMERIC(12, 2) DEFAULT 0,
        late_fees NUMERIC(12, 2) DEFAULT 0,
        damage_charges NUMERIC(12, 2) DEFAULT 0,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("- Bookings table created/ensured.");

    // Booking Items Table
    await sql`
      CREATE TABLE IF NOT EXISTS booking_items (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        equipment_id INTEGER REFERENCES equipment(id),
        quantity INTEGER DEFAULT 1,
        unit_price NUMERIC(12, 2),
        subtotal NUMERIC(12, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("- Booking Items table created/ensured.");

    console.log("Success: All RMS tables are ready.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
