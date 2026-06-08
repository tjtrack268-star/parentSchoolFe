import { getApiUrl } from '@/lib/api-config'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? ''

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'Fichier manquant' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = new FormData()
  body.append('file', file)

  const response = await fetch(getApiUrl('/api/admin/import'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })

  if (!response.ok) {
    const text = await response.text()
    return new Response(text, { status: response.status, headers: { 'Content-Type': 'application/json' } })
  }

  // Transformer ImportResult Spring → format attendu par la page
  // Spring:  { totalRows, imported, updated, errors, duplicates, errorDetails: string[] }
  // Frontend: { success, duplicates, errors, errorDetails: {line,field,message}[], members[] }
  const data = await response.json()

  const errorDetails = (data.errorDetails ?? []).map((msg: string) => {
    // Format: "Ligne 3: Email invalide: 'foo'"
    const lineMatch = msg.match(/^Ligne (\d+):\s*(.+)/)
    return {
      line:    lineMatch ? parseInt(lineMatch[1]) : 0,
      field:   '',
      message: lineMatch ? lineMatch[2] : msg,
    }
  })

  const result = {
    success:      (data.imported ?? 0) + (data.updated ?? 0),
    duplicates:   data.duplicates  ?? 0,
    errors:       data.errors      ?? 0,
    errorDetails,
    members:      [],  // ImportResult ne retourne pas la liste — à enrichir si besoin
  }

  return new Response(JSON.stringify(result), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  })
}
