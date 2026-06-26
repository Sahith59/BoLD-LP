// Single source of truth for the live product entry point (the sign-in /
// sign-up page of the real app). The "Try the beta" buttons point here.
//
// Set VITE_APP_URL in your host's environment (or .env) to your real app URL.
// It is client-side, so it must be prefixed VITE_. Falls back to a clearly
// fake placeholder so the build stays valid before the URL is wired.
export const APP_URL =
  (import.meta.env.VITE_APP_URL as string | undefined)?.trim() ||
  'https://app.yourdomain.com'

/**
 * The app entry URL tagged so signups can be attributed to the landing page,
 * and to which CTA drove the click. `placement` is the spot the button lives
 * (hero, nav, menu, final_cta), surfaced as utm_content in your analytics.
 */
export function appUrl(placement: string): string {
  const params = new URLSearchParams({
    ref: 'landing',
    utm_source: 'landing',
    utm_medium: 'cta',
    utm_content: placement,
  })
  const sep = APP_URL.includes('?') ? '&' : '?'
  return `${APP_URL}${sep}${params.toString()}`
}
