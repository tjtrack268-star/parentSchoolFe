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
  { code: 'CI', name: "Côte d'Ivoire",                  dial: '+225' },
  { code: 'CM', name: 'Cameroun',                        dial: '+237' },
  { code: 'SN', name: 'Sénégal',                         dial: '+221' },
  { code: 'BF', name: 'Burkina Faso',                    dial: '+226' },
  { code: 'TG', name: 'Togo',                            dial: '+228' },
  { code: 'BJ', name: 'Bénin',                           dial: '+229' },
  { code: 'GA', name: 'Gabon',                           dial: '+241' },
  { code: 'CD', name: 'République Démocratique du Congo', dial: '+243' },
  { code: 'CG', name: 'Congo',                           dial: '+242' },
  { code: 'GN', name: 'Guinée',                          dial: '+224' },
  { code: 'ML', name: 'Mali',                            dial: '+223' },
  { code: 'NE', name: 'Niger',                           dial: '+227' },
  { code: 'TD', name: 'Tchad',                           dial: '+235' },
  { code: 'MG', name: 'Madagascar',                      dial: '+261' },
  { code: 'FR', name: 'France',                          dial: '+33'  },
  { code: 'CA', name: 'Canada',                          dial: '+1'   },
  { code: 'BE', name: 'Belgique',                        dial: '+32'  },
  { code: 'CH', name: 'Suisse',                          dial: '+41'  },
  { code: 'US', name: 'États-Unis',                      dial: '+1'   },
  { code: 'GB', name: 'Royaume-Uni',                     dial: '+44'  },
  { code: 'OTHER', name: 'Autre',                        dial: ''     },
]
