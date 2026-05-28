import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get performance report for user
    const { data, error } = await supabase.rpc('get_performance_report', {
      user_id: session.user.id,
    })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching performance report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
