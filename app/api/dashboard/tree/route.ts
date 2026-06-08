import { getApiUrl } from "@/lib/api-config"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get("auth_token")?.value
    const headerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
    const token = (cookieToken || headerToken || "").replace(/^Bearer\s+/i, "").trim()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(getApiUrl("/api/members/me/network"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({ error: text || "API error" }, { status: response.status })
    }

    const node = await response.json()

    const convertToTreeFormat = (n: any): any => ({
      id: String(n.id),
      name: `${n.firstName} ${n.lastName}`,
      email: n.email || "",
      grade: n.gradeName,
      points: n.totalPoints,
      children: Array.isArray(n.children) ? n.children.map(convertToTreeFormat) : [],
    })

    const result = node ? convertToTreeFormat(node) : {
      id: "0",
      name: "Aucun réseau",
      email: "",
      grade: "Aucun",
      points: 0,
      children: [],
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
