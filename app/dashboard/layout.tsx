"use client"

import type React from "react"
import { supabase } from "@/lib/supabase-client" // Declare the supabase variable
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardFooter from "@/components/DashboardFooter"

interface Profile {
  id: string
  firstName: string
  lastName: string
  email: string
  currentGrade: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await apiClient.get<Profile>('/fetch-user')
        
        if (!userData) {
          router.push("/auth/login")
          return
        }

        setProfile(userData)
      } catch (error) {
        console.error("Error loading profile:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Chargement...</p>
        </div>
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header personnalisé du dashboard */}
      <DashboardHeader 
        user={profile ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          currentGrade: profile.currentGrade
        } : undefined}
        onLogout={handleLogout}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />

      <div className="flex flex-col md:flex-row pt-16 flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            menuOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white border-r border-slate-200 md:border-b-0 border-b p-4 md:p-6 order-2 md:order-1`}
        >
          <nav className="space-y-1 md:space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 md:px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm md:text-base"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-base md:text-lg">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 order-1 md:order-2 max-w-none md:max-w-5xl">{children}</main>
      </div>
      
      {/* Footer personnalisé du dashboard */}
      <DashboardFooter />
    </div>
  )
}
