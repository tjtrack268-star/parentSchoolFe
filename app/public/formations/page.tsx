import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function FormationsPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ef] text-slate-900">
      <Header />
      <div className="pt-16">

        {/* Hero */}
        <section className="bg-[#3f2f85] text-white">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Nos Programmes</p>
              <h1 className="mb-6 text-5xl font-bold leading-tight sm:text-6xl">Offres de Formations</h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-100">
                Des formations complètes animées par des professionnels expérimentés pour vous accompagner dans votre parcours de parentalité chrétienne.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/inscription" className="inline-flex items-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
                  S'inscrire maintenant <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/auth/login" className="inline-flex items-center rounded-lg border-2 border-[#e8b41f] px-8 py-4 font-semibold text-[#e8b41f] transition hover:bg-[#e8b41f] hover:text-[#3f2f85]">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats globales */}
        <section className="bg-[#a3ade8]/30">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { value: "500+", label: "Enseignements dispensés" },
                { value: "5 000+", label: "Participants formés" },
                { value: "120", label: "Facilitateurs mobilisés" },
                { value: "10+", label: "Pays représentés" },
              ].map((s, i) => (
                <div key={i} className="rounded-lg bg-white p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-[#3f2f85]">{s.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 1. Sessions Dominicales ── */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
              <div className="overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/formation_img/enseignement.jpeg"
                  alt="Enseignements Dominicaux"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Formation 01</p>
                <h2 className="mb-4 text-4xl font-bold text-[#3f2f85]">Session d'Enseignement Dominical</h2>
                <p className="mb-6 text-slate-600 leading-relaxed">
                  Chaque session comprend <strong>4 enseignements en ligne</strong> : 3 sur la parentalité positive et 1 sur la relation inter-parentale (sexualité dans le couple, gestion des finances…).
                  Les sessions ont lieu <strong>tous les dimanches</strong> et durent <strong>1h30</strong>.
                </p>

                <div className="mb-6 space-y-3">
                  <h3 className="font-semibold text-[#3f2f85]">Objectifs</h3>
                  {[
                    "Renforcer les compétences parentales par une meilleure compréhension du rôle de parent",
                    "Encourager les échanges, le partage d'expériences, les défis et les encouragements",
                    "Créer une véritable communauté de soutien entre parents",
                  ].map((o, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-0.5 font-bold text-[#e8b41f]">✓</span>{o}
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-[#3f2f85]">Thématiques abordées</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Communication", "Éducation financière", "Sexualité", "Divertissement", "Bien-être & Santé", "Pédagogie", "Développement personnel", "Psychologie", "Spiritualité", "Droit", "Réseaux sociaux", "Leadership"].map((t, i) => (
                      <span key={i} className="rounded-full border border-[#a3ade8] bg-[#a3ade8]/20 px-3 py-1 text-xs font-medium text-[#3f2f85]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-bold text-[#3f2f85]">Comment participer ?</h3>
                  {[
                    { type: "Membre Ordinaire", color: "border-[#3f2f85]", badge: "bg-[#3f2f85] text-white", tarifs: ["25 000 FCFA/an", "3 000 FCFA/mois"] },
                    { type: "Membre d'Honneur", color: "border-[#e8b41f]", badge: "bg-[#e8b41f] text-[#3f2f85]", tarifs: ["Gratuit, sans condition"] },
                    { type: "Non-membre", color: "border-slate-300", badge: "bg-slate-200 text-slate-700", tarifs: ["5 500 FCFA/mois"] },
                  ].map((t, i) => (
                    <div key={i} className={`rounded-lg border-l-4 ${t.color} bg-[#f8f4ef] p-5 mb-3`}>
                      <div className="mb-3 flex items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${t.badge}`}>{t.type}</span>
                      </div>
                      <ul className="space-y-1">
                        {t.tarifs.map((tarif, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="font-bold text-[#e8b41f]">•</span>{tarif}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link href="/inscription" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f2f85] px-6 py-3 font-semibold text-white transition hover:opacity-90">
                    S'inscrire aux sessions <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "500+", label: "Enseignements" },
                    { value: "5 000+", label: "Participants" },
                    { value: "120", label: "Facilitateurs" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-[#e8b41f] bg-[#f8f4ef] p-3 text-center">
                      <div className="text-xl font-bold text-[#3f2f85]">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Conseillers Parentaux ── */}
        <section className="bg-[#a3ade8]/20">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
              <div className="overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/formation_img/Conseiller parental.jpeg"
                  alt="Formation Conseiller Parental"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Formation 02</p>
                <h2 className="mb-4 text-4xl font-bold text-[#3f2f85]">Formation des Conseillers Parentaux</h2>
                <p className="mb-2 text-slate-600 leading-relaxed">
                  Former des personnes capables d'évaluer des situations familiales, identifier les défis liés à la relation parent-enfant, proposer des pistes d'amélioration concrètes et guider les familles vers des solutions adaptées.
                </p>
                <p className="mb-6 text-sm font-semibold text-[#3f2f85]">Durée : 3 mois — 3 séances/semaine — 36 leçons — Certificat officiel</p>

                <div className="mb-6 space-y-2">
                  <h3 className="font-semibold text-[#3f2f85]">Modules de formation</h3>
                  {[
                    "Module 1 : Guérison des traumatismes",
                    "Module 2 : Connaissance de l'enfant",
                    "Module 3 : Communication avec les enfants",
                    "Module 4 : Relation inter-parentale",
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border-l-4 border-[#e8b41f] bg-white p-3 text-sm font-medium text-slate-700">
                      <span className="font-bold text-[#e8b41f]">→</span>{m}
                    </div>
                  ))}
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#3f2f85] p-4 text-white text-center">
                    <div className="text-xs font-semibold uppercase text-[#e8b41f] mb-1">Membre Parents School</div>
                    <div className="text-2xl font-bold">95 000 FCFA</div>
                  </div>
                  <div className="rounded-lg border-2 border-[#3f2f85] p-4 text-center">
                    <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Non-membre</div>
                    <div className="text-2xl font-bold text-[#3f2f85]">170 000 FCFA</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "6", label: "Promotions formées" },
                    { value: "110", label: "Récipiendaires" },
                    { value: "", label: "Cibles : parents, Pasteurs, Moniteurs d'enfants, Professionnels, Leaders de communautés..." },
                    { value: "7", label: "Pays représentés" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-[#e8b41f] bg-white p-3">
                      <div className="text-xl font-bold text-[#3f2f85]">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Art Oratoire ── */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Formation 03</p>
                <h2 className="mb-4 text-4xl font-bold text-[#3f2f85]">Coaching / Formation en Art Oratoire</h2>
                <p className="mb-2 text-slate-600 leading-relaxed">
                  Former des leaders capables d'influencer et d'inspirer par leur manière de communiquer, que ce soit en famille, au travail, dans un cadre religieux ou politique.
                </p>
                <p className="mb-6 text-sm font-semibold text-[#3f2f85]">Durée : 21 jours — Formation pratique en ligne — Certificat de formation</p>

                <div className="mb-6 space-y-3">
                  <h3 className="font-semibold text-[#3f2f85]">Coût de la formation</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-[#3f2f85] p-4 text-white">
                      <div className="text-xs font-semibold uppercase text-[#e8b41f] mb-2">Membre Parents School</div>
                      <div className="space-y-1">
                        <div className="text-sm">Offre Standard : <span className="font-bold">85 000 FCFA</span></div>
                        <div className="text-sm">Offre VIP : <span className="font-bold">185 000 FCFA</span></div>
                      </div>
                    </div>
                    <div className="rounded-lg border-2 border-[#3f2f85] p-4">
                      <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Non-membre</div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-700">Offre Standard : <span className="font-bold text-[#3f2f85]">135 000 FCFA</span></div>
                        <div className="text-sm text-slate-700">Offre VIP : <span className="font-bold text-[#3f2f85]">360 000 FCFA</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "5", label: "Sessions en ligne" },
                    { value: "34", label: "récipiendaires" },
                    { value: "5", label: "Pays représentés" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-[#e8b41f] bg-[#f8f4ef] p-3 text-center">
                      <div className="text-xl font-bold text-[#3f2f85]">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                  ))}
                <p className="mt-3 text-xs text-slate-500">Participants : Cameroun, Côte d'Ivoire, États-Unis, Italie, France</p>

                <div className="mt-6">
                  <a
                    href="https://forms.gle/z7XQXNY5nVygK7rT6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8b41f] px-6 py-3 font-semibold text-[#3f2f85] transition hover:opacity-90 shadow-sm"
                  >
                    S'inscrire à la formation <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              </div>

              <div className="overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/formation_img/Art oratoire.jpeg"
                  alt="Formation Art Oratoire"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Empower Youth ── */}
        <section className="bg-[#a3ade8]/20">
          <div className="mx-auto max-w-6xl px-4 py-20">

            {/* En-tête avec image */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start mb-16">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Formation 04 — Cleen Leaders Academy</p>
                <h2 className="mb-4 text-4xl font-bold text-[#3f2f85] sm:text-5xl">Programme Empower Youth</h2>
                <p className="mb-4 text-slate-600 leading-relaxed">
                  Un programme de développement personnel intensif conçu pour équiper les jeunes (11–20 ans) des compétences émotionnelles, relationnelles et de leadership dont ils ont besoin pour construire leur avenir avec confiance, intégrité et vision.
                </p>
                <p className="mb-6 text-sm font-semibold text-[#3f2f85]">Durée : 9 mois — 3 niveaux progressifs — Séances hebdomadaires (samedi, 1h) — Certificat de réussite</p>

                <div className="mb-6 space-y-2">
                  <h3 className="font-semibold text-[#3f2f85]">Objectifs du programme</h3>
                  {[
                    "Renforcer l'estime et la confiance en soi des jeunes",
                    "Développer les compétences émotionnelles et relationnelles",
                    "Fournir des outils concrets de gestion du stress et des émotions",
                    "Cultiver un leadership éthique fondé sur des valeurs solides",
                    "Soutenir les parents dans leur rôle d'éducateur au quotidien",
                  ].map((o, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg border-l-4 border-[#e8b41f] bg-white p-3 text-sm font-medium text-slate-700">
                      <span className="font-bold text-[#e8b41f]">✓</span>{o}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "36", label: "Leçons au total" },
                    { value: "2", label: "Tranches d'âge" },
                    { value: "9", label: "Mois de formation" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-[#e8b41f] bg-white p-3 text-center">
                      <div className="text-xl font-bold text-[#3f2f85]">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/vision/Empower-youth.jpeg"
                  alt="Empower Youth"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Modules par niveau */}
            <div className="mb-14">
              <h3 className="mb-6 text-2xl font-bold text-[#3f2f85] text-center">Contenu des 3 niveaux</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  {
                    niveau: "Niveau 1",
                    titre: "Fondamentaux de la Croissance Personnelle",
                    lecons: "12 Leçons — 3 mois",
                    themes: [
                      "Connaissance de soi et identité",
                      "Gestion des émotions",
                      "Estime de soi et confiance",
                      "Valeurs et principes de vie",
                    ],
                  },
                  {
                    niveau: "Niveau 2",
                    titre: "Construire une Mentalité de Croissance",
                    lecons: "12 Leçons — 3 mois",
                    themes: [
                      "Communication positive",
                      "Gestion des conflits",
                      "Résilience et dépassement de soi",
                      "Vision et fixation d'objectifs",
                    ],
                  },
                  {
                    niveau: "Niveau 3",
                    titre: "Autonomie et Responsabilité",
                    lecons: "12 Leçons — 3 mois",
                    themes: [
                      "Leadership éthique et service",
                      "Prise de décision et responsabilité",
                      "Gestion du temps et des priorités",
                      "Projet de vie et engagement communautaire",
                    ],
                  },
                ].map((n, i) => (
                  <div key={i} className="rounded-lg border-l-4 border-[#e8b41f] bg-white p-6 shadow-sm">
                    <div className="mb-1 text-xs font-bold uppercase text-[#e8b41f]">{n.niveau}</div>
                    <div className="mb-1 text-sm font-semibold text-slate-400">{n.lecons}</div>
                    <h4 className="mb-4 font-bold text-[#3f2f85]">{n.titre}</h4>
                    <ul className="space-y-2">
                      {n.themes.map((t, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-0.5 font-bold text-[#e8b41f]">→</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Accompagnements inclus */}
            <div className="mb-14 rounded-lg border-l-4 border-[#e8b41f] bg-white p-8 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-[#3f2f85]">Accompagnements inclus dans le programme</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "Ateliers thématiques mensuels",
                  "Tables de croissance (mastermind entre jeunes)",
                  "Programmes de lecture encadrés",
                  "Coaching et counselling personnalisé",
                  "Sessions de partage parent-jeune",
                  "Certification de réussite par niveau",
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-bold text-[#e8b41f]">✓</span>{a}
                  </div>
                ))}
              </div>
            </div>

            {/* Tarifs */}
            <div className="mx-auto max-w-2xl">
              <h3 className="mb-6 text-center text-xl font-bold text-[#3f2f85]">Modalités de participation</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                <div className="rounded-lg bg-[#3f2f85] p-6 text-white">
                  <div className="text-xs font-semibold uppercase text-[#e8b41f] mb-3">Jeune de parent membre</div>
                  <div className="space-y-2 text-sm">
                    <div>Inscription : <span className="font-bold text-lg">15 000 FCFA</span></div>
                    <div>Par niveau : <span className="font-bold text-lg">35 000 FCFA</span></div>
                    <div className="pt-2 text-xs text-[#e8b41f]">Programme complet (3 niveaux) : <span className="font-bold">105 000 FCFA</span></div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-[#3f2f85] p-6">
                  <div className="text-xs font-semibold uppercase text-slate-500 mb-3">Tarif standard</div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div>Inscription : <span className="font-bold text-lg text-[#3f2f85]">25 000 FCFA</span></div>
                    <div>Par niveau : <span className="font-bold text-lg text-[#3f2f85]">60 000 FCFA</span></div>
                    <div className="pt-2 text-xs text-[#3f2f85]">Programme complet (3 niveaux) : <span className="font-bold">180 000 FCFA</span></div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500">Tranches d'âge : 11–15 ans et 16–20 ans • Séances chaque samedi</p>
              <Link href="/inscription" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f2f85] px-6 py-3 font-semibold text-white transition hover:opacity-90">
                Inscrire mon jeune <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Award className="mx-auto mb-6 h-14 w-14 text-[#e8b41f]" />
            <h2 className="mb-5 text-4xl font-bold sm:text-5xl">Rejoignez nos formations</h2>
            <p className="mb-8 text-lg text-slate-200">Les membres bénéficient de tarifs préférentiels sur toutes nos formations</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/inscription" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
                S'inscrire maintenant <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/public/ouvrages" className="inline-flex items-center justify-center rounded-lg border-2 border-[#e8b41f] px-8 py-4 font-semibold text-[#e8b41f] transition hover:bg-[#e8b41f] hover:text-[#3f2f85]">
                Voir les ouvrages
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  )
}
