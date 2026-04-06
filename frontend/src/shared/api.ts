// ─── Shared API Utilities ───

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
  localStorage.clear();
}

export function saveSession(token: string, username: string, wallet: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('ogz_user', username);
  localStorage.setItem('ogz_wallet', wallet);
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
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    clearSession();
    window.location.href = '/login.html';
    throw new Error('Session expired');
  }
  return res;
}
