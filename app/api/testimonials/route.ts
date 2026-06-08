import { getApiUrl } from '@/lib/api-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(getApiUrl('/api/testimonials'))
    if (!res.ok) return NextResponse.json([], { status: 200 })
    const data = await res.json()
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(getApiUrl('/api/testimonials'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
