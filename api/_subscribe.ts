// Shared early-access capture handler. Runs on both the Vercel Edge runtime
// (api/subscribe.ts) and the Vite dev server (vite.config.ts middleware).
//
// Validates the email, throttles per IP, then routes the signup to whatever sink
// is configured:
//   - EARLY_ACCESS_WEBHOOK_URL set  -> POST the signup there (Zapier, Make, Slack,
//     Formspree, a serverless function, anything that accepts JSON). A failed
//     forward returns 502 so the client can show a retry.
//   - not set                       -> accept and log it server-side, so the page
//     works end to end with zero setup. Wire the env var to start persisting.

import { clientIp, rateLimit } from './_ratelimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_CHARS = 254 // RFC 5321 max length
const RATE_LIMIT = 5 // signups per IP per window
const RATE_WINDOW_SEC = 60

const json = (data: unknown, status: number, extra?: Record<string, string>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...extra },
  })

export async function handleSubscribe(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method' }, 405)

  const limit = await rateLimit(`subscribe:${clientIp(request)}`, {
    limit: RATE_LIMIT,
    windowSec: RATE_WINDOW_SEC,
  })
  if (!limit.ok) {
    const retry = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))
    return json({ error: 'rate_limited' }, 429, { 'retry-after': String(retry) })
  }

  let body: { email?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email || email.length > MAX_EMAIL_CHARS || !EMAIL_RE.test(email)) {
    return json({ error: 'invalid_email' }, 422)
  }

  const hook = process.env.EARLY_ACCESS_WEBHOOK_URL
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'landing',
          ts: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error(`webhook ${res.status}`)
    } catch (err) {
      // Log detail server-side only; never echo it to the browser.
      console.error('[bold] early-access webhook failed', err)
      return json({ error: 'forward_failed' }, 502)
    }
  } else {
    console.log('[bold] early-access signup (no webhook configured):', email)
  }

  return json({ ok: true }, 200)
}
