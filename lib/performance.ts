/**
 * Performance optimization utilities for the website
 */

// Define image size configurations for different components
export const imageSizes = {
  // Hero banner image sizes (keeping for structure but not used)
  hero: {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 1024px, 1920px",
  },
  // Equipment card image sizes
  equipmentCard: {
    mobile: 400,
    tablet: 300,
    desktop: 400,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
  // Equipment detail image sizes
  equipmentDetail: {
    main: {
      mobile: 600,
      tablet: 800,
      desktop: 1000,
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1000px",
    },
    thumbnail: {
      size: 150,
      sizes: "150px",
    },
  },
  // About page image sizes
  about: {
    mobile: 400,
    tablet: 600,
    desktop: 800,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px",
  },
}

// Assets to preload
export const criticalAssets: { rel: string; href: string; as?: string; type?: string }[] = []

// Font display strategies
export const fontDisplaySettings = {
  display: "swap", // Use 'swap' to prevent FOIT (Flash of Invisible Text)
}

// Generate image srcSet for responsive images
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths.map((width) => `${baseUrl}?w=${width}&auto=format&fit=crop ${width}w`).join(", ")
}

// Generate optimized image URL with width and quality parameters
export function getOptimizedImageUrl(url: string, width: number, quality = 80): string {
  if (!url || url.startsWith("/placeholder")) return url

  // If it's an Unsplash image, use their optimization parameters
  if (url.includes("unsplash.com")) {
    return `${url.split("?")[0]}?w=${width}&q=${quality}&auto=format&fit=crop`
  }

  // For other images, just return the original URL
  return url
}

// Calculate aspect ratio padding for responsive containers
export function getAspectRatioPadding(width: number, height: number): string {
  return `${(height / width) * 100}%`
}
