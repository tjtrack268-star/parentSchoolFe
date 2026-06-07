"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/public/about", label: "À propos" },
  { href: "/public/formations", label: "Formations" },
  { href: "/public/ouvrages", label: "Ouvrages" },
  { href: "/public/temoignages", label: "Témoignages" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur shadow-sm z-50 border-b border-[#a3ade8]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/header/logo-header.png"
            alt="Parents School"
            width={140}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition ${
                pathname === href ? "text-[#e8b41f]" : "text-[#3f2f85] hover:text-[#e8b41f]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions desktop + burger mobile */}
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="hidden sm:inline-flex items-center rounded-lg border-2 border-[#3f2f85] px-4 py-1.5 text-sm font-semibold text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white transition">
            Se connecter
          </Link>
          <Link href="/auth/signup" className="hidden sm:inline-flex items-center rounded-lg bg-[#3f2f85] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition">
            S'inscrire
          </Link>

          {/* Burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#3f2f85] hover:bg-[#a3ade8]/20 transition"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#a3ade8]/30 px-4 py-4 space-y-1 shadow-lg">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${
                pathname === href
                  ? "bg-[#3f2f85] text-white"
                  : "text-[#3f2f85] hover:bg-[#a3ade8]/20"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Boutons auth en mobile */}
          <div className="flex gap-2 pt-3 border-t border-[#a3ade8]/30 mt-2">
            <Link href="/auth/login" onClick={() => setOpen(false)}
              className="flex-1 text-center rounded-lg border-2 border-[#3f2f85] py-2.5 text-sm font-semibold text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white transition">
              Se connecter
            </Link>
            <Link href="/auth/signup" onClick={() => setOpen(false)}
              className="flex-1 text-center rounded-lg bg-[#3f2f85] py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
