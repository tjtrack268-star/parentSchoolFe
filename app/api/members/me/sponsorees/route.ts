import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  if (!token) {
    const cookieStore = await cookies()
    token = cookieStore.get('auth_token')?.value ?? null
  }
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const response = await fetch(getApiUrl('/api/members/me/sponsorees'), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  const data = await response.text()
  return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json' } })
}
