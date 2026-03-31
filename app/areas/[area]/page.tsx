import { getPopularEquipmentForArea, getCategories } from "@/lib/data"
import EquipmentGrid from "@/components/equipment-grid"
import { Suspense } from "react"
import { EquipmentSkeleton } from "@/components/skeletons"
import { unstable_noStore } from "next/cache"
import Breadcrumb from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Phone, Mail, Camera } from "lucide-react"
import { siteConfig } from "@/config/site"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Import the area description generator
import { generateAreaDescription } from "@/lib/meta-description"
import { FAQSchema } from "@/components/structured-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Define valid areas
const validAreas = [
  "hyderabad",
  "kukatpally",
  "dilsukhnagar",
  "yousufguda",
  "hitech-city",
  "gachibowli",
  "banjara-hills",
  "jubilee-hills",
  "ameerpet",
  "secunderabad",
  "madhapur",
  "begumpet",
]

// Area-specific metadata
const areaMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  hyderabad: {
    title: "Camera Rental in Hyderabad | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras, DSLRs, 4K cameras, and accessories with delivery across Hyderabad. Top-quality equipment for filmmakers and production companies.",
    keywords: [
      "camera rental hyderabad",
      "dslr rental hyderabad",
      "4k camera rental hyderabad",
      "cinema equipment hyderabad",
      "camera delivery hyderabad",
      "film equipment hyderabad",
      "video production hyderabad",
      "camera gear hyderabad",
    ],
  },
  kukatpally: {
    title: "Camera Rental in Kukatpally | Equipment Delivery Service",
    description:
      "Professional camera equipment rental with delivery in Kukatpally, Hyderabad. DSLR, 4K cameras, lenses, and accessories for your production needs.",
    keywords: [
      "camera rental kukatpally",
      "dslr rental kukatpally",
      "camera equipment kukatpally",
      "film equipment kukatpally",
      "camera delivery kukatpally",
      "video camera rental kukatpally",
      "lens rental kukatpally",
    ],
  },
  dilsukhnagar: {
    title: "Camera Rental in Dilsukhnagar | Professional Equipment Delivery",
    description:
      "Rent cinema cameras, DSLRs, and accessories with delivery in Dilsukhnagar. Quality equipment for filmmakers and photographers in Hyderabad.",
    keywords: [
      "camera rental dilsukhnagar",
      "dslr rental dilsukhnagar",
      "camera equipment dilsukhnagar",
      "film gear dilsukhnagar",
      "camera delivery dilsukhnagar",
      "video camera rental dilsukhnagar",
      "gimbal rental dilsukhnagar",
    ],
  },
  yousufguda: {
    title: "Camera Rental in Yousufguda | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery in Yousufguda, Hyderabad. High-quality cameras and accessories for your production.",
    keywords: [
      "camera rental yousufguda",
      "dslr rental yousufguda",
      "camera equipment yousufguda",
      "film gear yousufguda",
      "camera delivery yousufguda",
      "cinema camera rental yousufguda",
      "lens rental yousufguda",
    ],
  },
  "hitech-city": {
    title: "Camera Rental in Hitech City | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras and equipment with delivery in Hitech City. Premium gear for corporate videos and productions.",
    keywords: [
      "camera rental hitech city",
      "dslr rental hitech city",
      "camera equipment hitech city",
      "film gear hitech city",
      "camera delivery hitech city",
      "corporate video equipment hitech city",
      "4k camera rental hitech city",
    ],
  },
  gachibowli: {
    title: "Camera Rental in Gachibowli | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery in Gachibowli. High-end cameras and accessories for filmmakers and content creators.",
    keywords: [
      "camera rental gachibowli",
      "dslr rental gachibowli",
      "camera equipment gachibowli",
      "film gear gachibowli",
      "camera delivery gachibowli",
      "cinema camera rental gachibowli",
      "gimbal rental gachibowli",
    ],
  },
  "banjara-hills": {
    title: "Camera Rental in Banjara Hills | Premium Equipment Delivery",
    description:
      "Premium camera equipment rental with delivery in Banjara Hills. Professional cinema cameras and accessories for high-end productions.",
    keywords: [
      "camera rental banjara hills",
      "dslr rental banjara hills",
      "camera equipment banjara hills",
      "film gear banjara hills",
      "camera delivery banjara hills",
      "red camera rental banjara hills",
      "arri camera rental banjara hills",
    ],
  },
  "jubilee-hills": {
    title: "Camera Rental in Jubilee Hills | Premium Equipment Delivery",
    description:
      "Rent premium cinema cameras and equipment with delivery in Jubilee Hills. Professional gear for film productions and commercial shoots.",
    keywords: [
      "camera rental jubilee hills",
      "dslr rental jubilee hills",
      "camera equipment jubilee hills",
      "film gear jubilee hills",
      "camera delivery jubilee hills",
      "cinema camera rental jubilee hills",
      "professional lens rental jubilee hills",
    ],
  },
  ameerpet: {
    title: "Camera Rental in Ameerpet | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery to Ameerpet. Quality cameras and accessories for filmmakers and photographers.",
    keywords: [
      "camera rental ameerpet",
      "dslr rental ameerpet",
      "camera equipment ameerpet",
      "film gear ameerpet",
      "camera delivery ameerpet",
      "video camera rental ameerpet",
      "photography equipment ameerpet",
    ],
  },
  secunderabad: {
    title: "Camera Rental in Secunderabad | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras and equipment with delivery in Secunderabad. Quality gear for all your production needs.",
    keywords: [
      "camera rental secunderabad",
      "dslr rental secunderabad",
      "camera equipment secunderabad",
      "film gear secunderabad",
      "camera delivery secunderabad",
      "video production equipment secunderabad",
      "lens rental secunderabad",
    ],
  },
  madhapur: {
    title: "Camera Rental in Madhapur | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery in Madhapur. High-quality cameras and accessories for corporate and creative productions.",
    keywords: [
      "camera rental madhapur",
      "dslr rental madhapur",
      "camera equipment madhapur",
      "film gear madhapur",
      "camera delivery madhapur",
      "4k camera rental madhapur",
      "corporate video equipment madhapur",
    ],
  },
  begumpet: {
    title: "Camera Rental in Begumpet | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras and equipment with delivery in Begumpet. Quality gear for filmmakers and content creators.",
    keywords: [
      "camera rental begumpet",
      "dslr rental begumpet",
      "camera equipment begumpet",
      "film gear begumpet",
      "camera delivery begumpet",
      "video camera rental begumpet",
      "photography equipment begumpet",
    ],
  },
}

