"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Head from "next/head"
import { useEffect, useState } from "react"
import { getCanonicalUrl } from "@/lib/seo-config"

/**
 * Add a <link rel="canonical"> tag for the current (or overridden) route.
 * Defaults to the current pathname if no override is supplied.
 */
export default function CanonicalUrl({ overridePath }: { overridePath?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [canonicalUrl, setCanonicalUrl] = useState("")

  useEffect(() => {
    const path = overridePath || pathname
    setCanonicalUrl(getCanonicalUrl(path))
  }, [pathname, overridePath])

  if (!canonicalUrl) return null

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}
