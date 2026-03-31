import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-900 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-3 py-1 border border-red-500 bg-black/50">
            <span className="text-red-400 font-mono text-sm tracking-widest">CAMERA RENTALS IN HYDERABAD</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-wide leading-tight">
            <span className="text-red-500">D&apos;RENTALS</span> CINEMA EQUIPMENT
          </h1>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl font-body">
            Access professional cinema cameras, DSLRs, 4K cameras, RED cameras, GoPro cameras, lenses, and accessories
            curated by Penmen Studios for industry professionals in Hyderabad, Kukatpally, Dilsukhnagar and across
            Telangana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white rounded-none px-8 py-6 text-base font-heading"
            >
              <Link href="/equipment">BROWSE EQUIPMENT</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 rounded-none px-8 py-6 text-base font-heading"
            >
              <Link href="/about">LEARN MORE</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
