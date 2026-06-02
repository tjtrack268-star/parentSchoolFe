import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Commissions traitées via Spring Boot' })
}
