// ─── Shared Configuration ───

/**
 * API_BASE: The base URL for all backend API calls.
 *
 * IMPORTANT: You need to deploy your Go backend server and add its URL here.
 *
 * Development (localhost):
 *   - Keep empty string '' for local dev (proxied by Vite)
 *
 * Production (GitHub Pages):
 *   - BEFORE DEPLOYING: Update this to your backend server URL
 *   - Example: 'https://api.yourdomain.com'
 *   - Example: 'https://your-render-app.onrender.com'
 *   - Make sure backend has CORS enabled for https://zinlynhtet.github.io
 */
export const API_BASE = window.location.hostname === 'localhost'
  ? ''
  : 'https://onigiri-w-api.onrender.com';

/**
 * Determines the correct relative path prefix for navigation.
 * Works on both localhost (Vite dev) and GitHub Pages subdirectory.
 */
export function getBasePath(): string {
  // Vite injects import.meta.env.BASE_URL which is '/onigiri.w/' in production
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
