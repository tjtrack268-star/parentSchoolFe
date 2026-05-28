export interface OrganigrammeNode {
  id: string
  firstName: string
  lastName: string
  email?: string
  sponsorshipCode: string
  gradeName: string
  directSponsorshipsCount: number
  totalPoints: number
  children: OrganigrammeNode[]
}
