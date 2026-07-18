"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { isAuthenticated, getRole } from "@/lib/auth"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardFooter from "@/components/DashboardFooter"

const ADMIN_NAV = [
  { label: "Vue d'ensemble",  href: "/admin-dashboard", icon: "📊" },
  { label: "Membres",         href: "/members",         icon: "👥" },
  { label: "Grades",          href: "/grades",          icon: "🏅" },
  { label: "Inscriptions",    href: "/admin/formation-registrations", icon: "🎓" },
  { label: "Témoignages",     href: "/admin/testimonials",    icon: "💬" },
  { label: "Import membres",  href: "/import",          icon: "📥" },
  { label: "Organigramme",    href: "/org-chart",       icon: "🌳" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [ready,     setReady]     = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    if (!isAuthenticated() || getRole() !== "ADMIN") {
      router.replace("/auth/login")
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ef]">
      <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f4ef] flex flex-col">
      <DashboardHeader onMenuToggle={() => setMenuOpen(v => !v)} />

      <div className="flex flex-col md:flex-row pt-16 flex-1">
        {/* Sidebar */}
        <aside className={`${menuOpen ? "block" : "hidden"} md:block w-full md:w-60 bg-white border-r border-[#a3ade8]/30 p-4 order-2 md:order-1 shrink-0`}>
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Administration
          </p>
          <nav className="space-y-1">
            {ADMIN_NAV.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-[#3f2f85] text-white"
                      : "text-slate-700 hover:bg-[#a3ade8]/20 hover:text-[#3f2f85]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e8b41f]" />}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 rounded-lg bg-[#3f2f85]/10 border border-[#3f2f85]/20 p-3 text-center">
            <p className="text-xs font-bold text-[#3f2f85]">🛡️ Espace Admin</p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-6 order-1 md:order-2">{children}</main>
      </div>

      <DashboardFooter />
    </div>
  )
}
