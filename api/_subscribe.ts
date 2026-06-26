// Shared early-access capture handler. Runs on both the Vercel Edge runtime
// (api/subscribe.ts) and the Vite dev server (vite.config.ts middleware).
//
// Validates the email, throttles per IP, then routes the signup to whichever
// sink is configured, in priority order:
//
//   1. RESEND_API_KEY set -> Resend. On each signup we, in parallel:
//        - add the contact to a Resend Audience      (the durable list)
//        - email EARLY_ACCESS_NOTIFY_EMAIL            (notify the founder)
//        - email the user a confirmation             ("you're on the list")
//      Required:  RESEND_API_KEY
//      Strongly recommended: RESEND_AUDIENCE_ID (the list), EARLY_ACCESS_NOTIFY_EMAIL
//      Optional:  EARLY_ACCESS_FROM_EMAIL (a verified sender; defaults to the
//                 Resend test address so it works before a domain is verified)
//      We return success when at least one sink succeeded, and 502 only when
//      every attempted sink failed, so a real outage shows the client a retry
//      but a duplicate signup or a single flaky email never locks a user out.
//
//   2. EARLY_ACCESS_WEBHOOK_URL set -> POST the signup there (Zapier, Make,
//      Slack, anything that accepts JSON). A failed forward returns 502.
//
//   3. neither set -> accept and log server-side, so the page works end to end
//      with zero setup. Wire RESEND_API_KEY to start capturing for real.

import { clientIp, rateLimit } from './_ratelimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_CHARS = 254 // RFC 5321 max length
const RATE_LIMIT = 5 // signups per IP per window
const RATE_WINDOW_SEC = 60

const RESEND_API = 'https://api.resend.com'

const json = (data: unknown, status: number, extra?: Record<string, string>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...extra },
  })

// ---- Resend helpers (never throw; they log and return ok) ------------------

async function resendEmail(opts: {
  key: string
  from: string
  to: string
  subject: string
  text: string
  html: string
  replyTo?: string
}): Promise<boolean> {
  try {
    const res = await fetch(`${RESEND_API}/emails`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${opts.key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: opts.from,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    })
    if (!res.ok) {
      console.error(
        '[bold] resend email failed',
        res.status,
        await res.text().catch(() => ''),
      )
      return false
    }
    return true
  } catch (err) {
    console.error('[bold] resend email error', err)
    return false
  }
}

async function resendAddContact(
  key: string,
  audienceId: string,
  email: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${RESEND_API}/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${key}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    )
    if (res.ok) return true
    // Already on the list is a success from the user's point of view.
    const txt = await res.text().catch(() => '')
    if (res.status === 409 || /already/i.test(txt)) return true
    console.error('[bold] resend add contact failed', res.status, txt)
    return false
  } catch (err) {
    console.error('[bold] resend add contact error', err)
    return false
  }
}

// ---- Email bodies (shipped copy: no em dashes) -----------------------------

// Escape user input before it goes into the HTML email, including quotes so it
// is safe inside an href attribute. The email passes a permissive regex, so it
// can contain HTML-significant characters.
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

function notifyBodies(email: string, ts: string) {
  const e = esc(email)
  const text = `New early-access signup.\n\nEmail: ${email}\nWhen:  ${ts}\nSource: landing page\n\nReply to this message to reach them directly.`
  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0a0a0a">
    <p style="margin:0 0 12px"><strong>New early-access signup.</strong></p>
    <p style="margin:0 0 4px">Email: <a href="mailto:${e}" style="color:#c77d0a">${e}</a></p>
    <p style="margin:0 0 4px">When: ${ts}</p>
    <p style="margin:0 0 12px">Source: landing page</p>
    <p style="margin:0;color:#555">Reply to this message to reach them directly.</p>
  </div>`
  return { text, html }
}

function confirmBodies() {
  const text = `You're on the list.

Thanks for joining the BoLD list. We'll email you the moment general access opens, and nothing in between that isn't worth your time.

The beta is already live, so if you don't want to wait, you can point BoLD at your own app with test accounts, for free, and see exactly what it catches.

BoLD is the runtime alarm that catches the access bug AI-built apps ship by default: the moment one real user can reach another user's data.

One email when it matters. No spam.

The BoLD team`
  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:0 auto;font-size:15px;line-height:1.65;color:#111">
    <div style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:2px;color:#c77d0a;margin-bottom:14px">BoLD &middot; ON THE LIST</div>
    <h1 style="font-size:22px;margin:0 0 14px;color:#0a0a0a">You're on the list.</h1>
    <p style="margin:0 0 14px">Thanks for joining the BoLD list. We'll email you the moment general access opens, and nothing in between that isn't worth your time.</p>
    <p style="margin:0 0 14px">The beta is already live, so if you don't want to wait, you can point BoLD at your own app with test accounts, for free, and see exactly what it catches.</p>
    <p style="margin:0 0 14px">BoLD is the runtime alarm that catches the access bug AI-built apps ship by default: the moment one real user can reach another user's data.</p>
    <p style="margin:0 0 20px;color:#555">One email when it matters. No spam.</p>
    <p style="margin:0;color:#0a0a0a">The BoLD team</p>
  </div>`
  return { text, html }
}

// ---- Handler ---------------------------------------------------------------

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

  const resendKey = process.env.RESEND_API_KEY

  // 1. Resend: durable list + founder notification + user confirmation.
  if (resendKey) {
    const from = process.env.EARLY_ACCESS_FROM_EMAIL || 'BoLD <onboarding@resend.dev>'
    const notifyTo = process.env.EARLY_ACCESS_NOTIFY_EMAIL
    const audienceId = process.env.RESEND_AUDIENCE_ID
    const ts = new Date().toISOString()

    const tasks: Promise<boolean>[] = []
    if (audienceId)
      tasks.push(resendAddContact(resendKey, audienceId, email))
    if (notifyTo) {
      const n = notifyBodies(email, ts)
      tasks.push(
        resendEmail({
          key: resendKey,
          from,
          to: notifyTo,
          replyTo: email,
          subject: `New early-access signup: ${email}`,
          text: n.text,
          html: n.html,
        }),
      )
    }
    const c = confirmBodies()
    tasks.push(
      resendEmail({
        key: resendKey,
        from,
        to: email,
        subject: "You're on the BoLD list",
        text: c.text,
        html: c.html,
      }),
    )

    if (!audienceId && !notifyTo) {
      console.warn(
        '[bold] RESEND_API_KEY set but no RESEND_AUDIENCE_ID or EARLY_ACCESS_NOTIFY_EMAIL: ' +
          'signups are confirmed to the user but not recorded for you.',
      )
    }

    const results = await Promise.all(tasks)
    if (!results.some(Boolean)) return json({ error: 'forward_failed' }, 502)
    return json({ ok: true }, 200)
  }

  // 2. Generic webhook (Zapier, Make, Slack, ...).
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
    return json({ ok: true }, 200)
  }

  // 3. Zero-setup fallback: accept and log so the page works end to end.
  console.log('[bold] early-access signup (no sink configured):', email)
  return json({ ok: true }, 200)
}
