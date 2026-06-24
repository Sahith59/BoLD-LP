# BoLD

The live alarm for access violations in AI-built apps. BoLD catches BOLA (broken
object-level authorization) and the wider family of access flaws by sitting in the
request path and firing the moment a real user reaches data that isn't theirs.

This repo is the marketing site: a single-page React app with a 3D glass hero, a
liquid-glass design system, and an in-page assistant that answers questions about
the product, grounded in real, sourced incidents.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Three.js / React Three Fiber for the 3D wordmark
- Motion for animation, Lenis for smooth scroll
- Groq for the chat assistant, proxied server-side

## Run it

```bash
npm install
cp .env.example .env   # add your GROQ_API_KEY
npm run dev
```

The chat still works without a key, it falls back to canned answers.

## Environment

All secrets are server-side only and never reach the browser. The dev server
(`vite.config.ts`) mounts the same handlers the Vercel Edge functions use, so the
API behaves identically in dev and production. The browser only ever calls
`/api/chat` and `/api/subscribe`.

- `GROQ_API_KEY` — the chat assistant. Without it, the chat falls back to canned
  answers.
- `EARLY_ACCESS_WEBHOOK_URL` — optional. Where early-access signups are POSTed.
  If unset, signups are validated and accepted but only logged server-side.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — optional. Enable durable,
  distributed rate limiting on the API routes. Recommended before a public deploy.
  Without them, an in-memory limiter is used (correct in dev and per-instance).

Both API routes are rate limited per IP: chat at 20 requests/minute, signups at
5/minute, returning `429` with `Retry-After`.

## Build

```bash
npm run build
```
