import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HomeCarousel from "@/components/HomeCarousel"

export default function Home() {
  return (
    <>
      <Header />

      <main className="pt-16">
         {/* Carrousel photos */}
        <HomeCarousel />
        {/* Hero Section */}
        {/* <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance">
                  Former des Parents Selon les Valeurs Chrétiennes
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Rejoignez une communauté internationale de formation à la parentalité ancrée dans les principes
                  bibliques et le développement personnel.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                      S'inscrire maintenant
                    </Button>
                  </Link>
                  <a href="#activites">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:bg-opacity-10 bg-transparent"
                    >
                      Découvrir plus
                    </Button>
                  </a>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-2xl blur-3xl opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                    <p className="text-white font-semibold">Familles du monde entier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

       

        {/* Vision & Mission Section */}
        <section className="py-20 bg-[#f8eabf]/20" id="vision">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Notre Mission</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Offrir des formations de qualité ancrée dans les valeurs chrétiennes pour équiper les parents et renforcer les familles              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
              {[
                {
                  title: "Fondement Biblique",
                  description: "Nos enseignements tirent leur fondements de la bible pour une parentalité bienveillante",
                  icon: "📖",
                },
                {
                  title: "Communauté Bienveillante",
                  description: "Rejoignez des milliers de parents partageant les mêmes valeurs à travers le monde",
                  icon: "🤝",
                },
                {
                  title: "Croissance Personnel",
                  description: "Progressez à travers un système de grades reconnaissant votre engagement",
                  icon: "📈",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#a3ade8]/30  rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-20 bg-[#a3ade8]/30" id="activites">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Nos Activités Principales</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Découvrez les différentes formes de formation disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Enseignements Dominicaux",
                  description: "Sessions hebdomadaires sur des thèmes variés de parentalité et développement personnel",
                  icon: "🎓",
                },
                {
                  title: "Séminaires & Ateliers",
                  description: "Formations intensives mensuelles sur des sujets spécifiques et pratiques",
                  icon: "🎯",
                },
                {
                  title: "Formations Certifiantes",
                  description: "Certifications reconnues pour approfondir votre expertise en leadership familial",
                  icon: "🏆",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 mb-6">{item.description}</p>
                  <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    Découvrir →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Section */}
        <section className="py-20 bg-[#f8eabf]/20" id="adhesion">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Types d'Adhésion</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Choisissez le type d'adhésion qui correspond à vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Ordinaire",
                  price: "",
                  features: ["Accès au contenu", "Sessions en direct", "Parrainage", "Communauté"],
                },
                {
                  name: "Honneur",
                  price: "",
                  features: ["Tout de Ordinaire", "Badge Honneur", "Support prioritaire", "Événements VIP"],
                },
                {
                  name: "Bienfaiteur",
                  price: "",
                  features: [
                    "Tout de Honneur",
                    "Reconnaissance spéciale",
                    "Conseil consultatif",
                    "Avantages exclusifs",
                  ],
                },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-8 border-2 transition-all ${idx === 1 ? "border-blue-600 bg-blue-50 scale-105" : "border-slate-200 bg-white"}`}
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                  <p className="text-slate-600 mb-6">{tier.price}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-slate-600">
                        <span className="text-green-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup">
                    <Button className="w-full" variant={idx === 1 ? "default" : "outline"}>
                      Choisir
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grades Timeline Section */}
        {/* <section className="py-20 bg-[#a3ade8]/30" id="grades">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Plan de Carrière</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Progressez à travers 5 grades avec avantages croissants
              </p>
            </div>

            <div className="space-y-6">
              {[
                { grade: "Leader", color: "bg-green-500", desc: "4 parrains, 240 pts" },
                { grade: "Leader Senior", color: "bg-blue-500", desc: "8 parrains, 1200 pts" },
                { grade: "Coordinateur", color: "bg-indigo-500", desc: "18 parrains, 3000 pts" },
                { grade: "Mentor", color: "bg-purple-500", desc: "30 parrains, 10000 pts" },
                { grade: "Directeur", color: "bg-amber-500", desc: "50 parrains, 30000 pts" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={`${item.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-4 border border-slate-200">
                    <p className="font-bold text-slate-900">{item.grade}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Testimonials Section */}
        <section className="py-20 bg-[#a3ade8]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Témoignages</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Ce que nos membres disent de Parents School</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Marie Dupont",
                  title: "Mentor",
                  quote:
                    "Cette plateforme a transformé ma façon de voir la parentalité. Les valeurs chrétiennes sont au cœur.",
                  country: "France",
                },
                {
                  name: "Jean Ndjateh",
                  title: "Coordinateur",
                  quote:
                    "L'accès à une communauté mondiale est extraordinaire. On se sent soutenu dans notre parcours.",
                  country: "Cameroun",
                },
                {
                  name: "Sarah Okonkwo",
                  title: "Leader Senior",
                  quote:
                    "Les formations sont de très bonne qualité. Les enseignements impactent réellement ma famille.",
                  country: "Nigeria",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">"{item.quote}"</p>
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">
                      {item.title} • {item.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-4">Prêt à Commencer Votre Parcours?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Rejoignez des parents du monde entier en quête de formation et d'épanouissement familial
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  S'inscrire gratuitement
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:bg-opacity-10 bg-transparent"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
