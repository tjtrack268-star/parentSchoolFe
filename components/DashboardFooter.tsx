"use client"

import Link from "next/link"

export default function DashboardFooter() {
  return (
    <footer className="bg-[#3f2f85] text-[#a3ade8] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#e8b41f] flex items-center justify-center">
              <span className="text-[#3f2f85] font-bold text-xs">PS</span>
            </div>
            <span className="font-semibold text-white">Parents School</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:text-[#e8b41f] transition">Tableau de bord</Link>
            <Link href="/dashboard/profile" className="hover:text-[#e8b41f] transition">Mon profil</Link>
            <Link href="/" className="hover:text-[#e8b41f] transition">Retour à l'accueil</Link>
          </div>

          <div className="text-sm text-[#a3ade8]">© 2025 Parents School</div>
        </div>
      </div>
    </footer>
  )
}
