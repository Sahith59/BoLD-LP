// Dependency-free fixed-window rate limiter shared by the API handlers.
//
// Two backends, chosen at call time:
//   - Upstash Redis REST, used automatically when UPSTASH_REDIS_REST_URL and
//     UPSTASH_REDIS_REST_TOKEN are set. This is durable and correct across the
//     many isolated instances Vercel Edge spins up, so it is the production path.
//   - In-memory Map fallback otherwise. Correct in local dev and for a single
//     instance; best-effort across a fleet (each instance counts on its own).
//     This keeps the limiter working with zero setup and zero dependencies.
//
// Fail-open by design: if the Upstash call errors, we allow the request rather
// than lock real users out because a side service blipped.

export type RateResult = {
  ok: boolean
  limit: number
  remaining: number
  /** epoch ms when the current window resets */
  reset: number
}

export type RateOptions = { limit: number; windowSec: number }

/** Best-effort client identifier from proxy headers. */
export function clientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'anon'
}

type Bucket = { count: number; reset: number }

// Survives module reloads in dev (Vite re-imports) by hanging off globalThis.
const mem: Map<string, Bucket> = ((globalThis as Record<string, unknown>)
  .__boldRateStore as Map<string, Bucket>) ?? new Map()
;(globalThis as Record<string, unknown>).__boldRateStore = mem

function memLimit(key: string, opts: RateOptions): RateResult {
  const now = Date.now()
  const windowMs = opts.windowSec * 1000
  const reset = Math.floor(now / windowMs) * windowMs + windowMs
  const bucket = mem.get(key)

  // Occasionally sweep expired buckets so the map cannot grow unbounded.
  if (mem.size > 500 && Math.random() < 0.02) {
    for (const [k, b] of mem) if (b.reset <= now) mem.delete(k)
  }

  if (!bucket || bucket.reset <= now) {
    mem.set(key, { count: 1, reset })
    return { ok: true, limit: opts.limit, remaining: opts.limit - 1, reset }
  }
  bucket.count += 1
  const remaining = Math.max(0, opts.limit - bucket.count)
  return {
    ok: bucket.count <= opts.limit,
    limit: opts.limit,
    remaining,
    reset: bucket.reset,
  }
}

async function upstashLimit(
  url: string,
  token: string,
  key: string,
  opts: RateOptions,
): Promise<RateResult> {
  const now = Date.now()
  const windowMs = opts.windowSec * 1000
  const reset = Math.floor(now / windowMs) * windowMs + windowMs
  const redisKey = `bold:rl:${key}:${reset}`

  // One round trip: increment the window counter and (re)set its TTL.
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', redisKey],
      ['PEXPIRE', redisKey, windowMs],
    ]),
  })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  const data = (await res.json()) as { result: number }[]
  const count = Number(data?.[0]?.result ?? 0)
  return {
    ok: count <= opts.limit,
    limit: opts.limit,
    remaining: Math.max(0, opts.limit - count),
    reset,
  }
}

export async function rateLimit(
  key: string,
  opts: RateOptions,
): Promise<RateResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    try {
      return await upstashLimit(url, token, key, opts)
    } catch (err) {
      // Side service blipped: fail open, but record it server-side.
      console.error('[bold] rate limit upstash error, allowing', err)
      return { ok: true, limit: opts.limit, remaining: opts.limit, reset: Date.now() }
    }
  }
  return memLimit(key, opts)
}

/** Standard rate-limit response headers for a result. */
export function rateHeaders(r: RateResult): Record<string, string> {
  return {
    'x-ratelimit-limit': String(r.limit),
    'x-ratelimit-remaining': String(r.remaining),
    'x-ratelimit-reset': String(Math.ceil(r.reset / 1000)),
  }
}
