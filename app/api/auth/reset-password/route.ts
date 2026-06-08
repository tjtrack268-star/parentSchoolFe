import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { tempToken, ...rest } = body

  // Token priority: tempToken from body > Authorization header > cookie
  let token = tempToken
  if (!token) {
    const authHeader = request.headers.get('authorization')
    token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  }
  if (!token) {
    const cookieStore = await cookies()
    token = cookieStore.get('auth_token')?.value ?? null
  }

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const response = await fetch(getApiUrl('/api/auth/reset-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rest),
  })
  const data = await response.text()
  return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json' } })
}
