import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HomeCarousel from "@/components/HomeCarousel"
import { ArrowRight, BookOpen, GraduationCap, Users, Heart, Lightbulb, Sprout } from "lucide-react"
import { GRADE_COLORS } from "@/lib/constants"

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16 bg-[#f8f4ef]">

        {/* Carrousel hero */}
        <HomeCarousel />

        {/* Mission */}
        <section className="bg-white py-20" id="vision">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
              <div className="overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/vision/vision.jpeg"
                  alt="Notre Vision"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center lg:text-left">
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Qui sommes-nous</p>
                <h2 className="text-4xl font-bold text-[#3f2f85] sm:text-5xl mb-4">Notre Mission</h2>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                  Former et équiper les parents pour l'éducation de leurs enfants, tout en recherchant l'intervention de Dieu par la prière.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Lightbulb, title: "Fondement Biblique", desc: "Nos enseignements tirent leurs fondements de la Bible pour une parentalité bienveillante et éclairée." },
                { icon: Users, title: "Communauté Bienveillante", desc: "Rejoignez des milliers de parents partageant les mêmes valeurs chrétiennes à travers le monde." },
                { icon: Sprout, title: "Croissance Personnelle", desc: "Progressez à travers un système de grades reconnaissant votre engagement et votre impact." },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="rounded-lg border-l-4 border-[#e8b41f] bg-[#f8f4ef] p-6 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#3f2f85] text-white mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#3f2f85] mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Activités principales */}
        <section className="bg-[#a3ade8]/20 py-20" id="activites">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Ce que nous faisons</p>
              <h2 className="text-4xl font-bold text-[#3f2f85] sm:text-5xl mb-4">Nos Activités Principales</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Découvrez les différentes formes de formation et d'accompagnement disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: GraduationCap,
                  title: "Enseignements Dominicaux",
                  desc: "Sessions hebdomadaires en ligne chaque dimanche — 4 enseignements par session sur la parentalité et la relation inter-parentale.",
                  link: "/public/formations",
                  stat: "500+ enseignements dispensés",
                },
                {
                  icon: Users,
                  title: "Formation des Conseillers",
                  desc: "Formation certifiante de 3 mois pour devenir conseiller parental, avec soutenance et certificat officiel.",
                  link: "/public/formations",
                  stat: "79 récipiendaires formés",
                },
                {
                  icon: BookOpen,
                  title: "Ouvrages & Ressources",
                  desc: "Des livres pratiques rédigés par nos fondateurs pour accompagner les parents dans leur mission éducative.",
                  link: "/public/ouvrages",
                  stat: "4 ouvrages publiés",
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="bg-white rounded-lg border border-[#a3ade8]/30 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#3f2f85] text-white mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#3f2f85] mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3 flex-1">{item.desc}</p>
                    <p className="text-xs font-semibold text-[#e8b41f] mb-4">{item.stat}</p>
                    <Link href={item.link} className="inline-flex items-center gap-1 text-sm font-semibold text-[#3f2f85] hover:text-[#e8b41f] transition">
                      En savoir plus <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-10">
              <Link href="/public/formations" className="inline-flex items-center gap-2 rounded-lg bg-[#3f2f85] px-8 py-4 font-semibold text-white transition hover:opacity-90">
                Voir toutes nos formations <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Adhésion */}
        <section className="bg-white py-20" id="adhesion">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Nous rejoindre</p>
              <h2 className="text-4xl font-bold text-[#3f2f85] sm:text-5xl mb-4">Types d'Adhésion</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Choisissez le type d'adhésion qui correspond à vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Membre Ordinaire",
                  highlight: false,
                  tarif: "20 000 FCFA payable une fois et à vie ",
                  features: ["Accès aux enseignements dominicaux", "Sessions en direct chaque dimanche", "Système de parrainage", "Communauté internationale", "Tarifs préférentiels formations"],
                },
                {
                  name: "Membre d'Honneur",
                  highlight: true,
                  tarif: "200 000 FCFA payable une fois et à vie ",
                  features: ["Tout du membre ordinaire", "Accès gratuit aux enseignements", "Badge Honneur", "Support prioritaire", "Événements VIP"],
                },
                {
                  name: "Membre Bienfaiteur",
                  highlight: false,
                  tarif: "Sur demande",
                  features: ["Reconnaissance spéciale", "Conseil consultatif", "Avantages exclusifs", "Impact communautaire"],
                },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-8 border-2 flex flex-col transition-all ${
                    tier.highlight
                      ? "border-[#e8b41f] bg-[#3f2f85] text-white scale-105 shadow-lg"
                      : "border-[#a3ade8]/40 bg-[#f8f4ef]"
                  }`}
                >
                  {tier.highlight && (
                    <div className="text-center mb-3">
                      <span className="rounded-full bg-[#e8b41f] px-3 py-1 text-xs font-bold text-[#3f2f85]">Recommandé</span>
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-1 ${tier.highlight ? "text-[#e8b41f]" : "text-[#3f2f85]"}`}>{tier.name}</h3>
                  <p className={`text-sm font-semibold mb-6 ${tier.highlight ? "text-white/80" : "text-slate-500"}`}>{tier.tarif}</p>
                  <ul className="space-y-2 mb-8 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className={`flex items-center gap-2 text-sm ${tier.highlight ? "text-white/90" : "text-slate-600"}`}>
                        <span className="font-bold text-[#e8b41f]">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/signup"
                    className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-semibold transition ${
                      tier.highlight
                        ? "bg-[#e8b41f] text-[#3f2f85] hover:opacity-90"
                        : "border-2 border-[#3f2f85] text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white"
                    }`}
                  >
                    Choisir ce plan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grades */}
        <section className="bg-[#a3ade8]/20 py-20" id="grades">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Évolution</p>
              <h2 className="text-4xl font-bold text-[#3f2f85] sm:text-5xl mb-4">Plan de Carrière</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Progressez à travers 5 grades avec des avantages croissants
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                { grade: "Leader", desc: "4 parrains · 240 pts", benefit: "" },
                { grade: "Leader Senior", desc: "8 parrains · 1 200 pts", benefit: "" },
                { grade: "Coordinateur", desc: "18 parrains · 3 000 pts", benefit: "" },
                { grade: "Mentor", desc: "30 parrains · 10 000 pts", benefit: "" },
                { grade: "Directeur", desc: "50 parrains · 30 000 pts", benefit: "" },
              ].map((item, idx) => {
                const color = GRADE_COLORS[item.grade as keyof typeof GRADE_COLORS]
                return (
                  <div key={idx} className="rounded-lg bg-white border border-[#a3ade8]/30 p-5 text-center shadow-sm">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: color }}>
                      {idx + 1}
                    </div>
                    <p className="font-bold text-[#3f2f85] text-sm">{item.grade}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    <p className="text-xs font-semibold text-[#e8b41f] mt-2">{item.benefit}/mois</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-14">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Ils témoignent</p>
              <h2 className="text-4xl font-bold text-[#3f2f85] sm:text-5xl mb-4">Témoignages</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">Ce que nos membres disent de Parents School</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Mireille K.", role: "Maman de 3 enfants", pays: "Douala", quote: "Parents School m'a aidée à mieux comprendre mes enfants. Notre communication est devenue plus apaisée et constructive." },
                { name: "Paul N.", role: "Père de famille", pays: "Yaoundé", quote: "Les modules sont pratiques, concrets et adaptés à notre réalité africaine. J'applique chaque semaine ce que j'apprends." },
                { name: "Sarah M.", role: "Parent relais", pays: "Abidjan", quote: "La communauté est bienveillante. On se sent accompagné, pas jugé. C'est un vrai soutien pour les parents." },
              ].map((item, idx) => (
                <div key={idx} className="rounded-lg border-l-4 border-[#e8b41f] bg-[#f8f4ef] p-6 shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-[#e8b41f]">★</span>)}
                  </div>
                  <p className="text-slate-600 mb-5 italic text-sm leading-relaxed">"{item.quote}"</p>
                  <div className="border-t border-[#a3ade8]/30 pt-4">
                    <p className="font-bold text-[#3f2f85]">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role} · {item.pays}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/public/temoignages" className="inline-flex items-center gap-2 text-[#3f2f85] font-semibold hover:text-[#e8b41f] transition">
                Voir tous les témoignages <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Heart className="mx-auto mb-6 h-14 w-14 fill-white text-white" />
            <h2 className="text-4xl font-bold mb-4 sm:text-5xl">Prêt à Commencer Votre Parcours ?</h2>
            <p className="text-xl mb-8 text-white/90">
              Rejoignez des parents du monde entier en quête de formation et d'épanouissement familial
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
                S'inscrire gratuitement <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/auth/login" className="inline-flex items-center justify-center rounded-lg border-2 border-[#e8b41f] px-8 py-4 font-semibold text-[#e8b41f] transition hover:bg-[#e8b41f] hover:text-[#3f2f85]">
                Se connecter
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
