import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <nav className="fixed w-full top-0 bg-white bg-opacity-95 backdrop-blur shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">PS</span>
          </div>
          <Link href="/">
            <h1 className="text-2xl font-bold text-slate-900 cursor-pointer">Parents School</h1>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Accueil
          </Link>
          <Link href="/organigramme" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Organigramme
          </Link>
          <Link href="/#activites" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Activités
          </Link>
          <Link href="/#adhesion" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Adhésion
          </Link>
          <Link href="/#grades" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Grades
          </Link>
          <Link href="/#contact" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Contact
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