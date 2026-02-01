// External API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  endpoints: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
    },
    users: {
      getAll: '/api/users',
      create: '/api/users',
      getById: (id: string) => `/api/users/${id}`,
      update: (id: string) => `/api/users/${id}`,
      getTeam: (id: string) => `/api/users/${id}/team`,
    },
    payments: {
      create: '/api/payments',
      getHistory: '/api/payments/history',
    },
    organigramme: '/api/organigramme',
    grades: '/api/grades',
  },
};

export function getApiUrl(path: string): string {
  return `${API_CONFIG.baseUrl}${path}`;
}
