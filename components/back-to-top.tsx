"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-24 right-6 z-50 p-3 bg-zinc-900 border border-zinc-800 text-red-500 transition-all duration-500 rounded-none",
        "hover:bg-red-500 hover:text-white hover:border-red-500 shadow-float",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-red-500" />
      <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-red-500" />
    </button>
  )
}
