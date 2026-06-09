import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const GRADE_LABELS: Record<string, string> = {
  MEMBER:        'Aucun',
  LEADER:        'Leader',
  LEADER_SENIOR: 'Leader Senior',
  COORDINATOR:   'Coordinateur',
  MENTOR:        'Mentor',
  DIRECTOR:      'Directeur',
}

function transform(m: any) {
  return {
    id:                      m.id,
    firstName:               m.firstName,
    lastName:                m.lastName,
    email:                   m.email,
    sponsorshipCode:         m.memberCode,
    gradeName:               GRADE_LABELS[m.grade] ?? m.grade ?? 'Aucun',
    userType:                m.memberType ?? 'ORDINARY',
    country:                 m.country ?? '',
    role:                    m.role,
    isActive:                m.active ?? m.isActive,
    level:                   m.level ?? 0,
    totalPoints:             m.points ?? 0,
    directSponsorshipsCount: m.directSponsoreesCount ?? 0,
    sponsorCode:             m.sponsorCode ?? null,
    createdAt:               m.createdAt,
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? ''

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }

  const { searchParams } = request.nextUrl
  const response = await fetch(
    getApiUrl(`/api/admin/members?${searchParams.toString()}`),
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
  )

  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status, headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await response.json()
  const result = Array.isArray(data)
    ? data.map(transform)
    : { ...data, content: (data.content ?? []).map(transform) }

  return new Response(JSON.stringify(result), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  })
}
