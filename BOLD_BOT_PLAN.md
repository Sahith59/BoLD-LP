# BoLD Bot — Plan & Context

_Living document. Current direction: a **chat assistant** (not a 3D character)._

## Decision log (so we don't loop)
- Build-from-primitives 3D bot → FAILED (looked like a blob). Abandoned.
- Nano Banana recreated the exact creature → cleaned → 2D PNG companion. Worked, but a flat PNG is a static "sticker": no articulation, no live refraction.
- Live 3D model (image-to-3D → R3F glass) → **dropped**: too GPU / infra heavy.
- 2D obsidian creature as the chat's face → **dropped entirely** (2026-06-18): a static PNG can't articulate or refract, and it kept pulling effort away from real development. Removed from the page.
- **CURRENT:** no character. The **amber liquid-glass ring itself is the projector**: click it, it lays flat (~72° tilt) into a glowing lens, and the chat window projects up out of it on an amber beam.

## The creature (removed 2026-06-18)
Dropped from the page entirely. A static PNG could not articulate or refract and kept pulling effort away from real development. The ring is the projector now.
- `public/bot/bold-bot.png` — obsidian glass cutout, kept on disk but no longer mounted.
- `public/bot/refs/*` — angle crops (no longer needed; from the 3D detour).
- Source refs: `BoLD creature main.png`, `BoLD_creature_multiple angles.png`.

---

# BoLD Chatbot — the plan

A chat assistant that answers questions about the BoLD product and helps users
navigate the site. Backend brain = **Groq API**. Approach: **build the whole
design/UX first, then "train"** (curate its knowledge).

## Interaction states
1. **Collapsed (idle):** an **amber glowing ring** pinned bottom-right (the
   brand 'o' / alarm), rendered in the site's **liquid-glass** theme — a glass
   ring band that **refracts the background** (`glass-soft` + `#liquid-glass`
   filter, bevel + specular), **floating** (gentle bob + slow drift) and softly
   pulsing. This is the trigger. Hover hint: "Ask BoLD". Real `<button>`,
   keyboard-focusable, aria-label.
2. **Click → Lay flat:** the ring **tilts back ~72 degrees** on its X axis (with
   perspective) and foreshortens into a flat glowing **amber lens** at the base.
   Its glow ramps up because it is now emitting. The thing you clicked becomes the
   projector.
3. **Project:** an **amber light beam** rises out of the lens aperture (narrow at
   the ring, widening up), and the **chat panel materializes out of the top of the
   beam** (scales + un-tilts from a transform-origin down at the lens, slight 3D
   perspective). The beam is bright on open, then dims to a faint connector so the
   chat stays readable. This is the signature moment.
4. **Open (chat):** glass chat window — header (BoLD + live status dot), message
   list (user right / bot left), input + send. Amber accents. Bot replies
   **stream in** (typewriter).
5. **Close:** collapses back into the ring (reverse animation).

## Visual design (consistent with the site)
- Ring trigger: ~60px **liquid-glass ring** — amber glow + a glass band that
  refracts the background (`glass-soft` + `#liquid-glass` bevel/specular, same
  caveat as the cards: full SVG refraction where the engine supports it,
  blur/glass everywhere). **Floating** (gentle bob + slow drift) and pulsing;
  bottom-right with safe-area margin; z above content, below true modals. Touch
  target >= 44px.
- Creature: obsidian PNG, ~150-180px, anchored bottom-right.
- Chat panel: `glass-panel` styling, ~360 x 480, projects up-left from the head.
  Mobile: **bottom sheet**, near full-width; creature smaller or hidden.
- Amber used only for: the ring, bot accents, send button, the projection beam.
- Respect `prefers-reduced-motion` (simple fades, no big spring/projection).

## Animation (framer-motion)
- Idle ring pulse.
- `AnimatePresence` summon: creature spring (y/scale/opacity); ring -> eye morph.
- Panel projection: `scale` from head origin + `rotateX` perspective + beam fade.
- Messages: staggered entrance; bot text streams from Groq tokens.
- Interruptible / no input-blocking; exit faster than enter.

