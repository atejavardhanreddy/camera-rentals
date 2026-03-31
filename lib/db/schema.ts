import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  numeric, 
  boolean, 
  jsonb,
  varchar
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const equipmentCategories = pgTable("equipment_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => equipmentCategories.id).notNull(),
  name: text("name").notNull(),
  brand: text("brand"),
  model: text("model"),
  slug: text("slug").unique(),
  description: text("description"),
  specifications: jsonb("specifications"),
  dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: numeric("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: numeric("monthly_rate", { precision: 10, scale: 2 }),
  purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }),
  soldPrice: numeric("sold_price", { precision: 12, scale: 2 }),
  condition: text("condition"),
  status: text("status").default("available").notNull(), // available, rented, maintenance, retired, sold
  featured: boolean("featured").default(false).notNull(),
  isKit: boolean("is_kit").default(false).notNull(),
  mainImageUrl: text("main_image_url"),
  lastServiceDate: timestamp("last_service_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const equipmentImages = pgTable("equipment_images", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").references(() => equipment.id).notNull(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  idProofUrl: text("id_proof_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, out, returned, cancelled
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0").notNull(),
  logisticsCharges: numeric("logistics_charges", { precision: 12, scale: 2 }).default("0").notNull(),
  lateFees: numeric("late_fees", { precision: 12, scale: 2 }).default("0").notNull(),
  damageCharges: numeric("damage_charges", { precision: 12, scale: 2 }).default("0").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const bookingItems = pgTable("booking_items", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  equipmentId: integer("equipment_id").references(() => equipment.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
})

export const equipmentMaintenanceLogs = pgTable("equipment_maintenance_logs", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").references(() => equipment.id).notNull(),
  serviceType: text("service_type").notNull(),
  description: text("description").notNull(),
  serviceDate: timestamp("service_date").defaultNow().notNull(),
  completionDate: timestamp("completion_date"),
  cost: numeric("cost", { precision: 10, scale: 2 }).default("0"),
  performedBy: text("performed_by"),
  status: text("status").default("pending").notNull(), // pending, in_progress, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // Rent, Salaries, Marketing, Utilities, Other
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  status: text("status").default("paid").notNull(), // paid, pending
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const kitItems = pgTable("kit_items", {
  id: serial("id").primaryKey(),
  kitId: integer("kit_id").references(() => equipment.id, { onDelete: 'cascade' }).notNull(),
  itemId: integer("item_id").references(() => equipment.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Company Settings (singleton) ───────────────────────────────────────────
export const companySettings = pgTable("company_settings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").default("D'RENTALS").notNull(),
  tagline: text("tagline").default("Premium Cinema Collective"),
  address: text("address").default(""),
  city: text("city").default(""),
  state: text("state").default(""),
  pincode: text("pincode").default(""),
  phone: text("phone").default(""),
  email: text("email").default(""),
  gstin: text("gstin").default(""),
  logoUrl: text("logo_url"),
  invoicePrefix: text("invoice_prefix").default("INV-DR"),
  // Bank / Payment details
  bankName: text("bank_name").default(""),
  accountName: text("account_name").default(""),
  accountNumber: text("account_number").default(""),
  ifscCode: text("ifsc_code").default(""),
  upiId: text("upi_id").default(""),
  paymentInstructions: text("payment_instructions").default(""),
  // Agreement / Invoice templates
  invoiceTerms: text("invoice_terms").default("1. Equipment must be returned in the same condition as issued.\n2. Late returns attract 1.5× daily rate per day.\n3. Damage charges will be assessed on return.\n4. This document constitutes a legal rental contract."),
  agreementHeader: text("agreement_header").default("This Rental Agreement is entered into between D'RENTALS and the Renter named below."),
  agreementTerms: text("agreement_terms").default("1. The renter agrees to use the equipment in a lawful and responsible manner.\n2. Any damage, loss or theft of equipment will be the renter's full financial responsibility.\n3. Equipment must be returned clean and in working condition.\n4. Late returns incur 1.5× the daily rate per additional day.\n5. Security deposit will be refunded within 3 working days of satisfactory return."),
  securityDepositPolicy: text("security_deposit_policy").default("A security deposit is required for all rentals. This will be refunded in full on return of equipment in good condition."),
  lateFeeMultiplier: numeric("late_fee_multiplier", { precision: 4, scale: 2 }).default("1.5"),
  advancePercentRequired: integer("advance_percent_required").default(50),
  minimumRentalDays: integer("minimum_rental_days").default(1),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Payment Transactions ────────────────────────────────────────────────────
export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: text("method").notNull(), // cash, upi, bank_transfer, card, cheque
  reference: text("reference"), // UTR / cheque number / txn ID
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Security Deposits ───────────────────────────────────────────────────────
export const securityDeposits = pgTable("security_deposits", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: text("method").notNull().default("cash"), // cash, upi, bank_transfer, card
  reference: text("reference"),
  status: text("status").default("held").notNull(), // held, returned, forfeited
  returnedAt: timestamp("returned_at"),
  returnNotes: text("return_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Relations
export const equipmentRelations = relations(equipment, ({ one, many }) => ({
  category: one(equipmentCategories, {
    fields: [equipment.categoryId],
    references: [equipmentCategories.id],
  }),
  images: many(equipmentImages, { relationName: "equipment_images" }),
  bookingItems: many(bookingItems),
  kitComponents: many(kitItems, { relationName: "kit_components" }),
  asPartOfKits: many(kitItems, { relationName: "kit_items" }),
  maintenanceLogs: many(equipmentMaintenanceLogs),
}))

export const equipmentImagesRelations = relations(equipmentImages, ({ one }) => ({
  equipment: one(equipment, {
    fields: [equipmentImages.equipmentId],
    references: [equipment.id],
    relationName: "equipment_images",
  }),
}))

export const equipmentCategoriesRelations = relations(equipmentCategories, ({ many }) => ({
  equipment: many(equipment),
}))

export const equipmentMaintenanceLogsRelations = relations(equipmentMaintenanceLogs, ({ one }) => ({
  equipment: one(equipment, {
    fields: [equipmentMaintenanceLogs.equipmentId],
    references: [equipment.id],
  }),
}))

export const kitItemRelations = relations(kitItems, ({ one }) => ({
  kit: one(equipment, {
    fields: [kitItems.kitId],
    references: [equipment.id],
    relationName: "kit_components",
  }),
  item: one(equipment, {
    fields: [kitItems.itemId],
    references: [equipment.id],
    relationName: "kit_items",
  }),
}))

export const clientsRelations = relations(clients, ({ many }) => ({
  bookings: many(bookings),
}))

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  client: one(clients, {
    fields: [bookings.clientId],
    references: [clients.id],
  }),
  items: many(bookingItems),
  payments: many(paymentTransactions),
  securityDeposits: many(securityDeposits),
}))

export const bookingItemRelations = relations(bookingItems, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingItems.bookingId],
    references: [bookings.id],
  }),
  equipment: one(equipment, {
    fields: [bookingItems.equipmentId],
    references: [equipment.id],
  }),
}))

export const paymentTransactionRelations = relations(paymentTransactions, ({ one }) => ({
  booking: one(bookings, {
    fields: [paymentTransactions.bookingId],
    references: [bookings.id],
  }),
}))

export const securityDepositRelations = relations(securityDeposits, ({ one }) => ({
  booking: one(bookings, {
    fields: [securityDeposits.bookingId],
    references: [bookings.id],
  }),
}))


