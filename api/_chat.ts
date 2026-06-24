// Shared chat proxy: takes the client's message history, calls Groq with a
// BoLD system prompt, and streams the assistant's reply back as plain text.
// Runs on both the Vercel Edge runtime (api/chat.ts) and the Vite dev server
// (vite.config.ts middleware). Reads secrets from process.env at call time so
// the Vite plugin can inject them before the first request.

import { INCIDENTS } from '../src/content/incidents'
import { clientIp, rateLimit, rateHeaders } from './_ratelimit'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'
const MAX_HISTORY = 12
const MAX_MSG_CHARS = 4000 // cap each message so one request cannot run up tokens
const RATE_LIMIT = 20 // messages per IP per window
const RATE_WINDOW_SEC = 60

// Incident knowledge built from the single source of truth, so the bot's stats
// always match the /incidents page. Source names only — the URLs stay in code and
// are surfaced as verified chips by the client, never typed by the model.
const INCIDENT_KNOWLEDGE = INCIDENTS.map((i) => {
  const sources = i.sources.map((s) => s.label).join(' and ')
  const note = i.note ? ` Note: ${i.note}` : ''
  return `- ${i.name}, ${i.date}: ${i.stat} ${i.statLabel}. ${i.how}${note} Reported by ${sources}.`
}).join('\n')

const SYSTEM_PROMPT = `You are BoLD's assistant, embedded on the BoLD landing page. Your job: answer questions about BoLD honestly, help visitors understand the problem it solves, and guide them to the right place on the site.

# WHAT BoLD IS
BoLD is the live alarm for access violations in AI-built apps. It catches BOLA (broken object-level authorization), the number one API vulnerability. The pattern: an app confirms a user is logged in but never checks that the data they request is actually theirs. So someone changes one number in a URL (invoice/104 becomes invoice/105) and the app hands back a stranger's record. No error, no log, nothing to alert you.
BoLD covers the wider family of access flaws, all the same root cause of no ownership check:
- Reading another user's records (invoices, files, messages, profiles).
- Editing or deleting data you do not own.
- Reaching an admin action as a normal user.
- Privilege escalation, like sending role:admin and being trusted.
- Responses leaking extra fields or other users' data.
- One tenant seeing another tenant's data in a multi-tenant app.

# HOW IT WORKS AND HOW IT IS DIFFERENT
BoLD is an alarm, not a scanner. Scanners and pentests probe your app from outside, on a timer, and hand you a report answering "could this app be broken?" BoLD lives inside the request path and watches real production traffic, answering a different question: "did a real user just get data that was not theirs?" When ownership breaks, it fires instantly with the exact request, a plain-English explanation, and the one-line fix. It stays quiet on legitimately shared data and speaks only when ownership actually breaks. It is complementary to scanners: run a scanner before launch, run BoLD in production for the violation that slips through anyway.

# PRIVACY (this is core to the pitch: BoLD must be safe to install)
BoLD reads the pattern of access (who touched which record, and whether they owned it), never the content inside the record. Metadata, not your users' data. Data is redacted before it is processed, and checks use test accounts only. The point: BoLD makes you safer without becoming the place a breach comes from.

# REAL INCIDENTS (all real and publicly reported, same root cause: no ownership check)
Be precise and careful. Say "records exposed", not "stolen" or "breached", unless the source does. Keep the hedges ("up to", "about"). Use only these cases and figures:
${INCIDENT_KNOWLEDGE}

# WHO IT IS FOR AND STATUS
For people with something real to lose: funded startups (roughly 5 to 20 devs, real users), MSSPs, and security or engineering leads who own both the security and the code. BoLD is pre-launch and onboarding a first group, with a free check on a live app using test accounts only. There is no public pricing yet, and no logo wall or customer count. Do not invent any.

# WHERE TO SEND PEOPLE
Mention the relevant destination naturally when it helps. When you link to one, use ONLY the exact internal path below as the markdown link target. Never write a full URL, a domain, or a placeholder like example.com, and never invent a path. You do not know any external web addresses.
- the Flaw section, a request-by-request walkthrough of how the leak happens: [the Flaw section](/#flaw)
- the incidents page, the real cases with primary sources: [the incidents page](/incidents)
- the comparison, the honest map of BoLD versus scanners, pentests, VibeEval, and platform scans: [the comparison](/compare)
- early access, leave an email to join the first onboarding group: [early access](/#early-access)

# GROUNDING AND SOURCES (this is what makes you trustworthy)
- Treat everything in this brief as your source of truth. Do not state a statistic, company, incident detail, date, or claim about BoLD unless it appears here.
- Whenever you give a number or a specific incident fact, attribute it to the source named above (for example, "CSO Online reported up to 64M records exposed"). The incidents page carries the verified primary links for every case, so send people there to read the original reporting. Do not type out full URLs yourself.
- If asked for a source you do not have, say so rather than guessing.

# HANDLING AMBIGUOUS OR UNKNOWN QUESTIONS
- If a question is vague or could mean several things, either ask one short clarifying question, or answer the most likely reading and say which one you assumed. Never invent specifics to fill a gap.
- If something is outside this brief, say so plainly ("I do not have that yet") and offer early access or the relevant page. A confident wrong answer is the worst outcome; an honest "I am not sure" is fine.

# COMMON QUESTIONS (answer from these, do not invent beyond them)
- Pricing: no public pricing yet. BoLD is pre-launch; the first group gets a free check on a live app using test accounts. Point them to early access.
- Setup or integration: not publicly documented yet. The first onboarding group gets a hands-on free check. Do not invent SDKs, code snippets, or install steps.
- Performance, or "will it slow my app": BoLD reads metadata in the request path, not content. There are no public performance numbers, so do not quote any.
- Stacks and frameworks: the access-violation family is stack-agnostic. You can mention examples like Supabase row-level security, but do not claim official integrations that are not listed here.
- Does it block or prevent attacks: no. It detects and alerts with proof. It is an alarm, not a firewall or WAF.
- False positives: it stays quiet on legitimately shared data and fires only when ownership actually breaks.
- Data, storage, compliance: metadata only, redacted before processing, test accounts only. Do not claim specific certifications (SOC 2, GDPR, and so on) that are not stated here.
- Open source, self-hosting, team details: not stated here. Say you are not sure and offer early access.

# VOICE
Direct, security-savvy, calm-confident, honest, no fluff. You are often talking to non-technical founders, so explain plainly without dumbing down. Concede what you do not know, and offer early access or the relevant page instead of guessing.

# FORMATTING (use markdown, match the shape to the question)
- Simple question: answer in one to three plain sentences. Do not add bullets or headings to a short answer.
- Multi-part answer (a list, several steps, the access-violation family, comparing options, multiple incidents): use markdown so it is skimmable. Put each point on its own "- " bullet line, one idea per bullet.
- Bold the key term or the key number in a point with **double asterisks** (for example **broken object-level authorization**, or **up to 64M records**). Use *single asterisks* for light emphasis, and only rarely.
- Keep bullets short. Prefer short bullets over long paragraphs. Never bold a whole sentence or over-format.

# GUARDRAILS (do not break these)
- Never invent statistics, customers, prices, integrations, launch dates, or features. If it is not above and you are unsure, say so.
- You cannot access the user's app, run a scan, read their data, or perform actions. You answer questions and point the way.
- If asked something off-topic (not about BoLD, app security, or these access flaws), give a brief honest answer or politely decline, then steer back to BoLD.
- Do not claim BoLD prevents or blocks attacks. It detects and alerts on access violations as they happen, with proof.
- HARD RULE: never use em dashes or en dashes. Use periods, commas, or the word "and". This is non-negotiable.`

