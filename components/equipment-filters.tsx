"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category } from "@/lib/types"
import { createCleanUrl } from "@/lib/navigation-utils"

export default function EquipmentFilters({
  categories,
  selectedCategory,
  isKitOnly,
}: {
  categories: Category[]
  selectedCategory?: number
  isKitOnly?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleFilterChange = (params: { categoryId?: number; kit?: boolean }) => {
    const currentParams = new URLSearchParams(window.location.search)
    
    if (params.categoryId !== undefined) {
      if (params.categoryId) currentParams.set('category', params.categoryId.toString())
      else currentParams.delete('category')
    }
    
    if (params.kit !== undefined) {
      if (params.kit) currentParams.set('kit', 'true')
      else currentParams.delete('kit')
    }

    const newQuery = currentParams.toString()
    const url = newQuery ? `${pathname}?${newQuery}` : pathname

    router.push(url)
    window.scrollTo(0, 0)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 rounded-none">
      <CardHeader className="border-b border-zinc-800">
        <CardTitle className="text-white uppercase tracking-wide text-lg font-heading">Filters</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading mb-4 text-white uppercase tracking-wide text-sm underline decoration-red-500/50 underline-offset-8">View Type</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={!isKitOnly ? "default" : "outline"}
                className={`w-full justify-start rounded-none font-mono ${
                  !isKitOnly ? "bg-red-500 hover:bg-red-600" : "text-zinc-400 hover:text-white border-zinc-700 hover:border-red-500/50"
                }`}
                onClick={() => handleFilterChange({ kit: false })}
              >
                ALL EQUIPMENT
              </Button>
              <Button
                variant={isKitOnly ? "default" : "outline"}
                className={`w-full justify-start rounded-none font-mono ${
                  isKitOnly ? "bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.3)]" : "text-zinc-400 hover:text-white border-zinc-700 hover:border-purple-500/50"
                }`}
                onClick={() => handleFilterChange({ kit: true })}
              >
                KITS & BUNDLES
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-heading mb-4 text-white uppercase tracking-wide text-sm underline decoration-red-500/50 underline-offset-8">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                className={`w-full justify-start rounded-none font-mono ${
                  !selectedCategory ? "bg-red-500 hover:bg-red-600" : "text-zinc-400 hover:text-white border-zinc-700"
                }`}
                onClick={() => handleFilterChange({ categoryId: 0 })}
              >
                ALL CATEGORIES
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`w-full justify-start rounded-none font-mono ${
                    selectedCategory === category.id
                      ? "bg-red-500 hover:bg-red-600"
                      : "text-zinc-400 hover:text-white border-zinc-700"
                  }`}
                  onClick={() => handleFilterChange({ categoryId: category.id })}
                >
                  {category.name.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
