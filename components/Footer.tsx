import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Parents School</h3>
            <p className="text-sm">Formation à la parentalité chrétienne pour le monde entier</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Naviguer</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/organigramme" className="hover:text-white">
                  Organigramme
                </Link>
              </li>
              <li>
                <Link href="/#activites" className="hover:text-white">
                  Activités
                </Link>
              </li>
              <li>
                <Link href="/#adhesion" className="hover:text-white">
                  Adhésion
                </Link>
              </li>
              <li>
                <Link href="/#grades" className="hover:text-white">
                  Grades
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Aide</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@parentsschool.com" className="hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Réseaux</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p>© 2025 Parents School. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}