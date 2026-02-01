"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  user?: {
    firstName: string
    lastName: string
    currentGrade?: string
  }
  onLogout: () => void
  onMenuToggle: () => void
}

export default function DashboardHeader({ user, onLogout, onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="w-full px-3 sm:px-4 py-3 flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
          >
            <span className="text-lg sm:text-xl">☰</span>
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">PS</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900 truncate">Dashboard</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Parents School</p>
            </div>
          </Link>
        </div>

        {/* Informations utilisateur */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {user && (
            <div className="hidden lg:block text-right min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              {user.currentGrade && (
                <p className="text-xs text-slate-500 truncate">{user.currentGrade}</p>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Accueil</span>
                <span className="sm:hidden">🏠</span>
              </Button>
            </Link>
            <Button onClick={onLogout} variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Déconnexion</span>
              <span className="sm:hidden">↗️</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}