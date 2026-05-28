import { getApiUrl } from "@/lib/api-config"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const incomingFormData = await request.formData()
    const file = incomingFormData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 })
    }

    const body = new FormData()
    body.append("file", file)

    const response = await fetch(getApiUrl("/api/eleves/import"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
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
