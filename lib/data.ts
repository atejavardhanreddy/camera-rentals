import { blogPosts } from './blog-posts-data'
import { db, equipment, equipmentCategories, equipmentImages } from "./db"
import { cache } from "react"
import type { Category, Equipment, EquipmentImage, BlogPost } from "./types"
import { eq, and, or, desc, sql as drizzleSql } from "drizzle-orm"

// Resolve relative image urls to absolute so that mobile clients receive
// direct CDN/storage links without routing through Vercel image optimization.
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentals.penmenstudios.com'
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // Relative path — prepend the site base so mobile gets a full absolute URL
  return `${SITE_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}

export const getCategories = cache(async (): Promise<Category[]> => {
  return await db.query.equipmentCategories.findMany({
    orderBy: [equipmentCategories.name]
  }) as Category[]
})

export const getFeaturedEquipment = cache(async (): Promise<Equipment[]> => {
  const result = await db.query.equipment.findMany({
    where: eq(equipment.featured, true),
    with: {
      category: true,
      images: true,
    },
    orderBy: [equipment.name]
  })

  // Map to align with the Equipment type if necessary (e.g., category_name)
  const formattedResult = result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: item.images?.map((img: any) => resolveImageUrl(img.imageUrl)).filter(Boolean) || []
  }))

  return formattedResult as unknown as Equipment[]
})

export const getAllEquipment = cache(async (categoryId?: number, isKit?: boolean): Promise<Equipment[]> => {
  const whereConditions = []
  if (categoryId) whereConditions.push(eq(equipment.categoryId, categoryId))
  if (isKit !== undefined) whereConditions.push(eq(equipment.isKit, isKit))

  const result = await db.query.equipment.findMany({
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    with: {
      category: true,
      images: true,
    },
    orderBy: [equipment.name]
  })

  return result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: item.images?.map((img: any) => resolveImageUrl(img.imageUrl)).filter(Boolean) || []
  })) as unknown as Equipment[]
})

export const getEquipmentById = cache(async (id: number): Promise<Equipment | undefined> => {
  const item = await db.query.equipment.findFirst({
    where: eq(equipment.id, id),
    with: {
      category: true,
      images: true,
      kitComponents: {
        with: {
          item: true
        }
      }
    }
  })

  if (!item) return undefined

  return {
    ...item,
    categoryName: item.category?.name,
    imageUrls: item.images?.map((img: any) => resolveImageUrl(img.imageUrl)).filter(Boolean) || []
  } as unknown as Equipment
})

export const getEquipmentBySlug = cache(async (slug: string): Promise<Equipment | undefined> => {
  const item = await db.query.equipment.findFirst({
    where: eq(equipment.slug, slug),
    with: {
      category: true,
      images: true,
    }
  })

  if (!item) return undefined

  return {
    ...item,
    categoryName: item.category?.name,
    imageUrls: item.images?.map((img: any) => resolveImageUrl(img.imageUrl)).filter(Boolean) || []
  } as unknown as Equipment
})

export const getEquipmentImages = cache(async (equipmentId: number): Promise<EquipmentImage[]> => {
  return await db.query.equipmentImages.findMany({
    where: eq(equipmentImages.equipmentId, equipmentId),
    orderBy: [equipmentImages.displayOrder]
  }) as EquipmentImage[]
})

export const getEquipmentByBrand = cache(async (brand: string): Promise<Equipment[]> => {
  const result = await db.query.equipment.findMany({
    where: drizzleSql`${equipment.brand} ILIKE ${`%${brand}%`}`,
    with: {
      category: true,
      images: true,
    },
    orderBy: [equipment.name]
  })

  return result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: item.images?.map((img: any) => resolveImageUrl(img.imageUrl)).filter(Boolean) || []
  })) as unknown as Equipment[]
})

export const getAllBrands = cache(async (): Promise<string[]> => {
  const result = await db.selectDistinct({ brand: equipment.brand })
    .from(equipment)
    .where(drizzleSql`${equipment.brand} IS NOT NULL AND ${equipment.brand} != ''`)
    .orderBy(equipment.brand)

  return result.map(r => r.brand!)
})

export const getPopularEquipmentForArea = cache(async (limit = 4): Promise<Equipment[]> => {
  const result = await db.query.equipment.findMany({
    where: or(eq(equipment.featured, true), eq(equipment.status, 'available')),
    with: {
      category: true,
      images: true,
    },
    orderBy: [desc(equipment.dailyRate)],
    limit: limit
  })

  return result.map(item => ({
    ...item,
    categoryName: item.category?.name,
    imageUrls: item.images?.map((img: any) => resolveImageUrl(img.imageUrl)).filter(Boolean) || []
  })) as unknown as Equipment[]
})

export const getRelatedEquipment = cache(
  async (currentEquipmentId: number, categoryId: number, limit = 4): Promise<Equipment[]> => {
    const result = await db.query.equipment.findMany({
      where: and(eq(equipment.categoryId, categoryId), drizzleSql`${equipment.id} != ${currentEquipmentId}`),
      with: {
        category: true
      },
      orderBy: [drizzleSql`RANDOM()`],
      limit: limit
    })

    return result.map(item => ({
      ...item,
      categoryName: item.category?.name
    })) as unknown as Equipment[]
  },
)

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return blogPosts
})

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getBlogPosts()
  return posts.find((post) => post.slug === slug)
})

