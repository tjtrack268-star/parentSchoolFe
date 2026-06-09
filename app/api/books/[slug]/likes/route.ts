import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND = `${process.env.NEXT_PUBLIC_API_URL || "http://13.140.155.201:8080" || "http://localhost:8080"}`

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const res = await fetch(`${BACKEND}/api/books/${slug}/likes`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return NextResponse.json(await res.json())
}

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const res = await fetch(`${BACKEND}/api/books/${slug}/likes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  return NextResponse.json(await res.json(), { status: res.status })
}