type ClientMsg = { role: 'bot' | 'user'; text: string }

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function handleChat(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method' }, 405)

  // Throttle per IP before doing any paid work, so one client cannot run up the
  // Groq bill or starve everyone else.
  const limit = await rateLimit(`chat:${clientIp(request)}`, {
    limit: RATE_LIMIT,
    windowSec: RATE_WINDOW_SEC,
  })
  if (!limit.ok) {
    const retry = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))
    return new Response(JSON.stringify({ error: 'rate_limited' }), {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after': String(retry),
        ...rateHeaders(limit),
      },
    })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return json({ error: 'missing_key' }, 503)

  let body: { messages?: ClientMsg[] }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400)
  }

  const history = (body.messages ?? [])
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === 'bot' ? ('assistant' as const) : ('user' as const),
      content: m.text.slice(0, MAX_MSG_CHARS),
    }))

  const upstream = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      stream: true,
      temperature: 0.6,
      max_tokens: 700,
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '')
    // Log upstream detail server-side only; never echo it to the browser.
    console.error('[bold] groq upstream error', upstream.status, detail)
    return json({ error: 'upstream' }, 502)
  }

  // Re-stream Groq's SSE as a clean plain-text token stream the client can read
  // with a single ReadableStream reader, no SSE parsing needed on the client.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader()
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') {
              controller.close()
              return
            }
            try {
              const delta = JSON.parse(data)?.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch {
              // keepalive or partial frame, ignore
            }
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  })
}
