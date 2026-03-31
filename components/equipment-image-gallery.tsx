"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { EquipmentImage } from "@/lib/types"
import { Camera } from "lucide-react"
import { imageSizes } from "@/lib/performance"

export default function EquipmentImageGallery({
  mainImage,
  additionalImages,
}: {
  mainImage?: string
  additionalImages: EquipmentImage[]
}) {
  // Default placeholder for missing images
  const placeholderImage = "/placeholder.svg?height=600&width=800"

  const [activeImage, setActiveImage] = useState(mainImage || additionalImages[0]?.imageUrl || placeholderImage)
  const [imageLoadError, setImageLoadError] = useState(false)

  const allImages = [
    ...(mainImage ? [{ id: 0, imageUrl: mainImage, altText: `Main view of professional cinema equipment`, displayOrder: 0 }] : []),
    ...additionalImages,
  ].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] relative rounded-none overflow-hidden border border-zinc-800 bg-zinc-800">
        {imageLoadError ? (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-24 w-24 text-zinc-600" aria-hidden="true" />
            <span className="sr-only">Equipment image not available</span>
          </div>
        ) : (
          <Image
            src={activeImage || "/placeholder.svg"}
            alt={allImages.find(img => img.imageUrl === activeImage)?.altText || "Professional cinema camera equipment for rent in Hyderabad"}
            fill
            className="object-contain"
            onError={() => {
              setImageLoadError(true)
            }}
            sizes={imageSizes.equipmentDetail.main.sizes}
            priority={true} // Main product image is important for LCP
            quality={85}
          />
        )}
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((image) => (
            <button
              key={image.id}
              className={cn(
                "aspect-square relative rounded-none overflow-hidden border border-zinc-800 bg-zinc-800",
                activeImage === image.imageUrl && "ring-2 ring-red-500",
              )}
              onClick={() => {
                setActiveImage(image.imageUrl)
                setImageLoadError(false)
              }}
              aria-label={`View ${image.altText || "equipment image"}`}
            >
              <ThumbnailImage src={image.imageUrl || "/placeholder.svg"} alt={image.altText || "Equipment image"} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Separate component for thumbnail images
function ThumbnailImage({ src, alt }: { src: string; alt: string | null }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Camera className="h-6 w-6 text-zinc-600" aria-hidden="true" />
        <span className="sr-only">{alt || "Image not available"}</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt || "Equipment image"}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes={imageSizes.equipmentDetail.thumbnail.sizes}
        loading="lazy"
        quality={75} // Lower quality for thumbnails is acceptable
      />
    </div>
  )
}
