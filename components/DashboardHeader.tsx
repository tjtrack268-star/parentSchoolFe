"use client"

import Link from "next/link"

interface DashboardHeaderProps {
  user?: {
    firstName: string
    lastName: string
    currentGrade?: string
    userRole?: string
  }
  onLogout: () => void
  onMenuToggle: () => void
}

export default function DashboardHeader({ user, onLogout, onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#3f2f85] border-b border-[#a3ade8]/30 shadow-md">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenuToggle} className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white flex-shrink-0">
            <span className="text-xl">☰</span>
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#e8b41f] flex items-center justify-center flex-shrink-0">
              <span className="text-[#3f2f85] font-bold text-sm">PS</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white truncate">Parents School</h1>
              <p className="text-xs text-[#a3ade8] hidden sm:block">Tableau de bord</p>
            </div>
          </Link>
        </div>

        {/* User info + actions */}
        <div className="flex items-center gap-3 min-w-0">
          {user && (
            <div className="hidden lg:block text-right min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
              {user.currentGrade && (
                <p className="text-xs text-[#e8b41f] truncate">{user.currentGrade}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user?.userRole === "ADMIN" && (
              <Link href="/organigramme" className="hidden sm:inline-flex items-center rounded-lg border border-[#a3ade8]/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition">
                Organigramme
              </Link>
            )}
            <Link href="/" className="hidden sm:inline-flex items-center rounded-lg border border-[#a3ade8]/40 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition">
              Accueil
            </Link>
            <button onClick={onLogout} className="inline-flex items-center rounded-lg bg-[#e8b41f] px-3 py-1.5 text-xs font-semibold text-[#3f2f85] hover:opacity-90 transition">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
