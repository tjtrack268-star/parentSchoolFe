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

  const response = await fetch(getApiUrl('/api/admin/formation-registrations'), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })

  return new Response(await response.text(), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
