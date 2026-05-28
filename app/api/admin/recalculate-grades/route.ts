import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Call the function to recalculate all user grades
    const { error } = await supabase.rpc('calculate_all_user_grades')

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Les grades ont été recalculés pour tous les utilisateurs',
    })
  } catch (error) {
    console.error('Error recalculating grades:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
