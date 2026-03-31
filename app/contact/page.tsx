import type { Metadata, Viewport } from "next"
import { Mail, MapPin, Phone } from "lucide-react"
import ContactForm from "@/components/contact-form"
import Breadcrumb from "@/components/breadcrumb"
import { generateMetadata, generateViewport } from "@/lib/seo-config"
import Script from "next/script"

// Add viewport export
export const viewport: Viewport = generateViewport()

export const metadata: Metadata = generateMetadata({
  title: "Contact Us",
  description:
    "Get in touch with D'RENTALS by Penmen Studios for all your cinema equipment rental needs in Hyderabad, India. Inquire about availability, pricing, or technical support.",
  keywords: [
    "camera rental contact",
    "equipment rental inquiry",
    "cinema gear support",
    "Hyderabad film equipment",
    "rental booking",
  ],
  path: "/contact",
  ogTitle: "Contact D'RENTALS | Professional Cinema Equipment Rental",
  ogDescription:
    "Reach out to our team for inquiries about equipment availability, pricing, or technical support. We're here to help with your production needs.",
})

export default function ContactPage() {
  return (
    <>
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Contact" }]} />

          <div className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop')",
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
                  <span className="text-red-400 font-mono text-sm tracking-widest">CONTACT US</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide leading-tight">
                  GET IN <span className="text-red-400">TOUCH</span>
                </h1>
                <p className="text-xl text-zinc-300 mb-6 max-w-2xl font-body">
                  Have questions about our equipment or need assistance with your rental? Our team is ready to help you
                  find the perfect gear for your production.
                </p>
              </div>
            </div>
          </div>

          <div className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="font-heading text-3xl text-white mb-6 tracking-wide">CONTACT INFORMATION</h2>
                <p className="text-zinc-300 mb-8 font-body">
                  Have questions about our equipment or need assistance with your rental? Our team is ready to help you
                  find the perfect gear for your production needs.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl text-white mb-2">LOCATION</h3>
                      <p className="text-zinc-400 font-mono">
                        Rajeev nagar, yousufguda,
                        <br />
                        hyderabad, 500045
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl text-white mb-2">PHONE</h3>
                      <p className="text-zinc-400 font-mono">+91 7794872701</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl text-white mb-2">EMAIL</h3>
                      <p className="text-zinc-400 font-mono">rentals@penmenstudios.com</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-zinc-800 bg-zinc-900 military-border mb-8">
                  <h3 className="font-heading text-xl text-white mb-3">BUSINESS HOURS</h3>
                  <ul className="space-y-2 font-mono text-zinc-400">
                    <li className="flex justify-between">
                      <span>Open:</span>
                      <span>24/7, 365 days a year</span>
                    </li>
                    <li className="flex justify-between">
                      <span></span>
                      <span className="text-sm text-zinc-500">For easier pickups and returns</span>
                    </li>
                  </ul>
                </div>

                <h3 className="font-heading text-xl text-white mb-4">FIND US</h3>
                <div className="w-full h-[400px] border border-zinc-800 military-border overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2005561379933!2d78.42171091222282!3d17.45011238337893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb912a21d0594d%3A0x14710ab1d818b8c3!2sPenmen%20studios!5e0!3m2!1sen!2sin!4v1745422238409!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="bg-zinc-800"
                    title="D'RENTALS by Penmen Studios Location Map"
                  />
                </div>
              </div>

              <div>
                <h2 className="font-heading text-3xl text-white mb-6 tracking-wide">SEND US A MESSAGE</h2>
                <p className="text-zinc-300 mb-6 font-body">
                  Have a question about equipment availability, pricing, or technical specifications? Fill out the form
                  below and our team will get back to you promptly.
                </p>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
