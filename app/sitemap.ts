import { getAllEquipment, getAllBrands, getCategories, getBlogPosts } from "@/lib/data"
import { getCanonicalUrl } from "@/lib/seo-config"
import { slugify } from "@/lib/utils" // Import the new slugify function
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site, ensuring it's always present
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentals.penmenstudios.com"

  // Fetch all necessary data for dynamic routes
  const equipment = await getAllEquipment()
  const brands = await getAllBrands()
  const categories = await getCategories() // Keeping this for completeness, though not directly used for sitemap URLs
  const blogPosts = await getBlogPosts()

  // Define static routes with their properties
  const staticRoutes = [
    {
      url: getCanonicalUrl("/"),
      lastModified: new Date(), // Use current date for static pages if no specific last modified date is available
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: getCanonicalUrl("/equipment"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: getCanonicalUrl("/brands"),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("/areas"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/blog"),
      lastModified: new Date(), // Or the last modified date of the latest blog post if available
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ]

  // Generate URLs for individual equipment detail pages
  const equipmentDetailRoutes = equipment.map((item) => ({
    url: getCanonicalUrl(`/equipment/${item.id}-${slugify(item.name)}`), // Include slugified name
    lastModified: new Date(item.updatedAt as Date), // Use the equipment's last updated timestamp
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Generate URLs for individual brand pages
  const brandRoutes = brands.map((brand) => ({
    url: getCanonicalUrl(`/brands/${encodeURIComponent(brand.toLowerCase())}`),
    lastModified: new Date(), // Assuming brand pages don't have individual last modified dates
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Generate URLs for individual area pages (hardcoded list as per previous context)
  const areaRoutes = [
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
  ].map((area) => ({
    url: getCanonicalUrl(`/areas/${area}`),
    lastModified: new Date(), // Assuming area pages don't have individual last modified dates
    changeFrequency: "daily" as const, // Area pages are high-value for local SEO
    priority: 0.9,
  }))

  // Generate URLs for individual blog post detail pages
  const blogPostRoutes = blogPosts.map((post) => ({
    url: getCanonicalUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt), // Use the blog post's published date as last modified
    changeFrequency: "monthly" as const, // Blog posts are typically less frequently updated than equipment
    priority: 0.6, // Slightly lower priority than main content pages
  }))

  // Combine all routes into a single sitemap array
  return [...staticRoutes, ...equipmentDetailRoutes, ...brandRoutes, ...areaRoutes, ...blogPostRoutes]
}
