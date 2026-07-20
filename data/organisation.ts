export interface OrgMember {
  name: string
  role: string
  image: string
  description: string
}

export interface OrgRank {
  title: string
  accent: string
  members: OrgMember[]
}

const img = (slug: string) => `/organisation/${slug}.jpeg`

export const ORG_RANKS: OrgRank[] = [
  {
    title: "Fondateur",
    accent: "#e8b41f",
    members: [
      { name: "Clément Emadouan", role: "Fondateur", image: img("clement-emadouan"), description: "Fondateur & directeur de Parents School" },
    ],
  },
  {
    title: "Coordination",
    accent: "#f97316",
    members: [
      { name: "Pasteur Bogni Abé Clotaire", role: "Coordinateur & Membre d'honneur", image: img("bogni-clotaire"), description: "Coordination de la communauté" },
      { name: "Sylviane Kamenan", role: "Coordinatrice", image: img("sylviane-kamenan"), description: "Coordination de la communauté" },
    ],
  },
  {
    title: "Membre d'honneur",
    accent: "#3f2f85",
    members: [
      { name: "Pasteur Fred Adinda", role: "Membre d'honneur", image: img("fred-adinda"), description: "Membre d'honneur" },
    ],
  },
  {
    title: "Leaders Senior",
    accent: "#3b82f6",
    members: [
      { name: "Esther Yokoi", role: "Leader Senior", image: img("esther-yokoi"), description: "Leader Senior" },
      { name: "Hilaire Lelou", role: "Leader Senior", image: img("hilaire-lelou"), description: "Leader Senior" },
      { name: "Kobenan Felix", role: "Leader Senior", image: img("kobenan-felix"), description: "Leader Senior" },
      { name: "Pasteur Vonopou Daniel", role: "Leader Senior", image: img("vonopou-daniel"), description: "Leader Senior" },
      { name: "Véronique Akoko", role: "Leader Senior", image: img("veronique-akoko"), description: "Leader Senior" },
    ],
  },
  {
    title: "Leaders",
    accent: "#22c55e",
    members: [
      { name: "Assiettou Kouakou", role: "Leader", image: img("assiettou-kouakou"), description: "Leader de la communauté" },
      { name: "Florence Guèhe", role: "Leader", image: img("florence-guehe"), description: "Leader de la communauté" },
      { name: "Mireille Obrou", role: "Leader", image: img("mireille-obrou"), description: "Leader de la communauté" },
      { name: "Nadège Bagui", role: "Leader", image: img("nadege-bagui"), description: "Leader de la communauté" },
      { name: "Pasteur Bai Zoko Marc Achille", role: "Leader", image: img("bai-zoko-marc-achille"), description: "Leader de la communauté" },
      { name: "Pasteur N'Guessan Yao Israël", role: "Leader", image: img("nguessan-yao-israel"), description: "Leader de la communauté" },
      { name: "Pasteur Viglo Yawori Oga Mawuena", role: "Leader", image: img("viglo-yawori-oga-mawuena"), description: "Leader de la communauté" },
    ],
  },
  {
    title: "Membres",
    accent: "#a3ade8",
    members: [
      // { name: "Assiata Kabore", role: "Membre", image: img("assiata-kabore"), description: "Membre de la communauté" },
      // { name: "Ayob Afonong Françoise", role: "Membre", image: img("ayob-afonong-francoise"), description: "Membre de la communauté" },
      // { name: "Boula Romuald", role: "Membre", image: img("boula-romuald"), description: "Membre de la communauté" },
      // { name: "Christelle Fouomene", role: "Membre", image: img("christelle-fouomene"), description: "Membre de la communauté" },
      // { name: "Colette Emadouan", role: "Membre", image: img("colette-emadouan"), description: "Membre de la communauté" },
      // { name: "Laurène Kadjeu", role: "Membre", image: img("laurene-kadjeu"), description: "Membre de la communauté" },
      // { name: "Pasteur Tandy Tandy Jacques", role: "Membre", image: img("tandy-tandy-jacques"), description: "Membre de la communauté" },
    ],
  },
]

export const ORG_MEMBERS: OrgMember[] = ORG_RANKS.flatMap(r => r.members)
