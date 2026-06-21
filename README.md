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

- `GROQ_API_KEY` is server-side only and never reaches the browser. The dev server
  (`vite.config.ts`) and the Vercel Edge function (`api/chat.ts`) read it; the
  browser only ever calls `/api/chat`.

## Build

```bash
npm run build
```
