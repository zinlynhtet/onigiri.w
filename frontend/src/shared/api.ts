// ─── Shared API Utilities ───

import { API_BASE, navigateTo } from './config';

const TOKEN_KEY = 'ogz_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSession() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    username: localStorage.getItem('ogz_user'),
    wallet: localStorage.getItem('ogz_wallet'),
  };
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('ogz_user');
  localStorage.removeItem('ogz_wallet');
}

export function saveSession(token: string, username: string, wallet: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('ogz_user', username);
  localStorage.setItem('ogz_wallet', wallet);
}

/**
 * Returns true if the user has a valid session (token exists).
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Route guard: redirect unauthenticated users to login.
 * Call this at the top of protected pages (dashboard).
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    navigateTo('login.html');
  }
}

/**
 * Route guard: redirect authenticated users away from auth pages.
 * Call this at the top of login/signup pages.
 */
export function redirectIfAuthenticated(): void {
  if (isAuthenticated()) {
    navigateTo('index.html');
  }
}

/**
 * Authenticated fetch wrapper — auto-redirects to login on 401.
 */
export async function api(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  const res = await fetch(fullUrl, { ...options, headers });
  if (res.status === 401) {
    clearSession();
    navigateTo('login.html');
    throw new Error('Session expired');
  }
  return res;
}
