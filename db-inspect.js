const { neon } = require("@neondatabase/serverless");

async function check() {
  const sql = neon("postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log("--- Tables ---");
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log(JSON.stringify(tables, null, 2));

  console.log("--- Bookings Columns ---");
  const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings'`;
  console.log(JSON.stringify(columns, null, 2));

  console.log("--- Booking Items Columns ---");
  const itemColumns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'booking_items'`;
  console.log(JSON.stringify(itemColumns, null, 2));
}

check();
