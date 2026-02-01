"use client"

import Link from "next/link"

export default function DashboardFooter() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo et nom */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">PS</span>
            </div>
            <span className="font-semibold">Parents School Dashboard</span>
          </div>

          {/* Liens rapides */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:text-white transition">
              Tableau de bord
            </Link>
            <Link href="/dashboard/profile" className="hover:text-white transition">
              Mon profil
            </Link>
            <Link href="/" className="hover:text-white transition">
              Retour à l'accueil
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-400">
            © 2025 Parents School
          </div>
        </div>
      </div>
    </footer>
  )
}