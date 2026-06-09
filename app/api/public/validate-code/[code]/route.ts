import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://13.140.155.201:8080/"|| "http://localhost:8080"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params
  const code = rawCode?.trim()
  if (!code) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  try {
    const res = await fetch(
      `${BACKEND}/api/public/validate-code/${encodeURIComponent(code)}`,
      { cache: "no-store" }
    )

    const data = await res.json().catch(() => ({}))

    // Le backend peut renvoyer { valid: true, sponsorName: "..." }
    // ou juste un 200/404 selon l'implémentation
    if (res.ok) {
      return NextResponse.json({
        valid:       data.valid       ?? true,
        sponsorName: data.sponsorName ?? data.fullName ?? data.name ?? "",
      })
    }

    return NextResponse.json({ valid: false }, { status: 200 })
  } catch {
    return NextResponse.json({ valid: false }, { status: 200 })
  }
}
