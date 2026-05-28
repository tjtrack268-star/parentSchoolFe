import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError

    // Get referral counts
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('sponsor_id', session.user.id)

    // Get monthly commission
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('type', 'commission')
      .gte(
        'created_at',
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      )

    const stats = {
      profile,
      totalReferrals: referrals?.length || 0,
      directReferrals: referrals?.filter(r => r.sponsor_id === session.user.id).length || 0,
      monthlyCommission: transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
      totalPoints: profile.points,
      currentGrade: profile.current_grade,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
