import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') || ''
    if (!q.trim()) return NextResponse.json([])

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://13.140.155.201:8080" || "http://13.140.155.201:8080" || 'API_URL' || "http://localhost:8080"}/api/sponsors/search?q=${encodeURIComponent(q)}`)
    if (!response.ok) {
      const detail = await response.text()
      return NextResponse.json({ error: detail || 'Search failed' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error('Error searching sponsors:', error)
    return NextResponse.json({ error: 'Failed to search sponsors' }, { status: 500 })
  }
}

