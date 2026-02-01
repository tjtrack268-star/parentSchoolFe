import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Clear the auth token cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('auth_token', '', { maxAge: 0, path: '/' })
    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
