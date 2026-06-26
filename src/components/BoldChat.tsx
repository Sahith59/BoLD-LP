'use client'

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, X } from 'lucide-react'
import Lenis from 'lenis'
import { INCIDENTS } from '@/content/incidents'
import { RichText } from '@/components/ui/rich-text'

type Action = { label: string; to?: string; send?: string }
type Source = { label: string; url: string }
type Msg = {
  id: string
  role: 'bot' | 'user'
  text: string
  actions?: Action[]
  sources?: Source[]
  error?: boolean
}

const QUICK: Action[] = [
  { label: 'What is BOLA?', send: 'What is BOLA?' },
  { label: 'Real incidents', to: '/incidents' },
  { label: 'How is BoLD different?', to: '/compare' },
  { label: 'Get early access', to: '/#early-access' },
]

const GREETING_TEXT =
  "I'm BoLD, runtime assurance for AI-coded apps. I catch live access failures in production, starting with broken authorization and ownership. Ask me anything, or jump somewhere:"

// ── Flight knobs (tune here) ──────────────────────────────────────────────
const RING = 64 // idle ring box, px
const GROWN = 224 // diameter at center (larger peak)
const CORNER_MARGIN = 20 // matches bottom-5 / right-5
const BAND_THIN = 73 // band inner edge % when small (thicker idle rim)
const BAND_THICK = 72 // band inner edge % when grown (larger ring, thinner band)
const FLAT_DEG = 72 // lay-flat tilt angle
const BOTTOM_GAP = 120 // laid-flat ring center, px above the viewport bottom (sits lower)
const WINDOW_BOTTOM = 320 // chat window bottom offset, px (wide gap for the beam)

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Strip em/en dashes from model output so the brand's hard no-dash rule always
 *  holds, even if the model ignores the system prompt. Run on the full string. */
const stripDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ', ')

// Maps an incident to text that names it, so we can attach its verified sources.
const INCIDENT_MATCHERS: { id: string; re: RegExp }[] = [
  { id: 'mcdonalds', re: /mcdonald|mchire|paradox/ },
  { id: 'intel', re: /\bintel\b/ },
  { id: 'lovable', re: /lovable/ },
  { id: 'tea', re: /\btea\b/ },
  { id: 'moltbook', re: /moltbook/ },
  { id: 'first-american', re: /first american/ },
  { id: 'usps', re: /usps|postal service|informed visibility/ },
  { id: 'peloton', re: /peloton/ },
  { id: 'github', re: /\bgithub\b|homakov/ },
]

/** Verified source links for whichever incidents the reply itself discusses. The
 *  URLs come from our data, never the model, so they are always real and correct.
 *  One source per incident when several are named, all sources for a single one. */
function responseSources(text: string): { label: string; url: string }[] {
  const t = text.toLowerCase()
  const incs = INCIDENT_MATCHERS.filter((m) => m.re.test(t)).map(
    (m) => INCIDENTS.find((i) => i.id === m.id)!,
  )
  const multi = incs.length > 1
  const seen = new Set<string>()
  const out: { label: string; url: string }[] = []
  for (const inc of incs) {
    for (const s of multi ? inc.sources.slice(0, 1) : inc.sources) {
      if (!seen.has(s.url)) {
        seen.add(s.url)
        out.push(s)
      }
    }
  }
  return out.slice(0, 5)
}

/** Contextual nav chips appended under a reply, keyed off the question. Up to two,
 *  most-relevant first. Deterministic, so there is no token cost or mid-stream flash. */
function suggestActions(text: string): Action[] | undefined {
  const t = text.toLowerCase()
  const picks: Action[] = []
  const add = (a: Action) => {
    if (picks.length < 2 && !picks.some((p) => p.label === a.label)) picks.push(a)
  }
  if (/bola|flaw|object|ownership|idor|invoice|request path|leak|how.*(work|catch)/.test(t))
    add({ label: 'See the flaw', to: '/#flaw' })
  if (/incident|breach|real|happen|case|proof|example|receipt|source|mcdonald|intel|lovable|tea|moltbook/.test(t))
    add({ label: 'See the incidents', to: '/incidents' })
  if (/compare|differ|vibeeval|scanner|competitor|\bvs\b|versus|alternative|pentest|better/.test(t))
    add({ label: 'How BoLD compares', to: '/compare' })
  if (/access|sign|wait ?list|demo|try|start|join|email|onboard|price|cost|buy|\bfree\b/.test(t))
    add({ label: 'Get early access', to: '/#early-access' })
  return picks.length ? picks : undefined
}

