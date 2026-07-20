"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { authClient } from "@/lib/auth-client"

const LINKS = [
  { href: "/",                label: "Accueil"     },
  { href: "/public/about",    label: "À propos"    },
  { href: "/public/formations",label: "Formations" },
  { href: "/simulator",       label: "Simulateur", memberOnly: true },
  { href: "/public/ouvrages", label: "Ouvrages"   },
  { href: "/organisation",    label: "Organisation"},
  { href: "/public/temoignages",label: "Témoignages"},
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsLoggedIn(!!authClient.getToken())
  }, [pathname])

  const links = LINKS.filter(l => !l.memberOnly || isLoggedIn)

  const handleLogout = async () => {
    try { await fetch("/api/logout", { method: "POST" }) } catch {}
    authClient.clearToken()
    setIsLoggedIn(false)
    setOpen(false)
    router.push("/")
  }

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
    isLoggedIn ? (
      <div className={`flex ${mobile ? "gap-2 w-full" : "gap-2"}`}>
        <Link href="/dashboard" onClick={() => setOpen(false)}
          className={`${mobile ? "flex-1 text-center" : "hidden sm:inline-flex"} items-center justify-center gap-1.5 rounded-lg border-2 border-[#3f2f85] px-4 py-1.5 text-sm font-semibold text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white transition`}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <button onClick={handleLogout}
          className={`${mobile ? "flex-1" : "hidden sm:inline-flex"} items-center justify-center gap-1.5 rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600 transition`}>
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    ) : (
      <div className={`flex ${mobile ? "gap-2 w-full" : "gap-2"}`}>
        <Link href="/auth/login" onClick={() => setOpen(false)}
          className={`${mobile ? "flex-1 text-center" : "hidden sm:inline-flex"} items-center justify-center rounded-lg border-2 border-[#3f2f85] px-4 py-1.5 text-sm font-semibold text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white transition`}>
          Se connecter
        </Link>
        <Link href="/inscription" onClick={() => setOpen(false)}
          className={`${mobile ? "flex-1 text-center" : "hidden sm:inline-flex"} items-center justify-center rounded-lg bg-[#3f2f85] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition`}>
          S'inscrire
        </Link>
      </div>
    )
  )

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
          {links.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`text-sm font-medium transition ${
                pathname === href ? "text-[#e8b41f]" : "text-[#3f2f85] hover:text-[#e8b41f]"
              }`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Actions desktop + burger */}
        <div className="flex items-center gap-2">
          <AuthButtons />
          <button onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#3f2f85] hover:bg-[#a3ade8]/20 transition"
            aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#a3ade8]/30 px-4 py-4 space-y-1 shadow-lg">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition ${
                pathname === href ? "bg-[#3f2f85] text-white" : "text-[#3f2f85] hover:bg-[#a3ade8]/20"
              }`}>
              {label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 border-t border-[#a3ade8]/30 mt-2">
            <AuthButtons mobile />
          </div>
        </div>
      )}
    </nav>
  )
}