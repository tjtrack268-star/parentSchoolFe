import { getApiUrl } from "@/lib/api-config"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const GRADE_LABELS: Record<string, string> = {
  MEMBER:        "Aucun",
  LEADER:        "Leader",
  LEADER_SENIOR: "Leader Senior",
  COORDINATOR:   "Coordinateur",
  MENTOR:        "Mentor",
  DIRECTOR:      "Directeur",
}

function transform(node: any): any {
  return {
    id:                      node.id,
    firstName:               node.firstName,
    lastName:                node.lastName,
    sponsorshipCode:         node.memberCode,
    gradeName:               GRADE_LABELS[node.grade] ?? node.grade ?? "Aucun",
    country:                 node.country ?? "",
    totalPoints:             node.points ?? 0,
    directSponsorshipsCount: node.directSponsoreesCount ?? 0,
    children:                (node.children ?? []).map(transform),
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(getApiUrl("/api/admin/org-chart"), {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(transform(data))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
