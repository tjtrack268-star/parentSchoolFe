import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur shadow-sm z-50 border-b border-[#a3ade8]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3f2f85] to-[#a3ade8] flex items-center justify-center">
            <span className="text-[#e8b41f] font-bold text-lg">PS</span>
          </div>
          <Link href="/">
            <h1 className="text-2xl font-bold text-[#3f2f85] cursor-pointer">Parents School</h1>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[#3f2f85] hover:text-[#e8b41f] text-sm font-medium">
            Accueil
          </Link>
          <Link href="/public/about" className="text-[#3f2f85] hover:text-[#e8b41f] text-sm font-medium">
            À propos
          </Link>
          <Link href="/public/formations" className="text-[#3f2f85] hover:text-[#e8b41f] text-sm font-medium">
            Formations
          </Link>
          <Link href="/public/ouvrages" className="text-[#3f2f85] hover:text-[#e8b41f] text-sm font-medium">
            Ouvrages
          </Link>
          <Link href="/public/temoignages" className="text-[#3f2f85] hover:text-[#e8b41f] text-sm font-medium">
            Témoignages
          </Link>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">S'inscrire</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
