import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Member { name: string; role: string; file: string }
interface Rank { title: string; accent: string; members: Member[] }

const ORG: Rank[] = [
  {
    title: "Fondateur",
    accent: "#e8b41f",
    members: [
      { name: "Clément Emadouan", role: "Fondateur", file: "clement-emadouan.jpeg" },
    ],
  },
  {
    title: "Coordination",
    accent: "#f97316",
    members: [
      { name: "Pasteur Bogni Abé Clotaire", role: "Coordinateur & Membre d'honneur", file: "bogni-clotaire.jpeg" },
      { name: "Sylviane Kamenan", role: "Coordinatrice", file: "sylviane-kamenan.jpeg" },
    ],
  },
  {
    title: "Membre d'honneur",
    accent: "#3f2f85",
    members: [
      { name: "Pasteur Fred Adinda", role: "Membre d'honneur", file: "fred-adinda.jpeg" },
    ],
  },
  {
    title: "Leaders Senior",
    accent: "#3b82f6",
    members: [
      { name: "Esther Yokoi", role: "Leader Senior", file: "esther-yokoi.jpeg" },
      { name: "Hilaire Lelou", role: "Leader Senior", file: "hilaire-lelou.jpeg" },
      { name: "Kobenan Felix", role: "Leader Senior", file: "kobenan-felix.jpeg" },
      { name: "Pasteur Vonopou Daniel", role: "Leader Senior", file: "vonopou-daniel.jpeg" },
      { name: "Véronique Akoko", role: "Leader Senior", file: "veronique-akoko.jpeg" },
    ],
  },
  {
    title: "Leaders",
    accent: "#22c55e",
    members: [
      { name: "Assiettou Kouakou", role: "Leader", file: "assiettou-kouakou.jpeg" },
      { name: "Florence Guèhe", role: "Leader", file: "florence-guehe.jpeg" },
      { name: "Mireille Obrou", role: "Leader", file: "mireille-obrou.jpeg" },
      { name: "Nadège Bagui", role: "Leader", file: "nadege-bagui.jpeg" },
      { name: "Pasteur Bai Zoko Marc Achille", role: "Leader", file: "bai-zoko-marc-achille.jpeg" },
      { name: "Pasteur N'Guessan Yao Israël", role: "Leader", file: "nguessan-yao-israel.jpeg" },
      { name: "Pasteur Viglo Yawori Oga Mawuena", role: "Leader", file: "viglo-yawori-oga-mawuena.jpeg" },
    ],
  },
  {
    title: "Membres",
    accent: "#a3ade8",
    members: [
      { name: "Assiata Kabore", role: "Membre", file: "assiata-kabore.jpeg" },
      { name: "Ayob Afonong Françoise", role: "Membre", file: "ayob-afonong-francoise.jpeg" },
      { name: "Boula Romuald", role: "Membre", file: "boula-romuald.jpeg" },
      { name: "Christelle Fouomene", role: "Membre", file: "christelle-fouomene.jpeg" },
      { name: "Colette Emadouan", role: "Membre", file: "colette-emadouan.jpeg" },
      { name: "Laurène Kadjeu", role: "Membre", file: "laurene-kadjeu.jpeg" },
      { name: "Pasteur Tandy Tandy Jacques", role: "Membre", file: "tandy-tandy-jacques.jpeg" },
    ],
  },
]

const src = (file: string) => `/organisation/${encodeURIComponent(file)}`

function MemberCard({ member, accent, big = false }: { member: Member; accent: string; big?: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-[#a3ade8]/20 transition hover:-translate-y-1 hover:shadow-md">
      <div
        className={`${big ? "h-32 w-32" : "h-24 w-24"} overflow-hidden rounded-full`}
        style={{ boxShadow: `0 0 0 3px ${accent}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src(member.file)} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <p className={`mt-3 font-bold text-[#3f2f85] ${big ? "text-lg" : "text-sm"}`}>{member.name}</p>
      <span
        className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        {member.role}
      </span>
    </div>
  )
}

export default function OrganigramPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ef]">
      <Header />
      <div className="pt-16">

        {/* Hero */}
        <section className="bg-[#3f2f85] text-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Notre équipe</p>
              <h1 className="mb-4 text-5xl font-bold leading-tight sm:text-6xl">Organigramme</h1>
              <p className="text-lg leading-relaxed text-slate-100">
                Les femmes et les hommes qui animent la communauté Parents School, du fondateur aux membres.
              </p>
            </div>
          </div>
        </section>

        {/* Organigramme */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          {ORG.map((rank, i) => {
            const centered = rank.members.length <= 2
            return (
              <div key={rank.title} className={i > 0 ? "mt-12" : ""}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: rank.accent }} />
                  <h2 className="text-2xl font-bold text-[#3f2f85]">{rank.title}</h2>
                  <span className="text-sm text-slate-400">
                    {rank.members.length} membre{rank.members.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div
                  className={
                    centered
                      ? "flex flex-wrap justify-center gap-6"
                      : "grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  }
                >
                  {rank.members.map(m => (
                    <div key={m.file} className={centered ? "w-56" : ""}>
                      <MemberCard member={m} accent={rank.accent} big={rank.title === "Fondateur"} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoindre la communauté</h2>
            <p className="mb-8 text-white/90">Inscrivez-vous et intégrez notre réseau de parrainage</p>
            <Link href="/inscription"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
              S'inscrire maintenant
            </Link>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  )
}
