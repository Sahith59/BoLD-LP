import { useEffect } from 'react'

// Privacy-friendly, cookieless analytics. Injects the Cloudflare Web Analytics
// beacon only when VITE_CF_ANALYTICS_TOKEN is set, so it is a no-op until you
// add the token from your Cloudflare dashboard. SPA mode tracks route changes.
const CF_TOKEN = import.meta.env.VITE_CF_ANALYTICS_TOKEN as string | undefined

export function Analytics() {
  useEffect(() => {
    if (!CF_TOKEN) return
    if (document.querySelector('script[data-cf-beacon]')) return
    const s = document.createElement('script')
    s.defer = true
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_TOKEN, spa: true }))
    document.head.appendChild(s)
  }, [])
  return null
}
