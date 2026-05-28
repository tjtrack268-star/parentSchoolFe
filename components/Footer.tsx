import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#3f2f85] text-[#a3ade8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-[#e8b41f] font-bold mb-4">Parents School</h3>
            <p className="text-sm">Formation à la parentalité chrétienne pour le monde entier</p>
          </div>
          <div>
            <h4 className="text-[#e8b41f] font-semibold mb-4">Naviguer</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#e8b41f]">
                  Accueil
                </Link>
              </li>
              <li><Link href="/#activites" className="hover:text-[#e8b41f]">Activités</Link></li>
              <li><Link href="/public/formations" className="hover:text-[#e8b41f]">Formations</Link></li>
              <li><Link href="/public/ouvrages" className="hover:text-[#e8b41f]">Ouvrages</Link></li>
              <li><Link href="/#adhesion" className="hover:text-[#e8b41f]">Adhésion</Link></li>
              <li><Link href="/#grades" className="hover:text-[#e8b41f]">Grades</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#e8b41f] font-semibold mb-4">Aide</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@parentsschool.com" className="hover:text-[#e8b41f]">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e8b41f]">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e8b41f]">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#e8b41f] font-semibold mb-4">Réseaux</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#e8b41f]">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e8b41f]">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e8b41f]">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#a3ade8]/30 pt-8 text-center text-sm">
          <p>© 2025 Parents School. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
