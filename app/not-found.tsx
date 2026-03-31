import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Viewport } from "next"
import { generateViewport } from "@/lib/seo-config"

// Add viewport export
export const viewport: Viewport = generateViewport()

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-red-500 mb-6 tracking-wide">PAGE NOT FOUND</h1>
        <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto font-body">
          We couldn&apos;t find the page you&apos;re looking for. It may have been moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white rounded-none px-8 py-6 text-base font-heading"
          >
            <Link href="/">RETURN HOME</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10 rounded-none px-8 py-6 text-base font-heading"
          >
            <Link href="/equipment">BROWSE EQUIPMENT</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
