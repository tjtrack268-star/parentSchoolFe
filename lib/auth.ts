// lib/auth.ts — Gestion JWT centralisée

const KEYS = {
  token:     "auth_token",
  role:      "auth_role",
  firstName: "auth_firstName",
} as const

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${value}; path=/; max-age=${days * 24 * 60 * 60}`
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; max-age=0`
}

/** Stocke le token, le rôle et le prénom après connexion */
export function saveToken(token: string, role: string, firstName: string): void {
  if (typeof window === "undefined") return
  const t = token.replace(/^Bearer\s+/i, "").trim()
  localStorage.setItem(KEYS.token,     t)
  localStorage.setItem(KEYS.role,      role)
  localStorage.setItem(KEYS.firstName, firstName)
  setCookie("auth_token", t)
}

/** Retourne le JWT brut ou null */
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(KEYS.token)
}

/** Retourne le rôle ou null */
export function getRole(): "MEMBER" | "ADMIN" | null {
  if (typeof window === "undefined") return null
  const r = localStorage.getItem(KEYS.role)
  if (r === "MEMBER" || r === "ADMIN") return r
  return null
}

/** Retourne le prénom ou null */
export function getFirstName(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(KEYS.firstName)
}

/** Retourne true si un token est présent */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/** Vide le localStorage + cookie + redirige vers /auth/login */
export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEYS.token)
  localStorage.removeItem(KEYS.role)
  localStorage.removeItem(KEYS.firstName)
  clearCookie("auth_token")
  window.location.href = "/auth/login"
}
