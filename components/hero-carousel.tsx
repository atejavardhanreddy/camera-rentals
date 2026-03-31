"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Equipment } from "@/lib/types"
import { getSafeImageUrl } from "@/lib/image-utils"

interface HeroCarouselProps {
  equipment: Equipment[]
}

export default function HeroCarousel({ equipment }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % equipment.length)
  }, [equipment.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + equipment.length) % equipment.length)
  }, [equipment.length])

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }, [])

  useEffect(() => {
    if (equipment.length > 1) {
      const interval = setInterval(goToNext, 5000) // Auto-play every 5 seconds
      return () => clearInterval(interval)
    }
  }, [equipment.length, goToNext])

  if (!equipment || equipment.length === 0) {
    return null // Or a placeholder if no equipment is available
  }

  const currentEquipment = equipment[currentIndex]
  const imageUrl = getSafeImageUrl(currentEquipment.mainImageUrl, 1440, 600)

  return (
    <div className="relative w-full max-w-[1440px] mx-auto overflow-hidden bg-black aspect-[16/9] min-h-[400px] md:aspect-[16/7] lg:aspect-[16/6] group/carousel">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          key={currentIndex}
          src={imageUrl || "/placeholder.svg"}
          alt={`${currentEquipment.brand} ${currentEquipment.name}`}
          fill
          priority={true}
          className="object-cover object-center transition-transform duration-[10000ms] ease-out scale-110 group-hover/carousel:scale-100 animate-in-fade"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 1440px"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block"></div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 z-30 opacity-60">
        <div 
          key={currentIndex}
          className="h-full bg-red-500 origin-left"
          style={{ animation: 'carouselProgress 5s linear forwards' }}
        />
      </div>

      {/* Adjusted top padding (pt-*) and vertical alignment (justify-center md:justify-end) */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 md:px-10 md:pb-10 md:pt-28 lg:px-16 lg:pb-16 lg:pt-36 md:justify-end">
        <div className="max-w-3xl text-white animate-in-slide-up">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 leading-tight text-shadow">
            <span className="bg-red-600 text-white px-3 py-1 text-sm sm:text-base md:text-lg font-bold mb-2 inline-block tracking-tighter">
              {currentEquipment.brand}
            </span>
            <br />
            <span className="text-white inline-block drop-shadow-2xl">{currentEquipment.name}</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              asChild
              className="bg-red-500 hover:bg-red-600 text-white rounded-none px-8 py-6 text-sm font-heading btn-sweep"
            >
              <Link href={`/equipment/${currentEquipment.id}`}>VIEW DETAILS</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black rounded-none px-8 py-6 text-sm font-heading bg-zinc-900/80 transition-all"
            >
              <Link href="/equipment">BROWSE ALL</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {equipment.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 sm:p-2 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 sm:p-2 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </>
      )}

      {/* Navigation Dots */}
      {equipment.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
          {equipment.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-red-500 w-4 sm:w-6" : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