// Area-specific content
const areaContent: Record<
  string,
  {
    headline: string
    subheadline: string
    description: string[]
    popularCategories: string[]
    faqs: { question: string; answer: string }[]
  }
> = {
  hyderabad: {
    headline: "CAMERA RENTAL IN HYDERABAD",
    subheadline: "Professional Cinema Equipment Delivered Across Hyderabad",
    description: [
      "D'RENTALS provides professional camera equipment rental services with delivery across Hyderabad. Whether you're a filmmaker, photographer, or content creator, we offer a wide range of high-quality cameras, lenses, and accessories to meet your production needs.",
      "Our equipment delivery service covers all areas of Hyderabad, including Kukatpally, Dilsukhnagar, Banjara Hills, and more. We ensure timely delivery and pickup, allowing you to focus on your creative work without worrying about logistics.",
      "With competitive rates and flexible rental periods, D'RENTALS is the preferred choice for cinema equipment rental in Hyderabad. Our team of experts is always available to provide technical support and guidance to help you choose the right equipment for your project.",
      "We specialize in providing top-tier camera gear for film productions, commercial shoots, and independent projects. From high-resolution cinema cameras like RED and ARRI to versatile DSLRs and mirrorless systems, our inventory is meticulously maintained and ready for your next shoot. Explore our extensive catalog and experience seamless rental services tailored for Hyderabad's creative community.",
    ],
    popularCategories: ["DSLR Cameras", "Cinema Cameras", "Camera Lenses", "Lighting Equipment", "Audio Equipment"],
    faqs: [
      {
        question: "How does equipment delivery work in Hyderabad?",
        answer:
          "We coordinate delivery times based on your schedule. Our team will deliver the equipment to your specified location in Hyderabad and provide a brief overview of the gear. We aim for prompt and reliable service to ensure your production stays on track.",
      },
      {
        question: "What types of cameras are available for rent in Hyderabad?",
        answer:
          "We offer a wide range of equipment including DSLRs, mirrorless cameras, cinema cameras (e.g., RED, ARRI, Sony FX series), and more. Our inventory also includes a variety of lenses, gimbals, lighting kits, and audio recording gear. Browse our equipment catalog to see our full inventory.",
      },
      {
        question: "How far in advance should I book equipment for delivery to Hyderabad?",
        answer:
          "We recommend booking at least 48-72 hours in advance to ensure availability, especially for popular equipment and during peak seasons. For urgent requests, contact us directly to check immediate availability and express delivery options.",
      },
      {
        question: "Is there a delivery fee for Hyderabad?",
        answer:
          "Delivery fees vary based on location within Hyderabad and the volume/type of equipment. Contact us for a precise quote specific to your delivery needs. We strive to keep our delivery charges competitive and transparent.",
      },
      {
        question: "Do you offer technical support for rented equipment?",
        answer:
          "Yes, our experienced team provides technical guidance and support for all rented equipment. We can assist with basic setup, troubleshooting, and recommendations to ensure you get the most out of your gear. Feel free to reach out if you have any questions during your rental period.",
      },
    ],
  },
  kukatpally: {
    headline: "CAMERA RENTAL IN KUKATPALLY",
    subheadline: "Professional Equipment Delivered to Your Doorstep",
    description: [
      "D'RENTALS offers convenient camera equipment rental services with delivery to Kukatpally and surrounding areas. Our extensive inventory includes professional DSLRs, cinema cameras, lenses, and accessories for all your production needs.",
      "Located in Hyderabad, we provide reliable delivery services to Kukatpally, ensuring you have access to top-quality equipment without the hassle of transportation. Our flexible rental periods accommodate projects of any duration.",
      "Whether you're shooting a wedding, corporate event, or independent film in Kukatpally, our professional-grade equipment will help you achieve the results you desire. Contact us today to discuss your equipment requirements.",
      "We understand the fast-paced nature of production in Kukatpally. Our streamlined rental process ensures quick booking and efficient delivery, so you can focus on capturing stunning visuals. From Canon and Sony DSLRs to advanced cinema lenses, find everything you need for your next project right here.",
    ],
    popularCategories: ["DSLR Cameras", "Camera Lenses", "Gimbals", "Lighting Kits", "Audio Recording"],
    faqs: [
      {
        question: "How quickly can I get equipment delivered to Kukatpally?",
        answer:
          "For most standard rentals, we can arrange delivery to Kukatpally within 24-48 hours. For urgent requirements, please call us directly, and we'll do our best to accommodate your request.",
      },
      {
        question: "What kind of identification is required for rental in Kukatpally?",
        answer:
          "Typically, we require a valid government-issued ID (like an Aadhar card or passport) and a security deposit. Specific requirements may vary based on the equipment value. Our team will guide you through the process.",
      },
      {
        question: "Can I pick up equipment directly from your location if I'm in Kukatpally?",
        answer:
          "Yes, you are welcome to pick up equipment from our main location in Yousufguda. Please schedule an appointment in advance to ensure your gear is ready for collection.",
      },
      {
        question: "Do you offer long-term rental discounts for projects in Kukatpally?",
        answer:
          "We offer competitive weekly and monthly rates, which provide significant discounts compared to daily rentals. Contact us with your project duration for a customized quote.",
      },
    ],
  },
  dilsukhnagar: {
    headline: "CAMERA RENTAL IN DILSUKHNAGAR",
    subheadline: "Quality Equipment Delivered to Your Location",
    description: [
      "D'RENTALS provides professional camera equipment rental with convenient delivery to Dilsukhnagar. Our comprehensive selection includes DSLRs, cinema cameras, lenses, and accessories to support your creative projects.",
      "Based in Hyderabad, we offer reliable delivery services to Dilsukhnagar, ensuring you have access to high-quality equipment without the need for transportation. Our flexible rental options cater to projects of various durations and budgets.",
      "Whether you're a professional filmmaker or an amateur photographer in Dilsukhnagar, our equipment will help you achieve professional results. Contact our team to discuss your specific equipment needs.",
      "We are committed to supporting the creative community in Dilsukhnagar. Our inventory includes popular models like the Canon 5D Mark IV, Sony Alpha series, and a range of prime and zoom lenses. Get ready to capture stunning visuals with D'RENTALS.",
    ],
    popularCategories: ["DSLR Cameras", "Video Cameras", "Camera Lenses", "Lighting Equipment", "Stabilizers"],
    faqs: [
      {
        question: "What is the rental process for Dilsukhnagar residents?",
        answer:
          "The process is simple: browse our catalog, contact us to confirm availability and get a quote, complete the necessary paperwork and security deposit, and we'll arrange delivery to your address in Dilsukhnagar.",
      },
      {
        question: "Do you provide camera operators or technicians with the rental?",
        answer:
          "Our primary service is equipment rental. However, if you require a camera operator or technician, we can connect you with trusted professionals in our network. Please inquire about this service when booking.",
      },
      {
        question: "What if the equipment gets damaged during the rental period?",
        answer:
          "We recommend reviewing our rental agreement for details on liability and insurance. Minor wear and tear are expected, but significant damage may incur repair or replacement costs. We encourage careful handling of all equipment.",
      },
      {
        question: "Can I rent equipment for a single day in Dilsukhnagar?",
        answer:
          "Yes, we offer flexible daily rental rates. You can rent equipment for as short as one day, or opt for our discounted weekly and monthly rates for longer projects.",
      },
    ],
  },
  yousufguda: {
    headline: "CAMERA RENTAL IN YOUSUFGUDA",
    subheadline: "Professional Cinema Equipment Delivered to You",
    description: [
      "D'RENTALS offers premium camera equipment rental with convenient delivery to Yousufguda. Our main location in Hyderabad allows us to provide quick and reliable delivery services to meet your production needs.",
      "Our extensive inventory includes professional-grade cameras, lenses, lighting equipment, and accessories from leading brands. Whether you're shooting a film, commercial, or event in Yousufguda, we have the equipment you need.",
      "With competitive rates and flexible rental periods, D'RENTALS is the preferred choice for cinema equipment rental in Yousufguda. Contact us today to discuss your equipment requirements and delivery options.",
      "As our primary hub, Yousufguda benefits from the fastest delivery times and direct access to our full inventory. We are dedicated to providing seamless service for all your photography and videography projects, ensuring you have the best tools at your disposal.",
    ],
    popularCategories: [
      "Cinema Cameras",
      "Professional Lenses",
      "Lighting Kits",
      "Audio Equipment",
      "Camera Accessories",
    ],
    faqs: [
      {
        question: "What are your business hours for pickup/delivery in Yousufguda?",
        answer:
          "Our standard business hours for pickups and deliveries in Yousufguda are Monday to Friday, 9:00 AM to 6:00 PM, and Saturday, 10:00 AM to 4:00 PM. We are closed on Sundays. Please schedule your times in advance.",
      },
      {
        question: "Do you offer training or tutorials for using the equipment?",
        answer:
          "While we don't offer formal training, our team provides a brief orientation upon delivery or pickup to ensure you're comfortable with the basic operation of the equipment. For in-depth learning, we recommend online resources or professional workshops.",
      },
      {
        question: "Can I extend my rental period if needed?",
        answer:
          "Rental extensions are subject to equipment availability. Please contact us as soon as possible if you wish to extend your rental, and we will do our best to accommodate your request.",
      },
      {
        question: "What payment methods do you accept for rentals in Yousufguda?",
        answer:
          "We accept various payment methods including bank transfers, UPI, and major credit/debit cards. A security deposit is also required, which will be refunded upon the safe return of the equipment.",
      },
    ],
  },
  "hitech-city": {
    headline: "CAMERA RENTAL IN HITECH CITY",
    subheadline: "Professional Equipment for Corporate and Creative Productions",
    description: [
      "D'RENTALS provides high-quality camera equipment rental with delivery to Hitech City. Our service caters to corporate video productions, tech events, and creative projects in this bustling IT hub of Hyderabad.",
      "Our inventory includes professional DSLRs, 4K cameras, cinema cameras, and a wide range of lenses and accessories. We deliver directly to your office or shooting location in Hitech City, saving you time and hassle.",
      "With our expertise in corporate video production equipment, we can recommend the perfect setup for your specific needs. Contact us to discuss your project requirements and delivery schedule.",
      "Hitech City's dynamic environment demands reliable and cutting-edge equipment. We offer everything from high-resolution cameras for product launches to versatile lighting for corporate interviews. Trust D'RENTALS to power your next big project in the tech capital.",
    ],
    popularCategories: [
      "4K Cameras",
      "Professional DSLRs",
      "Corporate Video Equipment",
      "Lighting Setups",
      "Audio Systems",
    ],
    faqs: [
      {
        question: "Do you offer equipment for live streaming events in Hitech City?",
        answer:
          "Yes, we have a selection of cameras, switchers, and audio equipment suitable for live streaming. Please specify your requirements when contacting us, and we can recommend a suitable package.",
      },
      {
        question: "Can I rent equipment for a corporate event in Hitech City?",
        answer:
          "Absolutely. We frequently provide equipment for corporate events, conferences, and product launches in Hitech City. Our team can help you select the right cameras, lenses, and audio gear for your event.",
      },
      {
        question: "What is the typical delivery time to Hitech City?",
        answer:
          "We strive for prompt deliveries to Hitech City, often within a few hours for urgent requests, or scheduled for the next business day for standard bookings. We'll confirm the exact delivery window upon booking.",
      },
    ],
  },
  gachibowli: {
    headline: "CAMERA RENTAL IN GACHIBOWLI",
    subheadline: "Premium Equipment Delivered to Your Location",
    description: [
      "D'RENTALS offers professional camera equipment rental with convenient delivery to Gachibowli. Our service is perfect for corporate videos, tech events, and creative productions in this prominent area of Hyderabad.",
      "Our extensive inventory includes high-end DSLRs, cinema cameras, professional lenses, and accessories from leading brands. We deliver directly to your location in Gachibowli, ensuring you have the equipment you need when you need it.",
      "With competitive rates and flexible rental periods, D'RENTALS is the preferred choice for camera equipment rental in Gachibowli. Contact our team to discuss your specific equipment needs and delivery options.",
      "Gachibowli is a hub for innovation, and your productions deserve the best. We provide cutting-edge camera technology, from drone cameras for aerial shots to specialized lenses for cinematic depth. Partner with D'RENTALS for your next creative endeavor.",
    ],
    popularCategories: [
      "Professional DSLRs",
      "Cinema Cameras",
      "Corporate Video Equipment",
      "Lighting Kits",
      "Audio Systems",
    ],
    faqs: [
      {
        question: "Do you provide lighting equipment suitable for outdoor shoots in Gachibowli?",
        answer:
          "Yes, we have a range of portable lighting solutions, including LED panels and battery-powered lights, perfect for outdoor shoots in Gachibowli. We can also provide light stands and modifiers.",
      },
      {
        question: "Can I get a custom rental package for my project in Gachibowli?",
        answer:
          "We encourage custom packages. Share your project details and budget with us, and our experts will curate a tailored equipment list to meet your specific requirements.",
      },
      {
        question: "What is the process for returning equipment in Gachibowli?",
        answer:
          "At the end of your rental period, we will arrange a convenient pickup time and location in Gachibowli. Please ensure all equipment is packed securely in its original cases for a smooth return process.",
      },
    ],
  },
  "banjara-hills": {
    headline: "CAMERA RENTAL IN BANJARA HILLS",
    subheadline: "Premium Cinema Equipment for High-End Productions",
    description: [
      "D'RENTALS provides premium camera equipment rental with delivery to Banjara Hills. Our service caters to high-end productions, fashion shoots, and commercial projects in this upscale area of Hyderabad.",
      "Our inventory includes top-of-the-line cinema cameras, professional DSLRs, premium lenses, and accessories from renowned brands. We deliver directly to your shooting location in Banjara Hills, ensuring a seamless experience.",
      "With our expertise in high-end production equipment, we can recommend the perfect setup for your specific needs. Contact us to discuss your project requirements and delivery schedule.",
      "Banjara Hills is synonymous with luxury and quality, and our equipment reflects that. Access the latest RED and ARRI cameras, specialized prime lenses, and advanced audio solutions for your most demanding projects. Elevate your production value with D'RENTALS.",
    ],
    popularCategories: ["RED Cameras", "ARRI Equipment", "Premium Lenses", "High-End Lighting", "Professional Audio"],
    faqs: [
      {
        question: "Do you offer insurance for high-value equipment rented in Banjara Hills?",
        answer:
          "While we do not provide insurance directly, we highly recommend that clients arrange their own production insurance to cover rented equipment. We can provide necessary documentation for your insurance provider.",
      },
      {
        question: "Can I get a technician to assist with setup for a shoot in Banjara Hills?",
        answer:
          "We can connect you with experienced camera assistants or DITs who can help with equipment setup and management on your set in Banjara Hills. This service is arranged separately.",
      },
      {
        question: "What is the minimum rental period for premium equipment in Banjara Hills?",
        answer:
          "Most premium equipment can be rented for a minimum of one day. However, for certain specialized items, a longer minimum rental period might apply. Please check individual product details or contact us.",
      },
    ],
  },
  "jubilee-hills": {
    headline: "CAMERA RENTAL IN JUBILEE HILLS",
    subheadline: "Premium Equipment for Professional Productions",
    description: [
      "D'RENTALS offers premium camera equipment rental with delivery to Jubilee Hills. Our service is ideal for film productions, commercial shoots, and high-end projects in this prestigious area of Hyderabad.",
      "Our extensive inventory includes professional cinema cameras, high-end DSLRs, premium lenses, and accessories from leading brands. We deliver directly to your shooting location in Jubilee Hills, ensuring you have the equipment you need.",
      "With competitive rates and flexible rental periods, D'RENTALS is the preferred choice for premium camera equipment rental in Jubilee Hills. Contact our team to discuss your specific equipment needs and delivery options.",
      "Jubilee Hills is a hub for creative excellence. We provide the tools to match your ambition, from advanced drone systems for aerial cinematography to comprehensive sound recording packages. Make your next project in Jubilee Hills a masterpiece with D'RENTALS.",
    ],
    popularCategories: ["Cinema Cameras", "Premium DSLRs", "Professional Lenses", "High-End Lighting", "Audio Systems"],
    faqs: [
      {
        question: "Do you offer discounts for student film projects in Jubilee Hills?",
        answer:
          "We are supportive of emerging talent! While we don't have a standing student discount, please contact us with your project details, and we'll see how we can best assist you.",
      },
      {
        question: "Can I test the equipment before renting in Jubilee Hills?",
        answer:
          "Yes, we encourage clients to test equipment before rental. Please schedule an appointment at our main location in Yousufguda to inspect and test the gear you intend to rent.",
      },
      {
        question: "What is your cancellation policy for rentals in Jubilee Hills?",
        answer:
          "Our cancellation policy varies based on the notice period. Generally, cancellations made well in advance may incur a minimal fee, while last-minute cancellations might be subject to a higher charge. Please refer to our full terms and conditions.",
      },
    ],
  },
  ameerpet: {
    headline: "CAMERA RENTAL IN AMEERPET",
    subheadline: "Professional Equipment for Educational and Commercial Projects",
    description: [
      "D'RENTALS provides professional camera equipment rental with delivery to Ameerpet. Our service caters to educational institutions, training centers, and commercial productions in this central area of Hyderabad.",
      "Our inventory includes DSLRs, video cameras, lenses, and accessories suitable for learning and professional use. We deliver directly to your location in Ameerpet, ensuring convenient access to quality equipment.",
      "With competitive rates and flexible rental periods, D'RENTALS is the preferred choice for camera equipment rental in Ameerpet. Contact our team to discuss your specific equipment needs and delivery options.",
      "Ameerpet's diverse needs, from educational content to small business commercials, are met with our versatile range of cameras and accessories. We offer user-friendly yet powerful equipment to help you achieve your production goals efficiently.",
    ],
    popularCategories: ["DSLR Cameras", "Video Cameras", "Camera Lenses", "Basic Lighting", "Audio Equipment"],
    faqs: [
      {
        question: "Do you offer long-term rental options for educational institutions in Ameerpet?",
        answer:
          "Yes, we provide special long-term rental packages for educational institutions and training centers in Ameerpet. Please contact us to discuss your specific requirements and get a customized quote.",
      },
      {
        question: "Can I rent a camera for photography workshops in Ameerpet?",
        answer:
          "Our DSLRs and mirrorless cameras are perfect for photography workshops. We can provide multiple units if needed for group sessions. Inquire about bulk rental options.",
      },
      {
        question: "What is the minimum rental duration for equipment in Ameerpet?",
        answer:
          "The minimum rental duration is typically one day. However, we offer discounted rates for weekly and monthly rentals, which are ideal for longer projects or ongoing educational programs.",
      },
    ],
  },
  secunderabad: {
    headline: "CAMERA RENTAL IN SECUNDERABAD",
    subheadline: "Professional Equipment Delivered to Your Location",
    description: [
      "D'RENTALS offers professional camera equipment rental with convenient delivery to Secunderabad. Our service provides access to high-quality equipment for filmmakers, photographers, and content creators in this historic part of the twin cities.",
      "Our extensive inventory includes DSLRs, cinema cameras, lenses, and accessories from leading brands. We deliver directly to your location in Secunderabad, ensuring you have the equipment you need when you need it.",
      "With competitive rates and flexible rental periods, D'RENTALS is the preferred choice for camera equipment rental in Secunderabad. Contact our team to discuss your specific equipment needs and delivery options.",
      "Secunderabad's rich heritage and modern developments provide diverse backdrops for your projects. Our reliable delivery service ensures you have access to the best camera gear, from vintage lenses for period pieces to modern drones for sweeping cityscapes.",
    ],
    popularCategories: ["DSLR Cameras", "Cinema Cameras", "Camera Lenses", "Lighting Equipment", "Audio Systems"],
    faqs: [
      {
        question: "Do you offer equipment for event photography/videography in Secunderabad?",
        answer:
          "Yes, we have a wide range of cameras, lenses, and lighting suitable for events like weddings, corporate gatherings, and concerts in Secunderabad. We can help you choose the ideal setup.",
      },
      {
        question: "Can I get a demonstration of the equipment before renting in Secunderabad?",
        answer:
          "While we don't offer on-site demonstrations in Secunderabad, you can schedule a visit to our main location in Yousufguda for a hands-on demonstration of the equipment you're interested in.",
      },
      {
        question: "What is the typical turnaround time for equipment delivery to Secunderabad?",
        answer:
          "We aim for efficient deliveries to Secunderabad, typically within 24-48 hours for standard bookings. For urgent needs, please contact us directly to check for faster options.",
      },
    ],
  },
  madhapur: {
    headline: "CAMERA RENTAL IN MADHAPUR",
    subheadline: "Professional Equipment for Corporate and Creative Productions",
    description: [
      "D'RENTALS provides high-quality camera equipment rental with delivery to Madhapur. Our service caters to corporate video productions, tech events, and creative projects in this commercial hub of Hyderabad.",
      "Our inventory includes professional DSLRs, 4K cameras, cinema cameras, and a wide range of lenses and accessories. We deliver directly to your office or shooting location in Madhapur, saving you time and hassle.",
      "With our expertise in corporate and creative production equipment, we can recommend the perfect setup for your specific needs. Contact us to discuss your project requirements and delivery schedule.",
      "Madhapur's vibrant corporate landscape requires reliable and high-performance equipment. We offer everything from compact mirrorless cameras for vlogging to professional cinema cameras for high-budget commercials. Get your gear delivered directly to your studio or office.",
    ],
    popularCategories: [
      "4K Cameras",
      "Professional DSLRs",
      "Corporate Video Equipment",
      "Lighting Setups",
      "Audio Systems",
    ],
    faqs: [
      {
        question: "Do you offer equipment for product photography/videography in Madhapur?",
        answer:
          "Yes, we have a selection of macro lenses, studio lighting, and high-resolution cameras ideal for product photography and videography. We can help you choose the best gear for showcasing your products.",
      },
      {
        question: "Can I rent equipment for a short-term project in Madhapur?",
        answer:
          "Yes, we offer flexible daily rental options, perfect for short-term projects, workshops, or quick shoots in Madhapur. Our rates are competitive, and the process is straightforward.",
      },
      {
        question: "What kind of support do you offer for corporate clients in Madhapur?",
        answer:
          "We offer dedicated support for our corporate clients, including tailored equipment recommendations, flexible delivery/pickup schedules, and technical assistance to ensure your corporate productions run smoothly.",
      },
    ],
  },
  begumpet: {
    headline: "CAMERA RENTAL IN BEGUMPET",
    subheadline: "Quality Equipment Delivered to Your Location",
    description: [
      "D'RENTALS offers professional camera equipment rental with convenient delivery to Begumpet. Our service provides access to high-quality equipment for filmmakers, photographers, and content creators in this central area of Hyderabad.",
      "Our extensive inventory includes DSLRs, cinema cameras, lenses, and accessories from leading brands. We deliver directly to your location in Begumpet, ensuring you have the equipment you need when you need it.",
      "With competitive rates and flexible rental periods, D'RENTALS is the preferred choice for camera equipment rental in Begumpet. Contact our team to discuss your specific equipment needs and delivery options.",
      "Begumpet's blend of commercial and residential areas makes it a versatile location for various shoots. We provide reliable camera and lighting solutions for everything from fashion editorials to documentary filmmaking, delivered right to your set.",
    ],
    popularCategories: ["DSLR Cameras", "Video Cameras", "Camera Lenses", "Lighting Equipment", "Audio Systems"],
    faqs: [
      {
        question: "Do you have equipment suitable for indoor studio shoots in Begumpet?",
        answer:
          "Yes, we offer a range of studio lighting, backdrops, and cameras ideal for indoor studio shoots. Our team can help you select the right gear to create professional-quality studio content.",
      },
      {
        question: "Can I get a rental agreement and invoice for my company in Begumpet?",
        answer:
          "Yes, we provide proper rental agreements and GST-compliant invoices for all corporate and individual rentals. Please provide your company details during the booking process.",
      },
      {
        question: "What if I need equipment on short notice in Begumpet?",
        answer:
          "While advance booking is recommended, we understand urgent needs arise. Please call us directly for short-notice requests in Begumpet, and we will do our best to accommodate based on availability.",
      },
    ],
  },
}