/** Fallback responder used when the Groq proxy is unreachable or has no key. */
function stubReply(text: string): { text: string; actions?: Action[] } {
  const t = text.toLowerCase()
  if (/bola|flaw|object|ownership|idor|invoice/.test(t))
    return {
      text: 'BOLA, broken object-level authorization, is the number one API vulnerability: your app checks that someone is logged in, but never that the data is theirs. Change one ID in a URL and you read a stranger’s record. BoLD watches the live request and fires the instant it happens, with proof.',
      actions: [{ label: 'See the flaw', to: '/#flaw' }],
    }
  if (/incident|breach|real|happen|mcdonald|intel|lovable|tea|moltbook|example|receipt/.test(t))
    return {
      text: "It’s already happening. McDonald’s hiring AI exposed up to 64M records, Intel ~270K, plus Lovable, Tea and Moltbook — same root cause every time: no ownership check. I keep the receipts, with sources.",
      actions: [{ label: 'See the incidents', to: '/incidents' }],
    }
  if (/compare|different|vibeeval|scanner|competitor|\bvs\b|alternative|pentest/.test(t))
    return {
      text: 'Most tools scan or probe your app and hand you a report. BoLD does one thing none of them do: it watches real production traffic and judges whether a real user just touched data they don’t own. Here is the honest map.',
      actions: [{ label: 'See the comparison', to: '/compare' }],
    }
  if (/access|sign|waitlist|demo|try|start|join|email|onboard/.test(t))
    return {
      text: 'I can get you on the early-access list. We’re onboarding a first group of funded startups and MSSPs, test accounts only.',
      actions: [{ label: 'Get early access', to: '/#early-access' }],
    }
  if (/^(hi|hey|hello|yo|who|what are you|help)/.test(t))
    return { text: GREETING_TEXT, actions: QUICK }
  return {
    text: "I’m in preview right now, so full answers arrive once I’m wired to the model. Meanwhile I can explain the flaw, show real incidents, compare BoLD to other tools, or get you early access.",
    actions: QUICK,
  }
}

