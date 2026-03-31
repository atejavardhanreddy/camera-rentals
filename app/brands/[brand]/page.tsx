import { getEquipmentByBrand } from "@/lib/data"
import EquipmentGrid from "@/components/equipment-grid"
import { Suspense } from "react"
import { EquipmentSkeleton } from "@/components/skeletons"
import { unstable_noStore } from "next/cache"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Breadcrumb from "@/components/breadcrumb"
import Script from "next/script"

// Import the brand description generator
import { generateBrandDescription } from "@/lib/meta-description"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface BrandPageProps {
  params: {
    brand: string
  }
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = decodeURIComponent(params.brand)

  // Generate an optimized description for this brand
  const optimizedDescription = generateBrandDescription(brand)

  return {
    title: `${brand.toUpperCase()} Equipment | D'RENTALS by Penmen Studios`,
    description: optimizedDescription,
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  // Disable caching for this page
  unstable_noStore()

  const brandName = decodeURIComponent(params.brand)

  return (
    <>
      {/* Google Tag (gtag.js) */}
      {/* Google Tag (gtag.js) */}
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-P623CW7HNM" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P623CW7HNM');
          `,
        }}
      />
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Brands", href: "/brands" }, { label: brandName }]} />

          <div className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1200&auto=format&fit=crop')",
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
                  <span className="text-red-400 font-mono text-sm tracking-widest">BRAND</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide leading-tight uppercase">
                  {brandName} <span className="text-red-500">EQUIPMENT</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="py-12">
            <Suspense fallback={<EquipmentSkeleton />}>
              <BrandEquipment brand={brandName} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

async function BrandEquipment({ brand }: { brand: string }) {
  // Disable caching for this component
  unstable_noStore()

  const equipment = await getEquipmentByBrand(brand)

  if (equipment.length === 0) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase">{brand} Products</h2>
        <div className="h-px bg-red-500 flex-grow ml-6"></div>
      </div>
      <EquipmentGrid equipment={equipment} />
    </div>
  )
}
