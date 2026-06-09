import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

async function getToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.substring(7)
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value ?? null
}

export async function GET(request: NextRequest) {
  const token = await getToken(request)
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const response = await fetch(getApiUrl('/api/members/me'), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  const data = await response.text()
  return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json' } })
}

export async function PUT(request: NextRequest) {
  const token = await getToken(request)
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const body = await request.text()
  const response = await fetch(getApiUrl('/api/members/me'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body,
  })
  const data = await response.text()
  return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json' } })
}