// Generate metadata for each area page
export async function generateMetadata({ params }: { params: { area: string } }): Promise<Metadata> {
  const area = params.area.toLowerCase()

  // Check if area is valid
  if (!validAreas.includes(area)) {
    return {
      title: "Area Not Found | D'RENTALS by Penmen Studios",
      description: "The requested area could not be found.",
    }
  }

  // Format area name for display (convert hyphenated to spaces and capitalize)
  const formattedArea = area.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Get area-specific metadata or use default
  const metadata = areaMetadata[area] || {
    title: `Camera Rental in ${formattedArea} | Professional Equipment Delivery`,
    description: generateAreaDescription(formattedArea),
    keywords: [
      `camera rental ${area}`,
      `dslr rental ${area}`,
      `camera equipment ${area}`,
      `film gear ${area}`,
      `camera delivery ${area}`,
    ],
  }

  // Ensure we have a proper canonical URL for this area page
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(", "),
    // Add explicit path for canonical URL
    alternates: {
      canonical: `/areas/${area}`,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
    },
  }
}

// Update the component to ensure proper scroll behavior
export default async function AreaPage({ params }: { params: { area: string } }) {
  // Disable caching for this page
  unstable_noStore()

  const area = params.area.toLowerCase()

  // Check if area is valid
  if (!validAreas.includes(area)) {
    notFound()
  }

  // Format area name for display (convert hyphenated to spaces and capitalize)
  const formattedArea = area.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Get area-specific content or use default
  const content = areaContent[area] || {
    headline: `CAMERA RENTAL IN ${formattedArea.toUpperCase()}`,
    subheadline: `Professional Equipment Delivered to ${formattedArea}`,
    description: [
      `D'RENTALS provides professional camera equipment rental with delivery to ${formattedArea}. Our extensive inventory includes DSLRs, cinema cameras, lenses, and accessories for all your production needs.`,
      `Based in Hyderabad, we offer reliable delivery services to ${formattedArea}, ensuring you have access to high-quality equipment without the need for transportation. Our flexible rental options cater to projects of various durations and budgets.`,
      `Whether you're a professional filmmaker or an amateur photographer in ${formattedArea}, our equipment will help you achieve professional results. Contact our team to discuss your specific equipment needs.`,
    ],
    popularCategories: ["DSLR Cameras", "Cinema Cameras", "Camera Lenses", "Lighting Equipment", "Audio Equipment"],
    faqs: [
      {
        question: `How does equipment delivery work in ${formattedArea}?`,
        answer: `We coordinate delivery times based on your schedule. Our team will deliver the equipment to your specified location in ${formattedArea} and provide a brief overview of the gear.`,
      },
      {
        question: `What types of cameras are available for rent in ${formattedArea}?`,
        answer: `We offer a wide range of equipment including DSLRs, mirrorless cameras, cinema cameras, RED cameras, and more. Browse our equipment catalog to see our full inventory.`,
      },
      {
        question: `How far in advance should I book equipment for delivery to ${formattedArea}?`,
        answer: `We recommend booking at least 48-72 hours in advance to ensure availability, especially for popular equipment. For urgent requests, contact us directly to check availability.`,
      },
      {
        question: `Is there a delivery fee for ${formattedArea}?`,
        answer: `Delivery fees vary based on location and equipment volume. Contact us for a quote specific to your delivery in ${formattedArea}.`,
      },
    ],
  }

  return (
    <>
      <div className="bg-black min-h-screen">
        <FAQSchema faqs={content.faqs} />
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Areas", href: "/areas" }, { label: formattedArea }]} />

          <div className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/hyderabad-camera-delivery.png')`,
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
                  {content.headline}
                </h1>
                <p className="text-xl text-zinc-300 mb-6 max-w-2xl font-body">{content.subheadline}</p>
              </div>
            </div>
          </div>

          <div className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    Camera Equipment Rental in {formattedArea}
                  </h2>

                  {content.description.map((paragraph, index) => (
                    <p key={index} className="text-zinc-300 mb-4 font-body">
                      {paragraph}
                    </p>
                  ))}

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                      <h3 className="font-heading text-xl text-white mb-4">POPULAR EQUIPMENT CATEGORIES</h3>
                      <ul className="space-y-2">
                        {content.popularCategories.map((category, index) => (
                          <li key={index} className="flex items-center gap-2 text-zinc-300">
                            <Camera className="h-4 w-4 text-red-500" />
                            <span>{category}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                      <h3 className="font-heading text-xl text-white mb-4">CONTACT US</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                          <span className="text-zinc-300">Delivery available to all areas in {formattedArea}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-red-500" />
                          <a href={`tel:${siteConfig.location.phone}`} className="text-zinc-300 hover:text-white">
                            {siteConfig.location.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-red-500" />
                          <a href={`mailto:${siteConfig.location.email}`} className="text-zinc-300 hover:text-white">
                            {siteConfig.location.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
                      <Link href="/contact">INQUIRE ABOUT DELIVERY</Link>
                    </Button>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    Popular Equipment for Rent in {formattedArea}
                  </h2>
                  <Suspense fallback={<EquipmentSkeleton />}>
                    <PopularEquipment />
                  </Suspense>
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    Why Choose D&apos;RENTALS in {formattedArea}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">CONVENIENT DELIVERY</h3>
                      <p className="text-zinc-300">
                        We deliver camera equipment directly to your location in {formattedArea}, saving you time and
                        hassle.
                      </p>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">PROFESSIONAL EQUIPMENT</h3>
                      <p className="text-zinc-300">
                        Access high-quality, well-maintained cinema cameras and accessories from leading brands.
                      </p>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">FLEXIBLE RENTAL PERIODS</h3>
                      <p className="text-zinc-300">
                        Daily, weekly, and monthly rental options to accommodate projects of any duration.
                      </p>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">TECHNICAL SUPPORT</h3>
                      <p className="text-zinc-300">
                        Expert guidance and support to help you choose the right equipment for your specific needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    FAQs About Camera Rental in {formattedArea}
                  </h2>

                  <div className="space-y-6">
                    {content.faqs.map((faq, index) => (
                      <div key={index} className="p-6 border border-zinc-800 bg-zinc-900">
                        <h3 className="font-heading text-xl text-white mb-2">{faq.question}</h3>
                        <p className="text-zinc-300">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="p-6 border border-zinc-800 bg-zinc-900 mb-6">
                    <h3 className="font-heading text-xl text-white mb-4">EQUIPMENT CATEGORIES</h3>
                    <Suspense fallback={<div className="animate-pulse h-40 bg-zinc-800"></div>}>
                      <CategoryList />
                    </Suspense>
                  </div>

                  <div className="p-6 border border-zinc-800 bg-zinc-900 mb-6">
                    <h3 className="font-heading text-xl text-white mb-4">
                      SERVING AREAS NEAR {formattedArea.toUpperCase()}
                    </h3>
                    <ul className="space-y-2">
                      {validAreas
                        .filter((a) => a !== area)
                        .slice(0, 5)
                        .map((nearbyArea) => {
                          const displayArea = nearbyArea.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                          return (
                            <li key={nearbyArea}>
                              <Link
                                href={`/areas/${nearbyArea}`}
                                className="flex items-center gap-2 text-zinc-300 hover:text-white"
                              >
                                <MapPin className="h-4 w-4 text-red-500" />
                                <span>{displayArea}</span>
                              </Link>
                            </li>
                          )
                        })}
                    </ul>
                  </div>

                  <div className="p-6 border border-red-500 bg-zinc-900">
                    <h3 className="font-heading text-xl text-white mb-4">NEED ASSISTANCE?</h3>
                    <p className="text-zinc-300 mb-4">
                      Contact our team for personalized equipment recommendations and delivery options in{" "}
                      {formattedArea}.
                    </p>
                    <Button asChild className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <Link href="/contact">CONTACT US</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Component to display popular equipment
async function PopularEquipment() {
  // Disable caching for this component
  unstable_noStore()

  const equipment = await getPopularEquipmentForArea(4)

  return (
    <div>
      <EquipmentGrid equipment={equipment} />
      <div className="mt-6 text-center">
        <Button asChild variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent">
          <Link href="/equipment">VIEW ALL EQUIPMENT</Link>
        </Button>
      </div>
    </div>
  )
}

// Component to display categories
async function CategoryList() {
  // Disable caching for this component
  unstable_noStore()

  const categories = await getCategories()

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/equipment?category=${category.id}`}
            className="flex items-center gap-2 text-zinc-300 hover:text-white"
          >
            <Camera className="h-4 w-4 text-red-500" />
            <span>{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
