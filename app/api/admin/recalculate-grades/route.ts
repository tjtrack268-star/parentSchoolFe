import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Grades recalculés via Spring Boot' })
}
