import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://13.140.155.201:8080" || "http://localhost:8080"}/api/referrals-data`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching referrals:', error)
    return NextResponse.json([], { status: 200 })
  }
}
