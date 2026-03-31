import type { Metadata, Viewport } from "next"
import { Award, Users, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SafeImage from "@/components/safe-image"
import Breadcrumb from "@/components/breadcrumb"
import { generateMetadata, generateViewport } from "@/lib/seo-config"
import Script from "next/script"

// Add viewport export
export const viewport: Viewport = generateViewport()

// Update the about page metadata with more targeted keywords
export const metadata: Metadata = generateMetadata({
  title: "About Us | Camera Rental Services in Hyderabad",
  description:
    "Learn about D'RENTALS by Penmen Studios and our mission to provide professional cinema equipment, DSLRs, 4K cameras, and accessories for filmmakers and production companies in Hyderabad, Kukatpally, and Dilsukhnagar.",
  keywords: [
    "camera rental company hyderabad",
    "dslr camera rentals in hyderabad",
    "red camera rental hyderabad",
    "gopro rental in hyderabad",
    "camera equipment rental in hyderabad",
    "film production services",
    "Penmen Studios",
    "Hyderabad film equipment",
    "camera rental kukatpally",
    "camera rental in dilsukhnagar",
  ],
  path: "/about",
  ogTitle: "About D'RENTALS | Professional Camera Equipment Provider in Hyderabad",
  ogDescription:
    "Discover the story behind D'RENTALS by Penmen Studios and our commitment to providing top-quality cinema and DSLR camera equipment for filmmakers in Hyderabad, India.",
})

export default function AboutPage() {
  return (
    <>
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "About" }]} />

          <div className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-zinc-900 -z-10"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-block mb-4 px-3 py-1 border border-red-500 bg-black/50">
                  <span className="text-red-400 font-mono text-sm tracking-widest">ABOUT US</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide leading-tight">
                  THE <span className="text-red-500">D&apos;RENTALS</span> STORY
                </h1>
              </div>
            </div>
          </div>

          <div className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="aspect-[4/3] relative rounded-none overflow-hidden border border-zinc-800 bg-zinc-800">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&auto=format&fit=crop"
                    alt="Professional cinema camera equipment from D'RENTALS by Penmen Studios"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-white mb-6 tracking-wide">OUR MISSION</h2>
                <p className="text-zinc-300 mb-6 font-body">
                  D&apos;RENTALS by Penmen Studios was established with a clear vision: to provide filmmakers and content
                  creators with access to professional-grade cinema equipment without the prohibitive costs of
                  ownership.
                </p>
                <p className="text-zinc-300 mb-6 font-body">
                  Our team of industry professionals understands the technical and creative demands of modern
                  production. We curate our inventory to include the latest and most reliable equipment, ensuring that
                  your vision is never compromised by technical limitations.
                </p>
                <p className="text-zinc-300 font-body">
                  Based in Hyderabad, we serve production teams across India with our extensive catalog of cameras,
                  lenses, lighting, and audio equipment. Our military-grade attention to detail ensures that every piece
                  of equipment is meticulously maintained and tested before each rental.
                </p>
              </div>
            </div>

            <Separator className="my-16 bg-zinc-800" />

            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl text-white mb-6 tracking-wide">WHY CHOOSE D&apos;RENTALS</h2>
              <p className="text-zinc-300 max-w-3xl mx-auto font-body">
                At D&apos;RENTALS, we combine technical expertise with a passion for filmmaking. Our commitment to quality
                and service sets us apart in the industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">PREMIUM EQUIPMENT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Curated selection of professional-grade cinema equipment from industry-leading manufacturers.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">EXPERT SUPPORT</h3>
                <p className="text-zinc-400 text-center font-body">
                  Technical guidance from experienced professionals who understand your production needs.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">INDUSTRY EXPERIENCE</h3>
                <p className="text-zinc-400 text-center font-body">
                  Founded by filmmakers for filmmakers, with deep understanding of production workflows.
                </p>
              </div>

              <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                <div className="flex justify-center mb-4">
                  <Clock className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="font-heading text-xl text-white mb-3 text-center">FLEXIBLE TERMS</h3>
                <p className="text-zinc-400 text-center font-body">
                  Daily, weekly, and monthly rental options to accommodate projects of any duration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
