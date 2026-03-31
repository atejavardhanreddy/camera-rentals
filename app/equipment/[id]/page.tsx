import { getEquipmentById, getEquipmentImages, getRelatedEquipment } from "@/lib/data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, slugify } from "@/lib/utils" // Import slugify
import EquipmentImageGallery from "@/components/equipment-image-gallery"
import { getSafeImageUrl } from "@/lib/image-utils"
import WhatsAppCTA from "@/components/whatsapp-cta"
import Breadcrumb from "@/components/breadcrumb"
import { ProductSchema } from "@/components/structured-data"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo-config"
import { generateEquipmentDescription } from "@/lib/meta-description"
import type { Metadata } from "next"
import EquipmentGrid from "@/components/equipment-grid"
import { Suspense } from "react"
import { EquipmentSkeleton } from "@/components/skeletons"

// Generate dynamic metadata for each equipment page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = Number.parseInt(params.id)
  const equipment = await getEquipmentById(id)

  if (!equipment) {
    return generateSeoMetadata({
      title: "Equipment Not Found",
      description: "The requested equipment could not be found.",
      path: `/equipment/${id}`, // Fallback path
    })
  }

  const keywords: string[] = [
    equipment.name.toLowerCase(),
    equipment.brand?.toLowerCase(),
    equipment.model?.toLowerCase(),
    equipment.categoryName?.toLowerCase(),
    "camera rental",
    "equipment rental",
    "cinema gear",
    "rent in hyderabad",
    // Add more specific keywords based on equipment type
    equipment.categoryName === "Cameras" ? "video camera rental" : "",
    equipment.categoryName === "Lenses" ? "camera lens rental" : "",
    equipment.categoryName === "Tripods & Supports" ? "gimbal rental" : "",
  ].filter((keyword): keyword is string => Boolean(keyword))

  // Generate an optimized description using our utility
  const optimizedDescription = generateEquipmentDescription(equipment)

  // Construct the path with the slugified name for canonical URL
  const pathWithSlug = `/equipment/${equipment.id}-${slugify(equipment.name)}`

  return generateSeoMetadata({
    title: equipment.name,
    description: optimizedDescription,
    keywords,
    path: pathWithSlug, // Use the new slugified path for canonical URL
    ogTitle: `${equipment.name} | ${equipment.brand} | D'RENTALS`,
    ogDescription: optimizedDescription,
  })
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const id = Number.parseInt(params.id)
  const equipment = await getEquipmentById(id)

  if (!equipment) {
    notFound()
  }

  const images = await getEquipmentImages(id)

  // Ensure image URL is valid
  const safeImages = images.map((img) => ({
    ...img,
    imageUrl: getSafeImageUrl(img.imageUrl, 600, 600),
  }))

  // Ensure main image URL is valid
  const safeMainImage = getSafeImageUrl(equipment.mainImageUrl, 800, 600)

  return (
    <>
      <div className="bg-black min-h-screen">
        <ProductSchema equipment={equipment} />

        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Equipment", href: "/equipment" }, { label: equipment.name }]} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
            <div>
              <EquipmentImageGallery mainImage={safeMainImage} additionalImages={safeImages} />
            </div>

            <div>
              <div className="inline-block mb-4 px-3 py-1 border border-red-500 bg-black/50">
                <span className="text-red-400 font-mono text-sm tracking-widest">EQUIPMENT ID: {equipment.id}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="bg-transparent border-zinc-700 text-zinc-400 rounded-none font-mono uppercase"
                >
                  {equipment.brand}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-transparent border-zinc-700 text-zinc-400 rounded-none font-mono uppercase"
                >
                  {equipment.condition}
                </Badge>
                {equipment.featured && (
                  <Badge className="bg-red-500 rounded-none font-heading uppercase">Featured</Badge>
                )}
                {equipment.isKit && (
                  <Badge className="bg-purple-600 rounded-none font-heading uppercase">Bundle</Badge>
                )}
              </div>

              <h1 className="text-3xl font-heading mb-2 text-white tracking-wide uppercase">{equipment.name}</h1>
              <p className="text-lg text-zinc-400 mb-6 font-mono">{equipment.model}</p>

              <Separator className="my-6 bg-zinc-800" />

              <div className="space-y-6">
                {/* Rental Rates */}
                <div>
                  <h2 className="text-xl font-heading mb-3 text-white uppercase tracking-wide">Rental Rates</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-zinc-800 text-center bg-zinc-900 military-border">
                      <p className="text-sm text-zinc-500 uppercase tracking-wider font-mono">Daily</p>
                      <p className="text-base sm:text-lg md:text-xl font-heading text-red-400 break-words">
                        {formatCurrency(equipment.dailyRate)}
                      </p>
                    </div>
                    {equipment.weeklyRate && (
                      <div className="p-4 border border-zinc-800 text-center bg-zinc-900 military-border">
                        <p className="text-sm text-zinc-500 uppercase tracking-wider font-mono">Weekly</p>
                        <p className="text-base sm:text-lg md:text-xl font-heading text-red-400 break-words">
                          {formatCurrency(equipment.weeklyRate)}
                        </p>
                      </div>
                    )}
                    {equipment.monthlyRate && (
                      <div className="p-4 border border-zinc-800 text-center bg-zinc-900 military-border">
                        <p className="text-sm text-zinc-500 uppercase tracking-wider font-mono">Monthly</p>
                        <p className="text-base sm:text-lg md:text-xl font-heading text-red-400 break-words">
                          {formatCurrency(equipment.monthlyRate)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp CTA */}
                  <div className="mt-6">
                    <WhatsAppCTA equipment={equipment} />
                  </div>
                </div>

                {equipment.isKit && equipment.kitComponents && equipment.kitComponents.length > 0 && (
                  <>
                    <Separator className="my-6 bg-zinc-800" />
                    <div>
                      <h2 className="text-xl font-heading mb-3 text-white uppercase tracking-wide">Bundle Components</h2>
                      <div className="grid grid-cols-1 gap-2">
                        {equipment.kitComponents.map((component: any) => (
                          <div key={component.id} className="flex justify-between items-center p-3 bg-zinc-900/50 border border-zinc-800">
                             <div className="flex flex-col">
                                <span className="text-white font-mono text-sm">{component.item?.name}</span>
                                <span className="text-zinc-500 font-mono text-[10px] uppercase">{component.item?.model}</span>
                             </div>
                             <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-red-400 font-mono text-xs">
                               x{component.quantity}
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-6 bg-zinc-800" />

                {/* Description */}
                <div>
                  <h2 className="text-xl font-heading mb-3 text-white uppercase tracking-wide">Description</h2>
                  <p className="text-zinc-400 font-body">{equipment.description}</p>
                </div>

                {/* Specifications */}
                <div>
                  <h2 className="text-xl font-heading mb-3 text-white uppercase tracking-wide">Specifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {equipment.specifications &&
                      Object.entries(equipment.specifications).map(([key, value]) => (
                        <div key={key} className="flex flex-col border-b border-zinc-800 pb-3">
                          <span className="text-sm text-zinc-500 uppercase tracking-wider font-mono">
                            {key.replace("_", " ")}
                          </span>
                          <span className="text-white font-mono">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New: Related Equipment Section */}
          <div className="py-12">
            <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">Related Equipment</h2>
            <Suspense fallback={<EquipmentSkeleton />}>
              <RelatedEquipmentList currentEquipmentId={equipment.id} categoryId={equipment.categoryId} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

async function RelatedEquipmentList({
  currentEquipmentId,
  categoryId,
}: { currentEquipmentId: number; categoryId: number }) {
  const relatedEquipment = await getRelatedEquipment(currentEquipmentId, categoryId, 3)

  if (relatedEquipment.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-zinc-400">No related equipment found in this category.</p>
      </div>
    )
  }

  return <EquipmentGrid equipment={relatedEquipment} />
}
