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

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.endpoints.auth.register), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const result: AuthResponse = await response.json();
    this.setToken(result.token);
    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.endpoints.auth.login), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const result: AuthResponse = await response.json();
    this.setToken(result.token);
    return result;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      // Store in cookie for middleware access
      document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
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
