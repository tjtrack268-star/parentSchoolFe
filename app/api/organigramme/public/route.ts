import { getApiUrl } from "@/lib/api-config"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(getApiUrl("/api/organigramme/public"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const text = await response.text()
    let payload: unknown = text
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }

    return NextResponse.json(payload, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

