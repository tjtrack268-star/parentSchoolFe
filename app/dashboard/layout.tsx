"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { apiClient, ApiError } from "@/lib/api-client"
import { logout } from "@/lib/auth"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardFooter from "@/components/DashboardFooter"

interface Profile {
  id: string
  firstName: string
  lastName: string
  email: string
  currentGrade: string
  userRole?: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    apiClient.get<Profile>('/fetch-user')
      .then(data => {
        if (!data) { setRedirecting(true); router.push("/auth/login"); return }
        if ((data as any).role === "ADMIN" || data.userRole === "ADMIN") { setRedirecting(true); router.replace("/admin-dashboard"); return }
        setProfile(data)
      })
      .catch(err => { setRedirecting(true); if (!(err instanceof ApiError) || err.status === 401 || err.status === 403) router.push("/auth/login"); else console.error(err) })
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {})
    logout()
  }

  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4ef]">
        <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
      </div>
    )
  }

  const menuItems = [
    { label: "Vue d'ensemble", href: "/dashboard", icon: "📊" },
    { label: "Mon réseau", href: "/dashboard/network", icon: "🌐" },
    { label: "Mes parrainages", href: "/dashboard/referrals", icon: "👥" },
    { label: "Mes commissions", href: "/dashboard/commissions", icon: "💰" },
    { label: "Bons de formation", href: "/dashboard/vouchers", icon: "🎓" },
    { label: "Mon profil", href: "/dashboard/profile", icon: "👤" },
  ]

  return (
    <div className="min-h-screen bg-[#f8f4ef] flex flex-col">
      <DashboardHeader
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />

      <div className="flex flex-col md:flex-row pt-16 flex-1">
        {/* Sidebar */}
        <aside className={`${menuOpen ? "block" : "hidden"} md:block w-full md:w-60 bg-white border-r border-[#a3ade8]/30 p-4 order-2 md:order-1 shrink-0`}>
          <nav className="space-y-1">
            {menuItems.map((item) => {
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

          {/* Grade badge */}
          {profile?.currentGrade && profile.currentGrade !== "Aucun" && (
            <div className="mt-6 rounded-lg bg-[#3f2f85] p-4 text-center">
              <p className="text-xs text-[#a3ade8] mb-1">Grade actuel</p>
              <p className="text-sm font-bold text-[#e8b41f]">{profile.currentGrade}</p>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-6 order-1 md:order-2">{children}</main>
      </div>

      <DashboardFooter />
    </div>
  )
}
