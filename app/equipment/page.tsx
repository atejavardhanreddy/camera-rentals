import { getCategories, getAllEquipment } from "@/lib/data"
import EquipmentGrid from "@/components/equipment-grid"
import EquipmentFilters from "@/components/equipment-filters"
import MobileCategoryDropdown from "@/components/mobile-category-dropdown"
import { Suspense } from "react"
import { EquipmentSkeleton } from "@/components/skeletons"
import { unstable_noStore } from "next/cache"
import Breadcrumb from "@/components/breadcrumb"
import { generateMetadata } from "@/lib/seo-config"
import CanonicalUrl from "@/components/canonical-url"
import type { Metadata } from "next"
import Script from "next/script"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Update the equipment page metadata with more targeted keywords and optimized description
export const metadata: Metadata = generateMetadata({
  title: "Camera & Equipment Catalog | Rent in Hyderabad",
  description:
    "Browse our extensive collection of professional cinema cameras, DSLRs, 4K cameras, lenses, and audio equipment for rent in Hyderabad. Daily, weekly, and monthly rental options with delivery service available.",
  keywords: [
    "dslr camera rentals in hyderabad",
    "5d camera rent in hyderabad",
    "canon 5d mark iv rent in hyderabad",
    "red camera rental hyderabad",
    "gopro for rent in hyderabad",
    "lens rental in hyderabad",
    "gimbal for rent in hyderabad",
    "camera rentals in hyderabad near me",
    "video camera for rent in hyderabad",
  ],
  path: "/equipment",
  ogTitle: "Professional Camera & Cinema Equipment Catalog | D'RENTALS Hyderabad",
  ogDescription:
    "Explore our comprehensive range of cinema cameras, DSLRs, 4K cameras, lenses, lighting, and audio equipment available for rent in Hyderabad. Find the perfect gear for your production.",
})

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: { category?: string; kit?: string }
}) {
  // Disable caching for this page
  unstable_noStore()

  const categories = await getCategories()
  const categoryId = searchParams.category ? Number.parseInt(searchParams.category) : undefined
  const isKit = searchParams.kit === 'true'

  // Find the selected category name if a category is selected
  const selectedCategory = categoryId ? categories.find((cat) => cat.id === categoryId) : undefined

  return (
    <>
      <div className="bg-black min-h-screen">
        {/* Add canonical URL component to ensure filtered pages point to the main equipment page */}
        <CanonicalUrl overridePath="/equipment" />

        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={[{ label: "Equipment" }, ...(selectedCategory ? [{ label: selectedCategory.name }] : [])]}
          />

          <div className="py-8">
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-3xl font-heading text-red-500 tracking-wide uppercase">Browse Equipment</h1>
              <div className="h-px bg-red-500 flex-grow ml-6"></div>
            </div>

            {/* Mobile Category Dropdown - Only visible on mobile */}
            <MobileCategoryDropdown categories={categories} selectedCategory={categoryId} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Sidebar Filters - Hidden on mobile */}
              <div className="hidden lg:block lg:col-span-1">
                <EquipmentFilters categories={categories} selectedCategory={categoryId} isKitOnly={isKit} />
              </div>

              <div className="lg:col-span-3">
                <Suspense fallback={<EquipmentSkeleton />}>
                  <EquipmentList categoryId={categoryId} isKit={isKit} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

async function EquipmentList({ categoryId, isKit }: { categoryId?: number, isKit?: boolean }) {
  // Disable caching for this component
  unstable_noStore()

  const equipment = await getAllEquipment(categoryId, isKit || undefined)

  return <EquipmentGrid equipment={equipment} />
}
