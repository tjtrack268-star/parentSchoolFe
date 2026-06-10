import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND = `${process.env.NEXT_PUBLIC_API_URL ||"https://13.140.155.201:8080" ||'http://13.140.155.201:8080' || 'API_URL' || "http://localhost:8080"}`

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const res = await fetch(`${BACKEND}/api/books/${slug}/comments`)
  return NextResponse.json(await res.json())
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const body = await request.json()

  const res = await fetch(`${BACKEND}/api/books/${slug}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  return NextResponse.json(await res.json(), { status: res.status })
}
