"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { scrollToTop } from "@/lib/navigation-utils"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Close mobile menu when pathname changes (page navigation)
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }

    // Add event listener when mobile menu is open
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => {
    // Special handling for /blog and /blog/[slug]
    if (path === "/blog") {
      return pathname.startsWith("/blog")
    }
    return pathname === path
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "Equipment" },
    { href: "/brands", label: "Brands" },
    { href: "/areas", label: "Areas" },
    { href: "/blog", label: "Blog" }, // Added Blog link
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => pathname === "/" && scrollToTop()}>
            <div className="flex flex-col">
              <span className="font-heading text-xl tracking-wider uppercase text-white group-hover:text-red-500 transition-colors">D&apos;RENTALS</span>
              <span className="text-xs text-zinc-400 font-mono tracking-tight group-hover:text-zinc-300 transition-colors">by Penmen Studios</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-body font-bold py-1",
                  isActive(link.href) && "text-white"
                )}
                onClick={() => pathname === link.href && scrollToTop()}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-in-fade" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-0 bg-black z-40 flex flex-col pt-20 px-4 md:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Close button for mobile menu */}
        <button
          className="absolute top-4 right-4 text-white p-2 focus:outline-none"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-zinc-400 hover:text-white transition-colors text-lg uppercase tracking-wider font-body font-bold py-2",
                isActive(link.href) && "text-white border-b-2 border-red-500",
              )}
              onClick={() => {
                closeMobileMenu()
                if (pathname === link.href) scrollToTop()
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto mb-8 border-t border-zinc-800 pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <span className="font-heading text-lg text-white">D&apos;RENTALS</span>
            </div>
            <p className="text-zinc-400 text-sm font-mono">
              Professional cinema equipment rental
              <br />
              by Penmen Studios
            </p>
          </div>
        </div>
      </div>

      {/* Overlay to capture clicks outside the menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={closeMobileMenu} aria-hidden="true" />
      )}
    </header>
  )
}
