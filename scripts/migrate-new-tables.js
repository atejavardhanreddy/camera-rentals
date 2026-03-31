const { neon } = require('@neondatabase/serverless')

const sql = neon('postgresql://neondb_owner:npg_D9f8ORezlVrK@ep-fragrant-sky-a1wacf0n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS company_settings (
      id SERIAL PRIMARY KEY,
      company_name TEXT NOT NULL DEFAULT 'D''RENTALS',
      tagline TEXT DEFAULT 'Premium Cinema Collective',
      address TEXT DEFAULT '',
      city TEXT DEFAULT '',
      state TEXT DEFAULT '',
      pincode TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      gstin TEXT DEFAULT '',
      logo_url TEXT,
      invoice_prefix TEXT DEFAULT 'INV-DR',
      bank_name TEXT DEFAULT '',
      account_name TEXT DEFAULT '',
      account_number TEXT DEFAULT '',
      ifsc_code TEXT DEFAULT '',
      upi_id TEXT DEFAULT '',
      payment_instructions TEXT DEFAULT '',
      invoice_terms TEXT DEFAULT '1. Equipment must be returned in the same condition as issued.',
      agreement_header TEXT DEFAULT 'This Rental Agreement is entered into between D''RENTALS and the Renter named below.',
      agreement_terms TEXT DEFAULT '1. The renter agrees to use the equipment in a lawful and responsible manner.',
      security_deposit_policy TEXT DEFAULT 'A security deposit is required for all rentals.',
      late_fee_multiplier NUMERIC(4,2) DEFAULT 1.5,
      advance_percent_required INTEGER DEFAULT 50,
      minimum_rental_days INTEGER DEFAULT 1,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `
  console.log('✓ company_settings table created/exists')

  await sql`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      method TEXT NOT NULL,
      reference TEXT,
      notes TEXT,
      recorded_at TIMESTAMP DEFAULT NOW() NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `
  console.log('✓ payment_transactions table created/exists')

  await sql`
    CREATE TABLE IF NOT EXISTS security_deposits (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      method TEXT NOT NULL DEFAULT 'cash',
      reference TEXT,
      status TEXT NOT NULL DEFAULT 'held',
      returned_at TIMESTAMP,
      return_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `
  console.log('✓ security_deposits table created/exists')
  
  console.log('\nAll tables created successfully!')
}

migrate().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
