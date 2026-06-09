import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? ''

  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const response = await fetch(getApiUrl('/api/admin/grades/history'), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json' } })

  const data: any[] = await response.json()

  // AuditLog: { id, userId, targetId, action, oldValue, newValue, createdAt }
  // newValue format: "LEADER>=4, LEADER_SENIOR>=8, ..."
  const result = data.map(log => ({
    id:        log.id,
    date:      log.createdAt,
    adminName: `Admin #${log.userId ?? '?'}`,
    changes:   parseChanges(log.oldValue, log.newValue),
  }))

  return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

const GRADE_LABELS: Record<string, string> = {
  MEMBER: 'Aucun', LEADER: 'Leader', LEADER_SENIOR: 'Leader Senior',
  COORDINATOR: 'Coordinateur', MENTOR: 'Mentor', DIRECTOR: 'Directeur',
}

function parseChanges(oldVal: string | null, newVal: string | null) {
  if (!oldVal || !newVal) return []
  try {
    const parse = (v: string) => Object.fromEntries(
      v.split(',').map(s => { const [k, n] = s.trim().split('>='); return [k.trim(), Number(n)] })
    )
    const oldMap = parse(oldVal)
    const newMap = parse(newVal)
    return Object.keys(newMap)
      .filter(k => oldMap[k] !== newMap[k])
      .map(k => ({
        grade:    GRADE_LABELS[k] ?? k,
        field:    'Seuil min filleuls',
        oldValue: oldMap[k] ?? 0,
        newValue: newMap[k],
      }))
  } catch {
    return []
  }
}
