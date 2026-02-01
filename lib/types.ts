export type MemberType = "ordinaire" | "honneur" | "bienfaiteur"
export type GradeName = "Leader" | "Leader Senior" | "Coordinateur" | "Mentor" | "Directeur"
export type TransactionType = "membership_fee" | "commission" | "bonus"
export type TransactionStatus = "pending" | "completed" | "cancelled"

export interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  member_type: MemberType
  country: string
  city: string
  sponsor_id: string | null
  referral_code: string
  current_grade: GradeName
  total_points: number
  is_active: boolean
  is_focal_point: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  sponsor_id: string
  sponsored_id: string
  generation_level: number
  created_at: string
}

export interface Grade {
  id: string
  name: GradeName
  required_direct_referrals: number
  required_points: number
  benefits_amount_fcfa: number
  commission_direct_percent: number
  commission_team_percent: number
  max_generation_commission: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount_fcfa: number
  description?: string
  source_referral_id?: string
  status: TransactionStatus
  created_at: string
  updated_at: string
}

export interface SessionVoucher {
  id: string
  owner_id: string
  code: string
  value_fcfa: number
  is_used: boolean
  used_by?: string
  used_at?: string
  created_at: string
}