## Architecture
- **Frontend:** `BoldChat` component, state machine
  (`collapsed | summoning | open | closing`), framer-motion, reuses the obsidian
  PNG. Self-contained; mounted in the App shell (all routes, or landing first).
- **Backend (Groq):** the Groq key must be **server-side, never in the
  frontend**. So a tiny **serverless proxy** (e.g., a Vercel function
  `/api/chat`) that: holds `GROQ_API_KEY` (env var), forwards messages to Groq
  (Llama model), and **streams** the response back. Frontend calls `/api/chat`.
- **"Training" = curated knowledge**, not fine-tuning. A strong **system
  prompt** built from the BoLD content we already wrote (the flaw / BOLA, the
  incidents + sources, alarm-vs-scanner, the honest comparison, the ask) +
  product facts + voice. Optional later: light retrieval over the docs.
- **Bot scope (LOCKED):** product Q&A + **navigation actions** (route / scroll
  the user to The Flaw, Incidents, Compare, Get Access) + **early-access
  capture** (collect email when the user is interested).
- **Voice:** BoLD's tone — direct, security-savvy, calm-confident, no fluff,
  honest (concede what it doesn't know). No em dashes.

## Build phases (design first, then train)
- **Phase A — UI + animation (NO backend, free):** ring -> summon -> projected
  chat window -> full chat UI, wired to a **stubbed responder** (canned replies)
  so the whole interaction is real and tunable. Nail the choreography.
- **Phase B — Groq wiring:** serverless `/api/chat` proxy + streaming; swap the
  stub for real calls. Needs **your Groq API key** (env var) + a hosting
  decision (Vercel recommended).
- **Phase C — Knowledge ("training"):** curate the system prompt / context from
  the BoLD content; add navigation actions; tune the voice and guardrails
  (refuse off-topic, stay honest, no hallucinated stats).
- **Phase D — Guardrails:** error/empty/loading states, rate limiting, mobile
  bottom-sheet, full a11y, reduced-motion.

## Resolved (locked)
1. **Scope:** Q&A + navigation actions + early-access capture.
2. **Groq hosting:** decide at Phase B. Build Phase A now with a **stubbed
   responder** (no backend needed yet); key stays server-side when wired.
3. **Voice:** direct, security-savvy, calm-confident, honest, no fluff, no em dashes.

## Status
- [x] Direction set: chat assistant, **ring-as-projector** (no character), Groq brain
- [x] Plan written
- [x] Phase A — `BoldChat.tsx`: hollow amber liquid-glass ring (masked donut, live
      `#bold-ring-glass` refraction + drifting specular) that lays flat into a lens
      and projects the chat window up on an amber beam -> full chat UI + stub
      responder + nav chips. Creature removed. Mounted globally in the App shell.
      (projection geometry needs visual tuning)
- [x] Phase B — Groq serverless proxy + streaming. `/api/chat` shared handler:
      Vercel Edge (`api/chat.ts`) + Vite dev middleware (`vite.config.ts`); token
      streaming (SSE re-emitted as plain text); key server-side, `.env` overrides
      ambient; stub fallback when no key; per-message cap; upstream errors logged
      server-side, never echoed to the client. Chat scroll = its own Lenis.
- [x] Phase C — BoLD knowledge / system prompt. Curated knowledge in
      `api/_chat.ts`: the flaw + access family, how it works vs scanners, privacy,
      careful incident framing (records exposed, disputes kept), who it is for,
      where to send people. Voice + guardrails: no invented stats/prices/dates,
      off-topic refusal, concede uncertainty, no em dashes. Client strips em/en
      dashes as a backstop; nav chips cover flaw / incidents / compare /
      early-access (up to two, deterministic).
- [ ] Phase D — guardrails: error/empty/loading states, rate limiting, mobile
      bottom-sheet, full a11y, reduced-motion.
