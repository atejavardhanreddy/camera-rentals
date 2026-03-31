"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { scrollToTop } from "@/lib/navigation-utils"

interface BreadcrumbProps {
  items?: {
    label: string
    href?: string
  }[]
  homeHref?: string
  homeLabel?: string
}

export default function Breadcrumb({ items = [], homeHref = "/", homeLabel = "Home" }: BreadcrumbProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        <li className="flex items-center">
          <Link
            href={homeHref}
            className="flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
            onClick={() => pathname === homeHref && scrollToTop()}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">{homeLabel}</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-zinc-600" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="ml-1 text-zinc-400 transition-colors hover:text-white"
                  onClick={() => pathname === item.href && scrollToTop()}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 text-white font-mono">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>

      {/* Structured Data: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: homeLabel,
                item: homeHref === "/" ? process.env.NEXT_PUBLIC_SITE_URL || "https://rentals.penmenstudios.com" : `${process.env.NEXT_PUBLIC_SITE_URL || "https://rentals.penmenstudios.com"}${homeHref}`
              },
              ...items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: item.label,
                ...(item.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rentals.penmenstudios.com"}${item.href}` } : {})
              }))
            ]
          })
        }}
      />
    </nav>
  )
}
