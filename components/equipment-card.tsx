"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency } from "@/lib/utils"
import type { Equipment } from "@/lib/types"
import { Camera } from "lucide-react"
import { useState } from "react"
import { getSafeImageUrl } from "@/lib/image-utils"
import { imageSizes } from "@/lib/performance"

export default function EquipmentCard({ equipment, priority = false }: { equipment: Equipment; priority?: boolean }) {
  // Default placeholder for missing images
  const placeholderImage = "/placeholder.svg?height=300&width=400"

  // Ensure image URL is valid
  const imageUrl = getSafeImageUrl(equipment.mainImageUrl, 400, 300)

  return (
    <Link href={`/equipment/${equipment.id}`} className="block transition-all duration-500 group">
      <Card className={cn(
        "h-full overflow-hidden bg-zinc-950 border-zinc-800 rounded-none transition-all duration-500",
        "hover:border-red-500 hover:shadow-[0_0_20px_rgba(227,27,35,0.2)] group-hover:-translate-y-2",
        equipment.featured && "military-border border-red-900/50"
      )}>
        <div className="aspect-[4/3] relative overflow-hidden bg-zinc-800">
          {equipment.mainImageUrl ? (
            <EquipmentCardImage
              src={imageUrl}
              alt={`${equipment.brand} ${equipment.name} ${equipment.model} for rent in Hyderabad - Professional cinema equipment`}
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="h-16 w-16 text-zinc-600" aria-hidden="true" />
              <span className="sr-only">{equipment.name} image not available</span>
            </div>
          )}
          {equipment.featured && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-2 border-red-500/20 z-10" />
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            {equipment.featured && (
              <Badge className="bg-red-600 rounded-none font-heading px-3 py-1 shadow-lg">FEATURED</Badge>
            )}
            {equipment.isKit && (
              <Badge className="bg-purple-600 rounded-none font-heading px-3 py-1 shadow-lg border-none">BUNDLE</Badge>
            )}
          </div>
        </div>
        <CardContent className="p-5 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 rounded-none font-mono text-[10px] tracking-tighter uppercase px-2 py-0">
              {equipment.brand}
            </Badge>
            <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 rounded-none font-mono text-[10px] tracking-tighter uppercase px-2 py-0">
              {equipment.condition}
            </Badge>
          </div>
          <h3 className="font-heading text-xl mb-1 line-clamp-1 text-white group-hover:text-red-500 transition-colors duration-300">{equipment.name}</h3>
          <p className="text-xs text-zinc-500 line-clamp-1 font-mono uppercase tracking-widest">{equipment.model}</p>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex justify-between items-center bg-black">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">DAILY RATE</span>
            <span className="font-heading text-red-500 text-xl tracking-tight">{formatCurrency(equipment.dailyRate)}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div className="w-8 h-8 rounded-full border border-red-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

// Component to handle image errors
function EquipmentCardImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Camera className="h-16 w-16 text-zinc-600" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        priority={priority}
        sizes={imageSizes.equipmentCard.sizes}
        quality={80}
      />
    </div>
  )
}
