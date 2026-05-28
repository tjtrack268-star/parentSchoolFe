import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND = 'http://localhost:8080'

export async function GET() {
  const res = await fetch(`${BACKEND}/api/testimonials`)
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const body = await request.json()

    const res = await fetch(`${BACKEND}/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
