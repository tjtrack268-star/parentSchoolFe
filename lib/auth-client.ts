import { API_CONFIG, getApiUrl } from './api-config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country: string;
  userType: string;
  sponsorCode?: string;
  sponsorName?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    country?: string;
    referralCode: string;
  };
}

class AuthClient {
  private token: string | null = null;

  private async getErrorMessage(response: Response, fallback: string): Promise<string> {
    try {
      const payload = await response.json();
      if (typeof payload?.message === 'string' && payload.message.trim()) {
        return payload.message;
      }
      if (typeof payload?.error === 'string' && payload.error.trim()) {
        return payload.error;
      }
    } catch {
      // Ignore parsing error and try plain text body
    }
    try {
      const text = await response.text();
      if (text.trim()) return text.trim();
    } catch {
      // Ignore invalid text body and return fallback
    }
    return fallback;
  }
  
  private normalizeToken(token: string): string {
    return token.replace(/^Bearer\s+/i, '').trim();
  }

  constructor() {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      this.token = savedToken ? this.normalizeToken(savedToken) : null;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.endpoints.auth.register), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const detail = await this.getErrorMessage(response, 'Registration failed');
      throw new Error(detail);
    }

    const result = await response.json();

    // Le backend retourne { token, user } comme le login
    const token = result.token;
    const u = result.user ?? result;
    const authResponse: AuthResponse = {
      token,
      user: {
        id: String(u.id ?? ''),
        email: u.email ?? '',
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        phone: u.phone,
        country: u.country,
        referralCode: u.sponsorshipCode ?? '',
      },
    };
    this.setToken(token);
    return authResponse;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = email.trim().toLowerCase()
    const response = await fetch(getApiUrl(API_CONFIG.endpoints.auth.login), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password }),
    })

    if (!response.ok) {
      const detail = await this.getErrorMessage(response, 'Email ou mot de passe incorrect')
      throw new Error(detail)
    }

    const result = await response.json()
    const u = result.user ?? result
    const authResponse: AuthResponse = {
      token: result.token,
      user: {
        id: String(u.id ?? ''),
        email: u.email ?? '',
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        phone: u.phone,
        country: u.country,
        referralCode: u.sponsorshipCode ?? '',
      },
    }
    this.setToken(result.token)
    return authResponse
  }

  setToken(token: string): void {
    const normalizedToken = this.normalizeToken(token);
    this.token = normalizedToken;
    if (typeof window !== 'undefined') {
      // Store in cookie for middleware access
      document.cookie = `auth_token=${normalizedToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      localStorage.setItem('auth_token', normalizedToken);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_token')
      if (stored) return this.normalizeToken(stored)
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      // Clear cookie
      document.cookie = 'auth_token=; path=/; max-age=0';
      localStorage.removeItem('auth_token');
    }
  }

  getAuthHeader(): Record<string, string> {
    if (!this.token) {
      return {};
    }
    return { Authorization: `Bearer ${this.token}` };
  }
}

export const authClient = new AuthClient();
