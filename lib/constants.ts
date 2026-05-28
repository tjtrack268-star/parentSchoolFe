export const GRADES = {
  Leader: {
    requiredReferrals: 4,
    requiredPoints: 240,
    benefitsFcfa: 5000,
    commissions: {
      directCommission: 0,
      teamCommission: 0,
    },
  },
  "Leader Senior": {
    requiredReferrals: 8,
    requiredPoints: 1200,
    benefitsFcfa: 10000,
    commissions: {
      directCommission: 0,
      teamCommission: 0.05,
    },
  },
  Coordinateur: {
    requiredReferrals: 18,
    requiredPoints: 3000,
    benefitsFcfa: 15000,
    commissions: {
      directCommission: 0.1,
      teamCommission: 0.05,
    },
  },
  Mentor: {
    requiredReferrals: 30,
    requiredPoints: 10000,
    benefitsFcfa: 25000,
    commissions: {
      directCommission: 0.1,
      teamCommission: 0.05,
    },
  },
  Directeur: {
    requiredReferrals: 50,
    requiredPoints: 30000,
    benefitsFcfa: 50000,
    commissions: {
      directCommission: 0.15,
      teamCommission: 0.075,
    },
  },
} as const

export const GRADE_COLORS = {
  'Leader': 'hsl(140, 70%, 50%)',
  'Leader Senior': 'hsl(200, 80%, 50%)',
  'Coordinateur': 'hsl(220, 90%, 50%)',
  'Mentor': 'hsl(270, 80%, 50%)',
  'Directeur': 'hsl(45, 95%, 50%)',
  'Aucun': '#e5e7eb'
}

export const COUNTRIES = [
  { code: 'CM', name: 'Cameroun' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'CD', name: 'République Démocratique du Congo' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'CG', name: 'Congo' }
]
