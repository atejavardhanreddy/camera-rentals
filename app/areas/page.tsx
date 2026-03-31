import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Breadcrumb from "@/components/breadcrumb"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Camera Rental Service Areas | D'RENTALS by Penmen Studios",
  description:
    "Discover our camera equipment rental delivery service areas across Hyderabad including Kukatpally, Dilsukhnagar, Banjara Hills, and more.",
  keywords:
    "camera rental hyderabad, equipment delivery, camera rental service areas, dslr rental delivery, cinema equipment hyderabad",
}

// Define service areas with descriptions
const serviceAreas = [
  {
    name: "Hyderabad",
    slug: "hyderabad",
    description: "Professional camera equipment delivery across Hyderabad city.",
  },
  {
    name: "Kukatpally",
    slug: "kukatpally",
    description: "Camera and lens rental delivery service in Kukatpally area.",
  },
  {
    name: "Dilsukhnagar",
    slug: "dilsukhnagar",
    description: "Professional equipment delivery for filmmakers in Dilsukhnagar.",
  },
  {
    name: "Yousufguda",
    slug: "yousufguda",
    description: "Our main location with delivery service in Yousufguda.",
  },
  {
    name: "Hitech City",
    slug: "hitech-city",
    description: "Camera equipment delivery for corporate videos in Hitech City.",
  },
  {
    name: "Gachibowli",
    slug: "gachibowli",
    description: "Professional camera rental delivery in Gachibowli area.",
  },
  {
    name: "Banjara Hills",
    slug: "banjara-hills",
    description: "Premium equipment delivery for high-end productions in Banjara Hills.",
  },
  {
    name: "Jubilee Hills",
    slug: "jubilee-hills",
    description: "Professional cinema equipment delivery in Jubilee Hills.",
  },
  {
    name: "Ameerpet",
    slug: "ameerpet",
    description: "Camera and lens rental delivery for photographers in Ameerpet.",
  },
  {
    name: "Secunderabad",
    slug: "secunderabad",
    description: "Equipment delivery service covering all of Secunderabad.",
  },
  {
    name: "Madhapur",
    slug: "madhapur",
    description: "Professional camera delivery for corporate and creative projects in Madhapur.",
  },
  {
    name: "Begumpet",
    slug: "begumpet",
    description: "Camera equipment delivery service in Begumpet area.",
  },
]

export default function AreasPage() {
  return (
    <>
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Service Areas" }]} />

          <div className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/hyderabad-camera-delivery.png')",
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
                  <span className="text-red-400 font-mono text-sm tracking-widest">EQUIPMENT DELIVERY</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide leading-tight">
                  CAMERA RENTAL <span className="text-red-500">SERVICE AREAS</span>
                </h1>
                <p className="text-xl text-zinc-300 mb-6 max-w-2xl font-body">
                  D&apos;RENTALS provides professional camera equipment delivery across Hyderabad and surrounding areas.
                  Browse our service locations below.
                </p>
              </div>
            </div>
          </div>

          <div className="py-12">
            <div className="mb-10">
              <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                Our Equipment Delivery Areas
              </h2>
              <p className="text-zinc-300 mb-8 font-body">
                While our main location is in Yousufguda, we provide convenient equipment delivery services to all major
                areas across Hyderabad. Select your area below to learn more about our camera rental services in your
                location.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className="transition-transform hover:-translate-y-1 duration-300"
                  >
                    <Card className="h-full bg-zinc-900 border-zinc-800 hover:border-red-500 transition-colors rounded-none">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-5 w-5 text-red-500" />
                          <h3 className="font-heading text-xl text-white">{area.name}</h3>
                        </div>
                        <p className="text-zinc-400 font-body">{area.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                Equipment Delivery Process
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-zinc-800 bg-zinc-900">
                  <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-heading mb-4">
                    1
                  </div>
                  <h3 className="font-heading text-xl text-white mb-3">BOOK YOUR EQUIPMENT</h3>
                  <p className="text-zinc-300">
                    Browse our equipment catalog and contact us to reserve your gear. We&apos;ll confirm availability and
                    provide a quote.
                  </p>
                </div>

                <div className="p-6 border border-zinc-800 bg-zinc-900">
                  <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-heading mb-4">
                    2
                  </div>
                  <h3 className="font-heading text-xl text-white mb-3">SCHEDULE DELIVERY</h3>
                  <p className="text-zinc-300">
                    Coordinate delivery time and location. We&apos;ll arrange for the equipment to be delivered to your
                    specified address.
                  </p>
                </div>

                <div className="p-6 border border-zinc-800 bg-zinc-900">
                  <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-heading mb-4">
                    3
                  </div>
                  <h3 className="font-heading text-xl text-white mb-3">RECEIVE & RETURN</h3>
                  <p className="text-zinc-300">
                    Our team will deliver the equipment and provide a brief overview. When your rental period ends,
                    we&apos;ll arrange for pickup.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 border border-red-500 bg-zinc-900">
              <div className="text-center">
                <h2 className="text-3xl font-heading text-white mb-4">NEED EQUIPMENT DELIVERED?</h2>
                <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
                  Contact our team to discuss your equipment needs and delivery options. We serve all major areas in
                  Hyderabad.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-heading transition-colors"
                >
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
