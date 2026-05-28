import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') || ''
    if (!q.trim()) return NextResponse.json([])

    const response = await fetch(`http://localhost:8080/api/sponsors/search?q=${encodeURIComponent(q)}`)
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

