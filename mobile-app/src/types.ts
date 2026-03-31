export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface Equipment {
  id: number;
  categoryId: number | null;
  name: string;
  slug: string;
  brand: string | null;
  dailyRate: string | number;
  weeklyRate: string | number | null;
  weekendRate: string | number | null;
  monthlyRate: string | number | null;
  depositAmount: string | number | null;
  status: string | null;
  description: string | null;
  featured: boolean | null;
  isKit: boolean | null;
  specs: unknown | null;
  categoryName?: string;
  imageUrls?: string[];
}

export interface EquipmentImage {
  id: number;
  equipmentId: number;
  url: string;
  isPrimary: boolean | null;
  displayOrder: number;
}
