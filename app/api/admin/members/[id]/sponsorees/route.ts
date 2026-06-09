import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const GRADE_LABELS: Record<string, string> = {
  MEMBER: 'Aucun', LEADER: 'Leader', LEADER_SENIOR: 'Leader Senior',
  COORDINATOR: 'Coordinateur', MENTOR: 'Mentor', DIRECTOR: 'Directeur',
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? ''

  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  // Backend retourne les sponsorees via GET /api/admin/members/{id} dans data.sponsorees
  const response = await fetch(getApiUrl(`/api/admin/members/${id}`), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json' } })

  const data = await response.json()
  const sponsorees = (data.sponsorees ?? []).map((s: any) => ({
    id:              s.id,
    firstName:       s.firstName,
    lastName:        s.lastName,
    sponsorshipCode: s.memberCode ?? s.sponsorshipCode,
    gradeName:       GRADE_LABELS[s.grade] ?? s.grade ?? 'Aucun',
    totalPoints:     s.points ?? s.totalPoints ?? 0,
    createdAt:       s.createdAt,
  }))

  return new Response(JSON.stringify(sponsorees), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
