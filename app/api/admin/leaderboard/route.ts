import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade') || 'Leader'
    const limit = parseInt(searchParams.get('limit') || '100')

    // Get leaderboard for grade
    const { data, error } = await supabase.rpc('get_grade_leaderboard', {
      grade_name: grade,
      limit_count: limit,
    })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
