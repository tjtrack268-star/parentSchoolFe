import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://13.140.155.201:8080" || "http://13.140.155.201:8080" || 'API_URL' || "http://localhost:8080"}/api/users/${id}/team`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json([], { status: 200 })
  }
}
