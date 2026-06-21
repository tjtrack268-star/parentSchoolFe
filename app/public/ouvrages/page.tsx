import Link from "next/link"
import Image from "next/image"
import { BookOpen, ArrowRight, ShoppingCart, Download } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookInteractions from "@/components/BookInteractions"

const OUVRAGES = [
  {
    slug: "reussir-metier-parent",
    title: "Réussir le Métier de Parent",
    auteur: "Clément Emadouan",
    categorie: "Parentalité",
    format: "Broché + PDF",
    prix: "5 000 FCFA",
    image: "/Ouvrage_img/Réussir le metier de parent auteur clement Emadouan.jpeg",
    description: "Un guide pratique avec des techniques, approches et astuces pour accompagner efficacement les parents dans leur mission éducative.",
    themes: ["Techniques parentales pratiques", "Approches éducatives modernes", "Mission éducative des parents", "Astuces du quotidien"],
    disponible: true,
  },
  {
    slug: "et-vous-peres",
    title: "Et Vous Pères, Comment Être un Papa Inspirant et Impactant ?",
    auteur: "Clément Emadouan",
    categorie: "Paternité",
    format: "Broché + PDF",
    prix: "7 000 FCFA",
    image: "/Ouvrage_img/Et vous pères Comment être un papa inspirant et impactant Auteur Clement Emadouan.jpeg",
    description: "Un livre qui met en lumière le rôle, la mission et la fonction du père dans l'éducation des enfants et le bien-être de la famille. Il explore en profondeur la relation père-fille et père-fils.",
    themes: ["Rôle et mission du père", "Relation père-fille", "Relation père-fils", "Bien-être familial"],
    disponible: true,
  },
  {
    title: "Briser la Chaîne des Blessures Émotionnelles dans la Famille",
    auteur: "Laurène Kadjeu",
    categorie: "Guérison & Famille",
    format: "Broché + PDF",
    prix: "10 000 FCFA",
    image: "/Ouvrage_img/Brise la chaine des blessures Emotionnelles dans ta famille auteur Laurène Kadjeu.jpeg",
    description: "Inspiré du parcours personnel de l'auteur, ce livre explore les blessures émotionnelles, leurs impacts et les voies de guérison pour restaurer l'équilibre familial.",
    themes: ["Blessures émotionnelles", "Impacts sur la famille", "Voies de guérison", "Restauration de l'équilibre familial"],
    disponible: true,
  },
  {
    title: "Se Réinventer après une Séparation",
    auteur: "Clément Emadouan",
    categorie: "Reconstruction & Espoir",
    format: "Broché + PDF",
    prix: "10000 XAF",
    image: "/Ouvrage_img/Se Réinventer après une séparation auteur Clement Emadouan.jpeg",
    description: "Un accompagnement bienveillant pour se reconstruire après une séparation et retrouver sa place de parent épanoui.",
    themes: ["Reconstruction personnelle", "Co-parentalité", "Pardon et guérison", "Nouveau départ"],
    disponible: true, 
  },
]

export default function OuvragesPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ef] text-slate-900">
      <Header />
      <div className="pt-16">

        {/* Hero */}
        <section className="bg-[#3f2f85] text-white">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Librairie Parents School</p>
              <h1 className="mb-6 text-5xl font-bold leading-tight sm:text-6xl">Ouvrages en Vente</h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-100">
                Des ressources pédagogiques adaptées au contexte africain, pour promouvoir une parentalité bienveillante et éclairée.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#catalogue" className="inline-flex items-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
                  Voir le catalogue <ArrowRight className="h-5 w-5" />
                </a>
                <Link href="/auth/signup" className="inline-flex items-center rounded-lg border-2 border-[#e8b41f] px-8 py-4 font-semibold text-[#e8b41f] transition hover:bg-[#e8b41f] hover:text-[#3f2f85]">
                  Devenir membre
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#a3ade8]/30">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { value: "4", label: "Ouvrages disponibles" },
                { value: "3", label: "Auteurs" },
                { value: "PDF", label: "Format numérique" },
                { value: "FCFA", label: "Paiement local" },
              ].map((s, i) => (
                <div key={i} className="rounded-lg bg-white p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-[#3f2f85]">{s.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catalogue */}
        <section className="bg-white" id="catalogue">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="mb-4 text-center text-4xl font-bold text-[#3f2f85] sm:text-5xl">Notre Catalogue</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
              Des ouvrages de référence pour chaque étape de votre vie familiale
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {OUVRAGES.map((o, idx) => (
                <div key={idx} className="flex gap-5 rounded-lg border border-slate-200 bg-[#f8f4ef] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Couverture */}
                  <div className="relative w-36 shrink-0">
                    <Image src={o.image} alt={o.title} fill className="object-cover" />
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#e8b41f]">{o.categorie}</p>
                    <h3 className="mt-1 text-lg font-bold text-[#3f2f85] leading-snug">{o.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">par {o.auteur}</p>
                    <p className="mb-3 text-sm leading-relaxed text-slate-600 flex-1">{o.description}</p>

                    <ul className="mb-4 space-y-1">
                      {o.themes.map((t, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="font-bold text-[#e8b41f]">✓</span>{t}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">{o.format}</p>
                        <p className="text-xl font-bold text-[#3f2f85]">{o.prix}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 rounded-lg bg-[#3f2f85] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                          <ShoppingCart className="h-4 w-4" /> Commander
                        </button>
                        <button className="flex items-center gap-1 rounded-lg border-2 border-[#3f2f85] px-3 py-2 text-sm font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white">
                          <Download className="h-4 w-4" /> PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment commander */}
        <section className="bg-[#a3ade8]/20">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="mb-4 text-center text-4xl font-bold text-[#3f2f85] sm:text-5xl">Comment Commander ?</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">Simple, rapide et sécurisé</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { step: "01", title: "Créez votre compte", desc: "Inscrivez-vous sur Parents School pour accéder à la boutique et passer commande." },
                { step: "02", title: "Choisissez votre ouvrage", desc: "Parcourez le catalogue et sélectionnez les livres qui correspondent à vos besoins." },
                { step: "03", title: "Recevez votre commande", desc: "Téléchargez le PDF immédiatement ou recevez la version brochée à votre adresse." },
              ].map((s, i) => (
                <div key={i} className="rounded-lg border-l-4 border-[#e8b41f] bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3f2f85] text-white font-bold text-sm">
                      {s.step}
                    </div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                  </div>
                  <p className="text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <BookOpen className="mx-auto mb-6 h-14 w-14 text-[#e8b41f]" />
            <h2 className="mb-5 text-4xl font-bold sm:text-5xl">Enrichissez votre Bibliothèque Familiale</h2>
            <p className="mb-8 text-lg text-slate-200">Les membres bénéficient de réductions exclusives sur tous nos ouvrages</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
                Devenir membre <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/public/formations" className="inline-flex items-center justify-center rounded-lg border-2 border-[#e8b41f] px-8 py-4 font-semibold text-[#e8b41f] transition hover:bg-[#e8b41f] hover:text-[#3f2f85]">
                Voir les formations
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  )
}
