// Single source of truth for the live product entry point (the sign-in /
// sign-up page of the real app). The "Try the beta" buttons point here.
//
// Set VITE_APP_URL in your host's environment (or .env) to your real app URL.
// It is client-side, so it must be prefixed VITE_. Falls back to a clearly
// fake placeholder so the build stays valid before the URL is wired.
export const APP_URL =
  (import.meta.env.VITE_APP_URL as string | undefined)?.trim() ||
  'https://app.yourdomain.com'
