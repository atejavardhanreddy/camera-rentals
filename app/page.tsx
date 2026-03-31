import FeaturedEquipment from "@/components/featured-equipment"
import Hero from "@/components/hero"
import CategoryList from "@/components/category-list"
import HeroCarousel from "@/components/hero-carousel" // New import
import { getCategories, getFeaturedEquipment } from "@/lib/data" // Modified import
import { unstable_noStore } from "next/cache"
import { generateMetadata } from "@/lib/seo-config"
import type { Metadata } from "next"
import { Award, Users, Clock, Truck } from "lucide-react" // Added Truck icon
import Script from "next/script"

export const dynamic = "force-dynamic"

// Update the metadata for the home page with more targeted keywords and optimized description
export const metadata: Metadata = generateMetadata({
  title: "D'RENTALS - A Cinema Camera Rental Company in Hyderabad",
  description:
    "camera rentals in hyderabad. Rent professional cinema cameras, DSLR, 4K cameras, lenses, lighting, and audio equipment for your film and video production needs in Hyderabad. Serving Kukatpally, Dilsukhnagar and all areas with same-day delivery and technical support.",
  keywords: [
    "camera rentals in hyderabad",
    "dslr camera for rent hyderabad",
    "4k camera for rent in hyderabad",
    "red camera rent in hyderabad",
    "gopro rent in hyderabad",
    "camera lens for rent in hyderabad",
    "gimbal rental hyderabad",
    "camera rental kukatpally",
    "camera rental in dilsukhnagar",
    "film equipment rental hyderabad",
    "video production equipment hyderabad",
    "cinema camera rental hyderabad",
  ],
  path: "/",
  ogTitle: "D'RENTALS - A Cinema Camera Rental Company in Hyderabad",
  ogDescription:
    "Access top-quality cinema cameras, DSLRs, lenses, and accessories curated by Penmen Studios for industry professionals in Hyderabad, India. Same-day delivery available.",
})

export default async function Home() {
  // Disable caching for this page
  unstable_noStore()

  const categories = await getCategories()
  const featuredEquipment = await getFeaturedEquipment() // New data fetch

  return (
    <>
      <div className="bg-black min-h-screen">
        <HeroCarousel equipment={featuredEquipment} /> {/* New: Hero Carousel at the top */}
        <CategoryList categories={categories} />
        <FeaturedEquipment />
        {/* Original Hero Section - moved here */}
        <Hero />
        {/* New: Why Choose D'RENTALS Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading text-3xl text-red-500 tracking-wide">WHY CHOOSE D&apos;RENTALS</h2>
              <div className="h-px bg-red-500 flex-grow ml-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">PREMIUM EQUIPMENT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Access a curated selection of professional-grade cinema cameras, lenses, and accessories from top
                  brands.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Truck className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">CONVENIENT DELIVERY</h3>
                <p className="text-zinc-400 text-center font-body">
                  Enjoy hassle-free delivery and pickup services across Hyderabad, including Kukatpally and
                  Dilsukhnagar.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">EXPERT SUPPORT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Benefit from technical guidance and personalized recommendations from our experienced team.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Clock className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">FLEXIBLE RENTALS</h3>
                <p className="text-zinc-400 text-center font-body">
                  Choose from daily, weekly, or monthly rental options to suit your project&apos;s duration and budget.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
