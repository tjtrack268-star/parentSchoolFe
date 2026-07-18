"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu } from "lucide-react"
import { getFirstName, getRole, logout } from "@/lib/auth"

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

const ADMIN_MENU = [
  { label: "Dashboard Admin",  href: "/admin-dashboard"  },
  { label: "Membres",          href: "/admin/members"    },
  { label: "Grades",           href: "/admin/grades"     },
  { label: "Inscriptions formation", href: "/admin/formation-registrations" },
  { label: "Import membres",   href: "/import"           },
  { label: "Organigramme",     href: "/org-chart"        },
  { label: "Leaderboard",      href: "/admin/leaderboard"},
]

export default function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const [firstName,    setFirstName]    = useState<string | null>(null)
  const [isAdmin,      setIsAdmin]      = useState(false)
  const [adminOpen,    setAdminOpen]    = useState(false)
  const adminRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFirstName(getFirstName())
    setIsAdmin(getRole() === "ADMIN")
  }, [])

  // Fermer le menu admin en cliquant ailleurs
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#3f2f85] border-b border-[#a3ade8]/30 shadow-md">
      <div className="w-full px-4 py-3 flex items-center justify-between">

        {/* Logo + burger */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenuToggle}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white shrink-0">
            <Menu className="h-5 w-5" />
          </button>
          <Link href={isAdmin ? "/admin-dashboard" : "/dashboard"} className="flex items-center shrink-0">
            <Image
              src="/header/logo-header.png"
              alt="Parents School"
              width={120}
              height={40}
              className="h-10 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
        </div>

        {/* Droite : Bonjour + actions */}
        <div className="flex items-center gap-2">

          {/* Bonjour [Prénom] */}
          {firstName && (
            <span className="hidden sm:block text-sm text-[#a3ade8]">
              Bonjour, <span className="font-semibold text-white">{firstName}</span>
            </span>
          )}

          {/* Menu Admin déroulant */}
          {isAdmin && (
            <div ref={adminRef} className="relative">
              <button onClick={() => setAdminOpen(v => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-[#e8b41f]/60 px-3 py-1.5 text-xs font-semibold text-[#e8b41f] hover:bg-[#e8b41f]/10 transition">
                Admin <ChevronDown className={`h-3.5 w-3.5 transition-transform ${adminOpen ? "rotate-180" : ""}`} />
              </button>

              {adminOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-white shadow-lg border border-[#a3ade8]/30 overflow-hidden z-50">
                  {ADMIN_MENU.map(item => (
                    <Link key={item.href} href={item.href}
                      onClick={() => setAdminOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-[#3f2f85] hover:bg-[#f8f4ef] transition">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mon profil — masqué pour l'admin */}
          {!isAdmin && (
            <Link href="/dashboard/profile"
              className="hidden sm:inline-flex items-center rounded-lg border border-[#a3ade8]/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition">
              Mon profil
            </Link>
          )}

          {/* Déconnexion */}
          <button onClick={logout}
            className="inline-flex items-center rounded-lg bg-[#e8b41f] px-3 py-1.5 text-xs font-semibold text-[#3f2f85] hover:opacity-90 transition">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}