export function BoldChat() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<
    'idle' | 'flying' | 'flat' | 'dropping' | 'open'
  >('idle')
  const open = phase === 'open'
  const [vp, setVp] = useState({ w: 0, h: 0 })
  // Below the sm breakpoint the desktop fly-to-center choreography has no room
  // (the projected window would overflow the top of a phone), so the chat opens
  // as a bottom sheet instead.
  const mobile = vp.w > 0 && vp.w < 640

  const [messages, setMessages] = useState<Msg[]>([
    { id: 'greet', role: 'bot', text: GREETING_TEXT, actions: QUICK },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pending, setPending] = useState(false)

  const scrollWrapRef = useRef<HTMLDivElement>(null)
  const scrollContentRef = useRef<HTMLDivElement>(null)
  const chatLenisRef = useRef<Lenis | null>(null)
  const forcePinRef = useRef(false)
  const idRef = useRef(1)

  // a11y + request lifecycle
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastUserRef = useRef('')

  // prog: corner O -> grown center torus.  tilt: 0 upright -> 1 laid flat.
  // drop: 0 at center -> 1 resting flat at the bottom of the screen.
  const prog = useMotionValue(0)
  const tilt = useMotionValue(0)
  const drop = useMotionValue(0)

  const x = useTransform(prog, (p) => {
    const w = lerp(RING, GROWN, p)
    return lerp(vp.w - CORNER_MARGIN - RING, vp.w / 2 - w / 2, p)
  })
  const y = useTransform([prog, drop], ([p, d]: number[]) => {
    const h = lerp(RING, GROWN, p)
    const flyY = lerp(vp.h - CORNER_MARGIN - RING, vp.h / 2 - h / 2, p)
    const bottomY = vp.h - BOTTOM_GAP - h / 2
    return lerp(flyY, bottomY, d)
  })
  const size = useTransform(prog, (p) => lerp(RING, GROWN, p))
  const bandInner = useTransform(prog, (p) => lerp(BAND_THIN, BAND_THICK, p))
  const tiltDeg = useTransform(tilt, [0, 1], [0, FLAT_DEG])

  // faux-3D tube: wall layers spread downward + fade in as the ring lays flat,
  // giving the laid ring real rounded glass-tube thickness (depth scales with size)
  const depthPx = useTransform([tilt, prog], ([t, p]: number[]) => t * lerp(6, 24, p))
  const w1 = useTransform(depthPx, (d) => d * 0.34)
  const w2 = useTransform(depthPx, (d) => d * 0.67)
  const w3 = useTransform(depthPx, (d) => d)
  const wallOpacity = useTransform(tilt, [0, 0.5, 1], [0, 0.5, 1])

  // Band mask + amber body morph with thickness, so the glass profile is kept
  // (and thickens) at every size instead of just being scaled up.
  const maskBg = useMotionTemplate`radial-gradient(circle closest-side at 50% 50%, transparent 0 calc(${bandInner}% - 4%), #000 ${bandInner}% 100%)`
  const bandBg = useMotionTemplate`linear-gradient(135deg, rgba(255,232,194,0.26), rgba(255,232,194,0) 30%, rgba(0,0,0,0) 62%, rgba(30,16,2,0.4)), radial-gradient(circle closest-side at 50% 50%, transparent calc(${bandInner}% - 3%), rgba(255,216,154,0.76) calc(${bandInner}% + 0.5%), rgba(214,150,70,0.16) calc(${bandInner}% + 7%), rgba(199,125,10,0.1) 80%, rgba(58,33,6,0.36) 90%, rgba(214,150,70,0.14) 95%, rgba(255,216,154,0.82) 99%, rgba(255,216,154,0) 100%)`

  // edge-weighted mask: reflections live on the inner + outer rims (Fresnel)
  const reflMask = useMotionTemplate`radial-gradient(circle closest-side at 50% 50%, transparent calc(${bandInner}% - 2%), #000 calc(${bandInner}% + 1.5%), transparent calc(${bandInner}% + 9%), transparent 92%, #000 98%, transparent 100%)`

  useEffect(() => {
    const u = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    u()
    window.addEventListener('resize', u)
    return () => window.removeEventListener('resize', u)
  }, [])

  // Dedicated smooth scroll for the chat history: the same Lenis momentum as the
  // page, but isolated. data-lenis-prevent on the viewport stops the page Lenis
  // from handling the wheel while the cursor is inside the chat; Lenis excludes
  // its own wrapper from that check, so this inner instance still scrolls.
  useEffect(() => {
    if (!open || reduce) return
    const wrapper = scrollWrapRef.current
    const content = scrollContentRef.current
    if (!wrapper || !content) return
    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.12,
      wheelMultiplier: 1,
      autoRaf: true,
    })
    chatLenisRef.current = lenis
    return () => {
      lenis.destroy()
      chatLenisRef.current = null
    }
  }, [open, reduce])

  // Pin to the latest message when the chat opens.
  useEffect(() => {
    if (!open) return
    const wrapper = scrollWrapRef.current
    if (!wrapper) return
    const id = requestAnimationFrame(() => {
      const lenis = chatLenisRef.current
      if (lenis) {
        lenis.resize()
        lenis.scrollTo(wrapper.scrollHeight, { immediate: true, force: true })
      } else {
        wrapper.scrollTop = wrapper.scrollHeight
      }
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  // Keep the newest content in view. When the user just sent a prompt we always
  // jump (forcePin); during passive streaming we follow only if they have not
  // scrolled up. resize() first so Lenis recomputes its limit for the content we
  // just appended — its ResizeObserver is async and would otherwise clamp short.
  useEffect(() => {
    const wrapper = scrollWrapRef.current
    if (!wrapper) return
    const force = forcePinRef.current
    forcePinRef.current = false
    if (!force) {
      const dist = wrapper.scrollHeight - wrapper.scrollTop - wrapper.clientHeight
      if (dist > 160) return
    }
    const lenis = chatLenisRef.current
    if (lenis) {
      lenis.resize()
      lenis.scrollTo(wrapper.scrollHeight, { immediate: true, force: true })
    } else {
      wrapper.scrollTop = wrapper.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeChat()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Move focus into the chat when it opens so keyboard + screen-reader users
  // land on the input, not back at the top of the page.
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  async function openChat() {
    if (phase !== 'idle' || !vp.w) return
    // Reduced motion or a phone: skip the ring choreography and open directly
    // (the panel slides up as a bottom sheet on mobile).
    if (reduce || mobile) {
      setPhase('open')
      return
    }
    setPhase('flying')
    // 1 — fly to center and grow, glass kept the whole way
    await animate(prog, 1, { type: 'spring', stiffness: 80, damping: 16 })
    await wait(110)
    // 2 — lay flat and settle to the bottom as one continuous motion (no overshoot)
    setPhase('flat')
    await Promise.all([
      animate(tilt, 1, { type: 'spring', stiffness: 120, damping: 20 }),
      animate(drop, 1, { type: 'spring', stiffness: 90, damping: 23, delay: 0.12 }),
    ])
    // 3 — the window projects up out of the laid ring
    setPhase('open')
  }

  // Return keyboard focus to the launcher so the user is never stranded.
  const returnFocus = () =>
    requestAnimationFrame(() => launcherRef.current?.focus())

  async function closeChat() {
    if (phase !== 'open') return
    abortRef.current?.abort()
    if (reduce || mobile) {
      setPhase('idle')
      drop.set(0)
      tilt.set(0)
      prog.set(0)
      returnFocus()
      return
    }
    // window unmounts + exit-animates; rise + unflatten as one motion, then fly home
    setPhase('flat')
    await Promise.all([
      animate(drop, 0, { type: 'spring', stiffness: 120, damping: 22 }),
      animate(tilt, 0, { type: 'spring', stiffness: 130, damping: 20, delay: 0.06 }),
    ])
    await animate(prog, 0, { type: 'spring', stiffness: 120, damping: 18 })
    setPhase('idle')
    returnFocus()
  }

  function push(m: Omit<Msg, 'id'>) {
    setMessages((prev) => [...prev, { ...m, id: `m${idRef.current++}` }])
  }

  // A recoverable failure: a plain-spoken bot bubble with a one-tap retry of the
  // exact prompt that failed. Kept out of the model context (error flag) so a
  // hiccup never pollutes the thread.
  function pushError(kind: 'rate' | 'server' | 'network') {
    const text =
      kind === 'rate'
        ? "You're sending messages a little fast. Give it a few seconds, then try again."
        : kind === 'network'
          ? "I couldn't reach the server. Check your connection and try again."
          : 'Something went wrong reaching the model. Mind trying that again?'
    forcePinRef.current = true
    push({
      role: 'bot',
      text,
      error: true,
      actions: [{ label: 'Retry', send: lastUserRef.current }],
    })
  }

  async function send(text: string) {
    const t = text.trim()
    if (!t || pending) return
    lastUserRef.current = t

    // Snapshot the thread for context, excluding error bubbles so a prior
    // failure never gets sent to the model as conversation.
    const history = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, text: m.text }))
    history.push({ role: 'user', text: t })

    // The user just acted: always jump the view to their new prompt + the reply.
    forcePinRef.current = true
    push({ role: 'user', text: t })
    setInput('')
    setPending(true)
    setTyping(true)

    const controller = new AbortController()
    abortRef.current = controller
    let botId = ''

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })

      // No key (503) or no endpoint (404): this is preview mode, answer from the
      // built-in canned replies rather than showing an error.
      if (res.status === 503 || res.status === 404) {
        setTyping(false)
        push({ role: 'bot', ...stubReply(t) })
        return
      }
      if (res.status === 429) {
        setTyping(false)
        pushError('rate')
        return
      }
      if (!res.ok || !res.body) {
        setTyping(false)
        pushError('server')
        return
      }

      // First token replaces the typing dots with a live, growing bubble.
      botId = `m${idRef.current++}`
      setTyping(false)
      setMessages((prev) => [...prev, { id: botId, role: 'bot', text: '' }])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        const shown = stripDashes(acc)
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: shown } : m)),
        )
      }

      const finalText = stripDashes(acc).trim()
      const actions = suggestActions(t)
      // Verified source links for whatever incidents the answer actually discussed.
      const sources = responseSources(finalText)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? {
                ...m,
                text:
                  finalText ||
                  'I lost that one. Ask me about the flaw, real incidents, or how BoLD compares.',
                ...(actions ? { actions } : {}),
                ...(sources.length ? { sources } : {}),
              }
            : m,
        ),
      )
    } catch {
      setTyping(false)
      if (controller.signal.aborted) {
        // User stopped (or closed): keep partial text, drop an empty bubble.
        setMessages((prev) =>
          prev.filter((m) => !(m.id === botId && !m.text.trim())),
        )
        return
      }
      pushError('network')
    } finally {
      setPending(false)
      abortRef.current = null
    }
  }

  function stop() {
    abortRef.current?.abort()
  }

  function runAction(a: Action) {
    if (a.send) return send(a.send)
    if (a.to) {
      navigate(a.to)
      closeChat()
    }
  }

  // Keep Tab focus inside the open dialog (a lightweight focus trap).
  function trapTab(e: ReactKeyboardEvent) {
    if (e.key !== 'Tab') return
    const root = panelRef.current
    if (!root) return
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])',
      ),
    )
    if (!nodes.length) return
    const first = nodes[0]!
    const last = nodes[nodes.length - 1]!
    const active = document.activeElement
    if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const idle = phase === 'idle'

  // smooth tube wall: a few blurred, gradient-shaded translucent amber layers that
  // blend into one continuous glass tube (lit crown -> shadowed underside, no bands)
  const walls = [
    {
      y: w3,
      b: 3.5,
      c: 'linear-gradient(to bottom, rgba(150,96,34,0.4), rgba(92,56,18,0.48) 45%, rgba(46,27,8,0.56))',
    },
    {
      y: w2,
      b: 3,
      c: 'linear-gradient(to bottom, rgba(188,126,54,0.42), rgba(132,82,28,0.48) 50%, rgba(74,44,14,0.52))',
    },
    {
      y: w1,
      b: 2.5,
      c: 'linear-gradient(to bottom, rgba(222,156,80,0.44), rgba(176,114,46,0.46) 55%, rgba(110,68,22,0.48))',
    },
  ]

  return (
    <>
      {/* dedicated liquid-glass refraction filter — ring only */}
      <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter
            id="bold-ring-glass"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves={2}
              seed={11}
              result="noise"
            >
              {!reduce && (
                <animate
                  attributeName="baseFrequency"
                  dur="16s"
                  values="0.012;0.018;0.012"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            {/* chromatic dispersion: split R/G/B with different refraction so the
                glass edges fringe like real refractive glass */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={24} xChannelSelector="R" yChannelSelector="G" result="dR" />
            <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cR" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={17} xChannelSelector="R" yChannelSelector="G" result="dG" />
            <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cG" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="G" result="dB" />
            <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cB" />
            <feBlend in="cR" in2="cG" mode="screen" result="cRG" />
            <feBlend in="cRG" in2="cB" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* The ring: flies corner -> center, growing to 3x and thickening,
          keeping the full liquid-glass design at every size. */}
      {vp.w > 0 && (
        <motion.div
          ref={launcherRef}
          onClick={idle ? openChat : undefined}
          role={idle ? 'button' : undefined}
          aria-label={idle ? 'Ask BoLD' : undefined}
          aria-hidden={!idle}
          tabIndex={idle ? 0 : -1}
          onKeyDown={
            idle
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openChat()
                  }
                }
              : undefined
          }
          className="group fixed z-[62]"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            x,
            y,
            width: size,
            height: size,
            transformOrigin: 'center center',
            // On mobile the ring does not fly; hide it while the sheet is open.
            opacity: mobile && !idle ? 0 : 1,
            pointerEvents: idle ? 'auto' : 'none',
            cursor: idle ? 'pointer' : 'default',
          }}
        >
          {/* tube wall layers: spread downward + fade in as the ring lays flat,
              giving the laid ring a real rounded glass-tube thickness */}
          {walls.map((w, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                y: w.y,
                rotateX: tiltDeg,
                transformPerspective: 600,
                transformOrigin: 'center center',
                opacity: wallOpacity,
                background: w.c,
                filter: `blur(${w.b}px)`,
                maskImage: maskBg,
                WebkitMaskImage: maskBg,
              }}
            />
          ))}

          {/* tilt layer: the lit glass top face of the tube */}
          <motion.div
            className="h-full w-full"
            style={{
              rotateX: tiltDeg,
              transformPerspective: 600,
              transformOrigin: 'center center',
            }}
          >
          <motion.div
            className="relative h-full w-full"
            animate={idle && !reduce ? { y: [0, -7, 0] } : { y: 0 }}
            transition={
              idle && !reduce
                ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
          >
            {/* amber halo, ring-shaped so the hole stays see-through */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle closest-side at 50% 50%, transparent 50%, rgba(232,163,61,0.55) 72%, rgba(232,163,61,0) 100%)',
                filter: 'blur(5px)',
              }}
              animate={reduce ? {} : { opacity: [0.4, 0.95, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* the hollow liquid-glass amber band (refracts the bg, thickens with size) */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                backdropFilter:
                  'url(#bold-ring-glass) brightness(1.06) contrast(1.08) saturate(1.3)',
                WebkitBackdropFilter: 'blur(1px) brightness(1.06) contrast(1.08) saturate(1.3)',
                background: bandBg,
                maskImage: maskBg,
                WebkitMaskImage: maskBg,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))',
              }}
            />

            {/* environment reflection: samples the real (moving) background, edge-weighted,
                so the shine is the actual background, not a scripted rotation */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                backdropFilter: 'brightness(2.1) contrast(1.4) saturate(0.75) blur(1.5px)',
                WebkitBackdropFilter: 'brightness(2.1) contrast(1.4) blur(1.5px)',
                maskImage: reflMask,
                WebkitMaskImage: reflMask,
                mixBlendMode: 'screen',
                opacity: 0.6,
              }}
            />

            {/* one soft fixed catch-light, the specular gleam a real glass ring holds */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(44% 30% at 32% 23%, rgba(255,236,205,0.6), rgba(255,236,205,0) 72%)',
                maskImage: maskBg,
                WebkitMaskImage: maskBg,
                mixBlendMode: 'screen',
              }}
            />

            {idle && (
              <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/75 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
                ASK BoLD
              </span>
            )}
          </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* centered modal: blur + soft-dim backdrop, projected chat window */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            key="scrim"
            aria-hidden
            onClick={closeChat}
            className="fixed inset-0 z-[60]"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              background: 'rgba(0,0,0,0.45)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}

        {/* soft torch-style projection: an edgeless cone of light from the lens
            (desktop only — there is no laid-flat lens in the mobile sheet) */}
        {open && !reduce && !mobile && (
          <motion.div
            key="beam"
            aria-hidden
            className="pointer-events-none fixed left-1/2 z-[60]"
            style={{
              x: '-50%',
              bottom: BOTTOM_GAP - 14,
              width: 320,
              height: 250,
              transformOrigin: 'bottom center',
            }}
            initial={{ opacity: 0, scaleY: 0.45 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.4, transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* wide soft scatter, no edges */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(58% 70% at 50% 100%, rgba(240,182,98,0.3), rgba(240,182,98,0) 72%)',
                filter: 'blur(34px)',
                mixBlendMode: 'screen',
              }}
            />
            {/* soft core shaft */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(34% 82% at 50% 100%, rgba(255,228,182,0.6), rgba(255,212,152,0.14) 48%, rgba(255,212,152,0) 78%)',
                filter: 'blur(20px)',
                mixBlendMode: 'screen',
              }}
            />
            {/* soft bright lens glow at the source, an imperceptible breath only */}
            <motion.div
              className="absolute bottom-0 left-1/2"
              style={{
                width: 150,
                height: 76,
                x: '-50%',
                y: '46%',
                background:
                  'radial-gradient(closest-side, rgba(255,246,222,0.85), rgba(255,214,150,0.2) 55%, rgba(255,214,150,0) 78%)',
                filter: 'blur(12px)',
                mixBlendMode: 'screen',
              }}
              animate={{ opacity: [0.82, 1, 0.82] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {open && (
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="BoLD chat assistant"
            aria-busy={pending}
            onKeyDown={trapTab}
            className={
              mobile
                ? 'glass-panel z-[61] flex h-[86dvh] w-full flex-col overflow-hidden rounded-t-3xl'
                : 'glass-panel z-[61] flex h-[min(468px,82vh)] w-[min(560px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl'
            }
            style={
              mobile
                ? {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transformOrigin: 'bottom center',
                  }
                : {
                    position: 'fixed',
                    left: '50%',
                    bottom: WINDOW_BOTTOM,
                    x: '-50%',
                    transformOrigin: 'bottom center',
                  }
            }
            initial={
              mobile
                ? { y: '100%' }
                : { opacity: 0, scale: 0.9, y: reduce ? 0 : 18 }
            }
            animate={mobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={
              mobile
                ? { y: '100%' }
                : { opacity: 0, scale: 0.92, y: reduce ? 0 : 12 }
            }
            transition={
              reduce
                ? { duration: 0.2 }
                : mobile
                  ? { type: 'spring', stiffness: 260, damping: 30 }
                  : { type: 'spring', stiffness: 220, damping: 24 }
            }
          >
            {/* dark frosted backing so the window reads clearly over the dim scrim */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'rgba(14,12,10,0.55)' }}
            />

            {/* header */}
            <div className="relative flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
              <span
                aria-hidden
                className="border-accent h-5 w-5 flex-none rounded-full border-2"
                style={{
                  boxShadow:
                    '0 0 8px rgba(var(--accent-rgb),0.7), inset 0 0 4px rgba(var(--accent-rgb),0.4)',
                }}
              />
              <div className="leading-tight">
                <div className="font-display text-[14px] font-semibold text-white">
                  BoLD
                </div>
                <div className="text-accent/80 font-mono text-[9px] tracking-[0.2em]">
                  ONLINE · PREVIEW
                </div>
              </div>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* messages — own Lenis viewport (data-lenis-prevent isolates it) */}
            <div
              ref={scrollWrapRef}
              data-lenis-prevent
              className="relative min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div
                ref={scrollContentRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
                className="space-y-3 px-4 py-4"
              >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === 'user' ? 'flex justify-end' : ''}
                >
                  <div className="max-w-[88%]">
                    <div
                      className={
                        m.role === 'user'
                          ? 'rounded-2xl rounded-br-md bg-[rgba(var(--accent-rgb),0.16)] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white'
                          : m.error
                            ? 'rounded-2xl rounded-bl-md border border-rose-400/25 bg-rose-500/10 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-rose-100'
                            : 'glass-soft rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white/85'
                      }
                    >
                      {m.role === 'user' ? (
                        m.text
                      ) : (
                        <RichText
                          text={m.text}
                          onInternal={(href) => {
                            navigate(href.startsWith('#') ? `/${href}` : href)
                            closeChat()
                          }}
                        />
                      )}
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
                          Sources
                        </span>
                        {m.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-accent/25 text-accent/90 hover:border-accent/60 inline-flex items-center gap-1 rounded-full border bg-[rgba(var(--accent-rgb),0.08)] px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] transition-colors hover:text-white"
                          >
                            {s.label} ↗
                          </a>
                        ))}
                      </div>
                    )}
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.actions.map((a) => (
                          <button
                            key={a.label}
                            onClick={() => runAction(a)}
                            className="border-accent/30 text-accent/90 hover:border-accent/60 rounded-full border bg-[rgba(var(--accent-rgb),0.08)] px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] transition-colors hover:text-white"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div
                  role="status"
                  aria-label="BoLD is typing"
                  className="glass-soft inline-flex items-center gap-1 rounded-2xl rounded-bl-md px-3.5 py-3"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="bg-accent h-1.5 w-1.5 rounded-full"
                      animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.18,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="relative flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={pending ? 'BoLD is replying…' : 'Ask about BoLD...'}
                disabled={pending}
                aria-label="Ask BoLD a question"
                enterKeyHint="send"
                className="min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2.5 text-[13.5px] text-white placeholder:text-white/35 focus:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
              />
              {pending ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop generating"
                  className="bg-accent flex h-9 w-9 flex-none items-center justify-center rounded-full text-black transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  <span className="h-3 w-3 rounded-[3px] bg-black/85" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim()}
                  className="bg-accent flex h-9 w-9 flex-none items-center justify-center rounded-full text-black transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
