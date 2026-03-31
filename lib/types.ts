export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Equipment {
  id: number
  categoryId: number
  categoryName?: string
  name: string
  brand: string | null
  model: string | null
  description: string | null
  specifications: Record<string, any> | null
  dailyRate: number
  weeklyRate: number | null
  monthlyRate: number | null
  condition: string | null
  status: string
  featured: boolean
  isKit: boolean
  slug: string | null
  mainImageUrl: string | null
  createdAt: Date
  updatedAt: Date
  kitComponents?: KitItem[]
}

export interface KitItem {
  id: number
  kitId: number
  itemId: number
  item?: Equipment
  quantity: number
  createdAt: Date
}

export interface Client {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  idProofUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: number
  clientId: number
  client?: Client // Changed from client_name etc. to use the nested object pattern
  status: 'pending' | 'confirmed' | 'out' | 'returned' | 'cancelled'
  totalAmount: number
  paidAmount: number
  discount: number
  logisticsCharges: number
  lateFees: number
  damageCharges: number
  notes: string | null
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
  items?: BookingItem[]
}

export interface BookingItem {
  id: number
  bookingId: number
  equipmentId: number
  equipment?: Equipment
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface EquipmentImage {
  id: number
  equipmentId: number
  imageUrl: string
  altText: string | null
  displayOrder: number
  createdAt: Date
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  altText: string
  publishedAt: string
  author: string
  category: string
}
