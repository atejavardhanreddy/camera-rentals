import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 pt-16 pb-8">
      <div className="container mx-auto px-4 grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="font-heading text-2xl tracking-wider uppercase text-white">D&apos;RENTALS</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-tight uppercase">by Penmen Studios</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            High-quality camera, lens &amp; lighting gear delivered anywhere in Hyderabad. Professional cinema equipment curated for industry standards.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="font-heading text-sm mb-6 text-white tracking-widest uppercase border-l-2 border-red-500 pl-3">Navigate</h4>
          <ul className="space-y-3 text-sm font-body">
            <li><Link href="/" className="hover:text-red-500 transition-colors uppercase tracking-wider">Home</Link></li>
            <li><Link href="/equipment" className="hover:text-red-500 transition-colors uppercase tracking-wider">Equipment</Link></li>
            <li><Link href="/brands" className="hover:text-red-500 transition-colors uppercase tracking-wider">Brands</Link></li>
            <li><Link href="/contact" className="hover:text-red-500 transition-colors uppercase tracking-wider">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-heading text-sm mb-6 text-white tracking-widest uppercase border-l-2 border-red-500 pl-3">Legal</h4>
          <ul className="space-y-3 text-sm font-body">
            <li><Link href="/privacy-policy" className="hover:text-red-500 transition-colors uppercase tracking-wider">Privacy Policy</Link></li>
            <li><Link href="/return-policy" className="hover:text-red-500 transition-colors uppercase tracking-wider">Return Policy</Link></li>
            <li><Link href="/terms-conditions" className="hover:text-red-500 transition-colors uppercase tracking-wider">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading text-sm mb-6 text-white tracking-widest uppercase border-l-2 border-red-500 pl-3">Get in Touch</h4>
          <ul className="space-y-4 text-sm font-mono">
            <li className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-600 uppercase">Email</span>
              <a href="mailto:admin@penmenstudios.com" className="hover:text-white transition-colors">admin@penmenstudios.com</a>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-600 uppercase">Phone</span>
              <span className="text-zinc-300">077948 72701</span>
            </li>
          </ul>
        </div>
      </div>

      <Separator className="mt-16 mb-8 bg-zinc-900" />

      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
        <p>© {year} D&apos;RENTALS. All rights reserved.</p>
        <p>Managed by Penmen Studios</p>
      </div>
    </footer>
  )
}
