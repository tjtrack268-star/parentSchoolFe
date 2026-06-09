import { getApiUrl } from '@/lib/api-config'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const response = await fetch(getApiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  const data = await response.text()
  return new Response(data, { status: response.status, headers: { 'Content-Type': 'application/json' } })
}
