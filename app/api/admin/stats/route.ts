import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? ''

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const response = await fetch(getApiUrl('/api/admin/stats'), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Transformer GlobalStatsDTO → AdminStats (format attendu par admin-dashboard/page.tsx)
  const raw = await response.json()

  const gradeOrder = ['MEMBER', 'LEADER', 'LEADER_SENIOR', 'COORDINATOR', 'MENTOR', 'DIRECTOR']
  const gradeLabels: Record<string, string> = {
    MEMBER: 'Aucun', LEADER: 'Leader', LEADER_SENIOR: 'Leader Senior',
    COORDINATOR: 'Coordinateur', MENTOR: 'Mentor', DIRECTOR: 'Directeur',
  }

  const gradeStats = gradeOrder
    .filter(k => raw.membersByGrade?.[k] !== undefined)
    .map(k => ({ grade: gradeLabels[k] ?? k, count: raw.membersByGrade[k] as number }))

  const topSponsors = (raw.top5Sponsors ?? []).map((s: any) => ({
    rank:             s.rank,
    firstName:        s.firstName,
    lastName:         s.lastName,
    sponsorshipCode:  s.memberCode,
    gradeName:        gradeLabels[s.grade] ?? s.grade ?? 'Aucun',
    sponsoreesCount:  Number(s.directSponsoreesCount ?? 0),
  }))

  const recentMembers = (raw.last5Registrations ?? []).map((m: any) => ({
    firstName:        m.firstName,
    lastName:         m.lastName,
    sponsorshipCode:  m.memberCode,
    userType:         m.memberType ?? m.userType ?? 'ORDINARY',
    gradeName:        gradeLabels[m.grade] ?? m.grade ?? 'Aucun',
    createdAt:        m.createdAt,
  }))

  const adminStats = {
    kpi: {
      totalMembers:    raw.totalMembers    ?? 0,
      activeSponsors:  raw.activeSponsors  ?? 0,
      hierarchyLevels: raw.totalLevels     ?? 0,
      countriesCount:  raw.countriesRepresented ?? 0,
    },
    gradeStats,
    topSponsors,
    recentMembers,
  }

  return new Response(JSON.stringify(adminStats), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
