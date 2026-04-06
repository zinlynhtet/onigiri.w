// ─── Shared Configuration ───

/**
 * API_BASE: The base URL for all backend API calls.
 * - For local development (frontend + Go backend on same machine): leave as ''
 * - For production (frontend on GitHub Pages, backend elsewhere):
 *   set to your backend URL, e.g. 'https://your-server.com'
 */
export const API_BASE = '';

/**
 * Determines the correct relative path prefix for navigation.
 * Works on both localhost (Vite dev) and GitHub Pages subdirectory.
 */
export function getBasePath(): string {
  // Vite injects import.meta.env.BASE_URL which is './' from our config
  return import.meta.env.BASE_URL || './';
}

/**
 * Navigate to a page using the correct base path.
 */
export function navigateTo(page: string): void {
  const base = getBasePath();
  // Ensure no double slashes
  const url = base.endsWith('/') ? base + page : base + '/' + page;
  window.location.href = url;
}
