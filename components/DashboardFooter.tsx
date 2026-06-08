import Link from "next/link"
import Image from "next/image"

export default function DashboardFooter() {
  return (
    <footer className="bg-[#3f2f85] text-[#a3ade8] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/">
            <Image
              src="/footer/logo-footer.jpeg"
              alt="Parents School"
              width={120}
              height={44}
              className="h-11 w-auto object-contain"
            />
          </Link>

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
