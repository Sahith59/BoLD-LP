// Shared contact-form handler. Runs on both the Vercel Edge runtime
// (api/contact.ts) and the Vite dev server (vite.config.ts middleware).
//
// Validates the message, throttles per IP, then emails it to you via Resend
// with reply-to set to the sender, so you can reply straight from your inbox.
//   - RESEND_API_KEY set -> send to CONTACT_NOTIFY_EMAIL (or, if unset,
//     EARLY_ACCESS_NOTIFY_EMAIL), from EARLY_ACCESS_FROM_EMAIL.
//   - not set            -> accept and log server-side, so the form works with
//     zero setup until Resend is wired.

import { clientIp, rateLimit } from './_ratelimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL = 254
const MAX_NAME = 100
const MAX_MESSAGE = 5000
const RATE_LIMIT = 4 // messages per IP per window
const RATE_WINDOW_SEC = 300

const RESEND_API = 'https://api.resend.com'

const json = (data: unknown, status: number, extra?: Record<string, string>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...extra },
  })

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export async function handleContact(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method' }, 405)

  const limit = await rateLimit(`contact:${clientIp(request)}`, {
    limit: RATE_LIMIT,
    windowSec: RATE_WINDOW_SEC,
  })
  if (!limit.ok) {
    const retry = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))
    return json({ error: 'rate_limited' }, 429, { 'retry-after': String(retry) })
  }

  let body: { name?: unknown; email?: unknown; message?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400)
  }

  const name =
    typeof body.name === 'string' ? body.name.trim().slice(0, MAX_NAME) : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message =
    typeof body.message === 'string' ? body.message.trim() : ''

  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return json({ error: 'invalid_email' }, 422)
  }
  if (!message || message.length > MAX_MESSAGE) {
    return json({ error: 'invalid_message' }, 422)
  }

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const from =
      process.env.EARLY_ACCESS_FROM_EMAIL || 'BoLD <onboarding@resend.dev>'
    const to =
      process.env.CONTACT_NOTIFY_EMAIL || process.env.EARLY_ACCESS_NOTIFY_EMAIL
    if (!to) {
      console.warn(
        '[bold] contact: RESEND_API_KEY set but no CONTACT_NOTIFY_EMAIL or EARLY_ACCESS_NOTIFY_EMAIL; logging only.',
      )
      console.log('[bold] contact message (no recipient configured):', {
        name,
        email,
        message,
      })
      return json({ ok: true }, 200)
    }
    const who = name ? `${name} (${email})` : email
    const text = `New message via the BoLD contact form.\n\nFrom: ${who}\n\n${message}`
    const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0a0a0a">
      <p style="margin:0 0 12px"><strong>New message via the BoLD contact form.</strong></p>
      <p style="margin:0 0 4px">From: ${esc(who)}</p>
      <p style="margin:14px 0 0;white-space:pre-wrap">${esc(message)}</p>
    </div>`
    try {
      const res = await fetch(`${RESEND_API}/emails`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${resendKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          reply_to: email,
          subject: `Contact form: ${name || email}`,
          text,
          html,
        }),
      })
      if (!res.ok) {
        console.error(
          '[bold] contact resend failed',
          res.status,
          await res.text().catch(() => ''),
        )
        return json({ error: 'forward_failed' }, 502)
      }
    } catch (err) {
      console.error('[bold] contact resend error', err)
      return json({ error: 'forward_failed' }, 502)
    }
    return json({ ok: true }, 200)
  }

  // Zero-setup fallback: accept and log.
  console.log('[bold] contact message (no sink configured):', {
    name,
    email,
    message,
  })
  return json({ ok: true }, 200)
}
