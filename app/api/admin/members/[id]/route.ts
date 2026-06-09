import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const GRADE_LABELS: Record<string, string> = {
  MEMBER: 'Aucun', LEADER: 'Leader', LEADER_SENIOR: 'Leader Senior',
  COORDINATOR: 'Coordinateur', MENTOR: 'Mentor', DIRECTOR: 'Directeur',
}

function transformProfile(m: any) {
  return {
    id:                      m.id,
    firstName:               m.firstName,
    lastName:                m.lastName,
    email:                   m.email,
    phone:                   m.phone ?? '',
    country:                 m.country ?? '',
    profession:              m.profession ?? '',
    userType:                m.memberType ?? 'ORDINARY',
    userRole:                m.role ?? 'MEMBER',
    sponsorshipCode:         m.memberCode ?? m.sponsorshipCode,
    totalPoints:             m.points ?? m.totalPoints ?? 0,
    directSponsorshipsCount: m.directSponsoreesCount ?? m.directSponsorshipsCount ?? 0,
    createdAt:               m.createdAt,
    gradeName:               GRADE_LABELS[m.grade] ?? m.grade ?? 'Aucun',
    sponsor:                 m.sponsorName ? {
      firstName:       m.sponsorName.split(' ')[0] ?? '',
      lastName:        m.sponsorName.split(' ').slice(1).join(' ') ?? '',
      sponsorshipCode: m.sponsorCode ?? '',
    } : null,
  }
}

function transformSponsoree(s: any) {
  return {
    id:              s.id,
    firstName:       s.firstName,
    lastName:        s.lastName,
    sponsorshipCode: s.memberCode ?? s.sponsorshipCode,
    gradeName:       GRADE_LABELS[s.grade] ?? s.grade ?? 'Aucun',
    totalPoints:     s.points ?? s.totalPoints ?? 0,
    createdAt:       s.createdAt,
  }
}

async function getToken(request: NextRequest) {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? ''
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await getToken(request)
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const response = await fetch(getApiUrl(`/api/admin/members/${id}`), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json' } })

  const data = await response.json()
  // Backend retourne { profile, sponsorees }
  const result = transformProfile(data.profile ?? data)
  return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await getToken(request)
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const body = await request.text()
  const response = await fetch(getApiUrl(`/api/admin/members/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body,
  })
  if (!response.ok) return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json' } })

  const data = await response.json()
  return new Response(JSON.stringify(transformProfile(data)), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
