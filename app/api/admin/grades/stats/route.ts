import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const GRADE_LABELS: Record<string, string> = {
  MEMBER: 'Aucun', LEADER: 'Leader', LEADER_SENIOR: 'Leader Senior',
  COORDINATOR: 'Coordinateur', MENTOR: 'Mentor', DIRECTOR: 'Directeur',
}

const GRADE_COLORS: Record<string, string> = {
  'Aucun': '#94a3b8', 'Leader': '#22c55e', 'Leader Senior': '#3b82f6',
  'Coordinateur': '#f97316', 'Mentor': '#a855f7', 'Directeur': '#e8b41f',
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? ''

  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const response = await fetch(getApiUrl('/api/admin/grades'), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json' } })

  const data: any[] = await response.json()
  const totalMembers = data.reduce((sum, g) => sum + (g.memberCount ?? 0), 0)

  const result = data
    .filter(g => g.gradeName !== 'MEMBER')
    .map(g => {
      const label = GRADE_LABELS[g.gradeName] ?? g.gradeName
      return {
        name:           label,
        minSponsors:    g.minSponsored ?? 0,
        maxSponsors:    g.maxSponsored ?? 0,
        minPoints:      (g.minSponsored ?? 0) * (g.pointsPerSponsor ?? 60),
        maxPoints:      (g.maxSponsored ?? 0) * (g.pointsPerSponsor ?? 60),
        currentMembers: g.memberCount ?? 0,
        totalMembers,
        color:          GRADE_COLORS[label] ?? '#94a3b8',
      }
    })

  return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
