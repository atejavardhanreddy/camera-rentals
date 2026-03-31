// SEO configuration for the website
import type { Metadata, Viewport } from "next"

// Import the meta description utilities
import { truncateDescription, enhanceWithKeywords } from "./meta-description"

export const siteConfig = {
  name: "D'RENTALS | Professional Cinema Equipment by Penmen Studios",
  description:
    "Rent professional cinema cameras, lenses, and accessories for your production from Penmen Studios in Hyderabad, India.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rentals.penmenstudios.com",
  ogImage: "https://rentals.penmenstudios.com/og-image.jpg",
  links: {
    twitter: "https://twitter.com/penmenstudios",
    instagram: "https://instagram.com/penmenstudios",
  },
  keywords: [
    // General camera rental keywords
    "camera rental",
    "camera rentals in hyderabad",
    "hyderabad camera rental",
    "camera equipment rental in hyderabad",
    "cinema equipment",
    "film equipment",
    "camera gear",

    // Specific camera types
    "dslr camera for rent hyderabad",
    "dslr camera rentals in hyderabad",
    "dslr on rent in hyderabad",
    "dslr rent in hyderabad",
    "4k camera for rent in hyderabad",
    "5d camera rent in hyderabad",
    "canon 5d mark iv rent in hyderabad",
    "gopro camera for rent in hyderabad",
    "gopro rent in hyderabad",
    "gopro rental in hyderabad",
    "red camera rent in hyderabad",
    "red epic camera rental in hyderabad",
    "video camera for rent in hyderabad",

    // Accessories and equipment
    "camera lens for rent in hyderabad",
    "lens rental in hyderabad",
    "nikon lens for rent in hyderabad",
    "gimbal for rent in hyderabad",
    "gimbal rent in hyderabad",
    "gimbal rental hyderabad",

    // Location-specific
    "camera rentals in hyderabad near me",
    "camera rent in kukatpally",
    "camera rental in dilsukhnagar",
    "camera rental kukatpally",
    "camera rental in banjara hills",
    "camera rental in jubilee hills",
    "camera rental in hitech city",
    "camera rental in gachibowli",
    "camera rental in ameerpet",
    "camera rental in secunderabad",
    "camera rental in madhapur",
    "camera rental in begumpet",
    "hyd camera rentals",

    // Brand-specific
    "professional cameras",
    "cinema lenses",
    "lighting equipment",
    "audio equipment",
    "film production",
    "video production",
    "camera accessories",
    "Hyderabad",
    "India",
    "Penmen Studios",
    "RED camera rental",
    "ARRI camera rental",
    "Sony camera rental",
    "Canon camera rental",
    "Blackmagic camera rental",
  ],
  // Location information for local SEO
  location: {
    address: "Rajeev nagar, yousufguda, hyderabad, 500045",
    region: "Telangana",
    country: "India",
    phone: "+91 7794872701",
    email: "rentals@penmenstudios.com",
  },
  // Business information for structured data
  business: {
    name: "D'RENTALS by Penmen Studios",
    type: "CameraStore",
    openingHours: "Mo-Su 00:00-23:59", // Updated to 24/7
    priceRange: "₹₹₹",
    areas: [
      "Hyderabad",
      "Kukatpally",
      "Dilsukhnagar",
      "Yousufguda",
      "Hitech City",
      "Gachibowli",
      "Banjara Hills",
      "Jubilee Hills",
      "Ameerpet",
      "Secunderabad",
      "Madhapur",
      "Begumpet",
      "Telangana",
    ],
  },
}

// Generate viewport configuration
export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#E31B23",
  }
}

/**
 * Generates a canonical URL for the given path
 * Ensures consistent canonical URL generation across the site
 */
export function getCanonicalUrl(path = ""): string {
  // Remove trailing slash if present (except for root)
  const cleanPath = path === "/" ? path : path.replace(/\/$/, "")

  // Remove query parameters if present
  const pathWithoutQuery = cleanPath.split("?")[0]

  return `${siteConfig.url}${pathWithoutQuery}`
}

interface MetadataProps {
  title?: string
  description?: string
  keywords?: string | string[]
  path?: string
  ogTitle?: string
  ogDescription?: string
  alternateUrls?: Record<string, string>
}

// Helper function to generate metadata for each page
export function generateMetadata({
  title,
  description,
  keywords = [],
  path = "",
  ogTitle,
  ogDescription,
  alternateUrls = {},
}: MetadataProps): Metadata {
  const fullTitle = title ? `${title} | D'RENTALS by Penmen Studios` : siteConfig.name

  // Process the description to ensure it's optimized
  let fullDescription = description || siteConfig.description
  fullDescription = truncateDescription(fullDescription)

  // Enhance with keywords if they're provided
  if (keywords.length > 0) {
    fullDescription = enhanceWithKeywords(fullDescription, Array.isArray(keywords) ? keywords : keywords.split(","))
  }

  const canonicalUrl = getCanonicalUrl(path)
  const allKeywords = [...siteConfig.keywords, ...(Array.isArray(keywords) ? keywords : keywords.split(","))].join(", ")

  // Build alternates object with canonical URL
  const alternates: Record<string, any> = {
    canonical: canonicalUrl,
  }

  // Add any alternate language versions if provided
  if (Object.keys(alternateUrls).length > 0) {
    alternates.languages = alternateUrls
  }

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    metadataBase: new URL(siteConfig.url),
    alternates,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      title: ogTitle || fullTitle,
      description: ogDescription || fullDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [siteConfig.ogImage],
      creator: "@penmenstudios",
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "format-detection": "telephone=no",
    },
  }
}

// Generate JSON-LD structured data for the organization
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.business.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.location.phone,
      contactType: "customer service",
      email: siteConfig.location.email,
      areaServed: "IN",
      availableLanguage: ["en", "hi", "te"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.address,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    sameAs: [siteConfig.links.twitter, siteConfig.links.instagram],
  }
}

// Generate JSON-LD structured data for local business
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": siteConfig.business.type,
    name: siteConfig.business.name,
    image: `${siteConfig.url}/storefront.jpg`,
    "@id": siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.location.phone,
    priceRange: siteConfig.business.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.address,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.4501123,
      longitude: 78.4217109,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // All days
      opens: "00:00", // 24 hours
      closes: "23:59", // 24 hours
    },
    areaServed: siteConfig.business.areas.map((area) => ({
      "@type": "City",
      name: area,
    })),
  }
}

// Generate JSON-LD structured data for products (equipment)
export function generateProductSchema(equipment: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: equipment.name,
    image: equipment.mainImageUrl,
    description: equipment.description,
    brand: {
      "@type": "Brand",
      name: equipment.brand,
    },
    offers: {
      "@type": "Offer",
      price: equipment.dailyRate,
      priceCurrency: "INR",
      availability: equipment.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.business.name,
      },
    },
  }
}
