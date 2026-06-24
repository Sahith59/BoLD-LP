import { useEffect, useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  useInView,
  useReducedMotion,
} from 'motion/react'

const V = '48%' // where 2pm sits on the day
const PLAY_MS = 2000

// Illustrative hour axis. 2pm is lit amber to foreshadow the violation moment.
const TICKS = [
  { t: '7a', x: '2%' },
  { t: '12p', x: '27%' },
  { t: '2p', x: '48%', hot: true },
  { t: '6p', x: '70%' },
  { t: '12a', x: '92%' },
]

/**
 * One day, two tracks. The scanner checks at 7am and again tomorrow, blind to
 * everything between, shown as a hatched dead band the 2pm violation falls
 * straight into. BoLD is an unbroken amber line that is always watching (a
 * highlight sweeps it forever) and lights up at the exact moment, surfacing the
 * captured request as proof. The defining question is folded in as the card's
 * footer so the visual and the punchline read as one unit. A scrim inside the
 * card calms the animated page background so the chart stays crisp. On scroll-in
 * the story plays once; reduced motion holds the final caught state.
 */
export function ScannerTimeline() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  const p = useMotionValue(reduce ? 1 : 0)
  const playing = useRef(false)
  const startedAt = useRef<number | null>(null)
  const live = inView && !reduce

  useEffect(() => {
    if (inView && !reduce) playing.current = true
  }, [inView, reduce])

  useAnimationFrame((now) => {
    if (!playing.current || p.get() >= 1) return
    if (startedAt.current === null) startedAt.current = now
    p.set(Math.min(1, (now - startedAt.current) / PLAY_MS))
  })

  // Setup reads first: the blind band, then the violation drops...
  const blindOpacity = useTransform(p, [0.04, 0.24], [0, 1], { clamp: true })
  const violationOpacity = useTransform(p, [0.12, 0.34], [0, 1], { clamp: true })
  const beamScaleY = useTransform(p, [0.16, 0.4], [0, 1], { clamp: true })
  // ...then BoLD catches it on the live line.
  const pulseScale = useTransform(p, [0.42, 0.64], [0.4, 1], { clamp: true })
  const ringScale = useTransform(p, [0.42, 0.86], [0.5, 3.4], { clamp: true })
  const ringOpacity = useTransform(p, [0.42, 0.52, 0.86], [0, 0.85, 0], {
    clamp: true,
  })
  // ...and the proof surfaces.
  const caughtOpacity = useTransform(p, [0.52, 0.78], [0, 1], { clamp: true })
  const chipY = useTransform(p, [0.52, 0.78], [12, 0], { clamp: true })
  const chipScale = useTransform(p, [0.52, 0.78], [0.96, 1], { clamp: true })

  return (
    <div
      ref={ref}
      className="glass-panel relative overflow-hidden rounded-2xl p-6 md:p-8"
    >
      {/* scrim: calm the animated page background so the chart reads crisp,
          while the glass rim still refracts at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            'radial-gradient(130% 110% at 50% 42%, rgba(8,8,10,0.64), rgba(8,8,10,0.46))',
        }}
      />
      {/* faint amber life under the BoLD rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 bottom-[30%] h-28"
        style={{
          background:
            'radial-gradient(closest-side, rgba(var(--accent-rgb),0.16), transparent 76%)',
          filter: 'blur(36px)',
        }}
      />

      {/* Header + hour axis */}
      <div className="relative mb-4 font-mono text-[10px] tracking-[0.3em] text-white/45">
        ONE DAY
      </div>
      <div className="relative mb-6 h-6">
        {TICKS.map((tk) => (
          <span
            key={tk.t}
            style={{ left: tk.x }}
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1"
          >
            <span
              className={`h-1.5 w-px ${tk.hot ? 'bg-accent/70' : 'bg-white/25'}`}
            />
            <span
              className={`font-mono text-[9px] ${
                tk.hot ? 'text-accent' : 'text-white/45'
              }`}
            >
              {tk.t}
            </span>
          </span>
        ))}
      </div>

      {/* SCANNER track */}
      <div className="relative">
        <div className="font-mono text-[10px] tracking-[0.24em] text-white/45">
          THE SCANNER
        </div>
        <motion.div
          style={{ opacity: violationOpacity }}
          className="absolute left-[48%] top-[22px] w-[210px] -translate-x-1/2 text-center font-mono text-[10px] leading-tight text-white/55"
        >
          2pm: user A reads user B&apos;s data
        </motion.div>

        <div className="relative mt-[52px] h-px bg-white/15">
          {/* blind window: hatched dead band the scanner cannot see into */}
          <motion.div
            style={{ opacity: blindOpacity }}
            className="absolute left-[6%] right-[6%] top-1/2 h-3 -translate-y-1/2 rounded-[2px]"
          >
            <div
              className="absolute inset-0 rounded-[2px]"
              style={{
                background:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.11) 0 5px, transparent 5px 10px)',
                maskImage:
                  'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
              }}
            />
          </motion.div>

          {/* two lit scan moments */}
          <span className="absolute left-[2%] top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 shadow-[0_0_8px_rgba(255,255,255,0.35)]" />
          <span className="absolute left-[98%] top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45" />
          {/* the violation, dim and ignored, inside the dead band */}
          <motion.span
            style={{ opacity: violationOpacity }}
            className="absolute left-[48%] top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35"
          />
        </div>

        <div className="relative mt-2.5 h-4 font-mono text-[10px] text-white/45">
          <span className="absolute left-0 top-0">7am scan: looks fine</span>
          <motion.span
            style={{ opacity: blindOpacity }}
            className="absolute left-[48%] top-0 w-[210px] -translate-x-1/2 text-center text-white/40"
          >
            blind window · 23h unwatched
          </motion.span>
          <span className="absolute right-0 top-0 text-right">
            next scan: tomorrow
          </span>
        </div>
      </div>

      {/* Same-moment connector beam */}
      <div className="relative h-7">
        <motion.div
          style={{ opacity: violationOpacity, left: V, scaleY: beamScaleY }}
          className="border-accent/45 absolute bottom-0 top-0 origin-top -translate-x-1/2 border-l border-dashed"
        />
      </div>

      {/* BoLD track */}
      <div className="relative">
        <div className="text-accent flex items-center gap-2 font-mono text-[10px] tracking-[0.24em]">
          <span className="pulse-dot bg-accent inline-block h-1.5 w-1.5 rounded-full" />
          BoLD
        </div>

        <div className="relative mt-[52px]">
          {/* the live rail */}
          <div
            className="bg-accent relative h-[2px]"
            style={{ boxShadow: '0 0 16px rgba(var(--accent-rgb),0.6)' }}
          >
            {/* always-watching highlight sweeping the line forever */}
            <div className="absolute -inset-y-1.5 inset-x-0 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 w-1/4"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,221,160,0.6), transparent)',
                }}
                animate={live ? { x: ['-100%', '400%'] } : { x: '150%' }}
                transition={{
                  duration: 2.8,
                  repeat: live ? Infinity : 0,
                  repeatDelay: 0.6,
                  ease: 'linear',
                }}
              />
            </div>

            {/* the catch */}
            <div className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.span
                className="border-accent absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{ scale: ringScale, opacity: ringOpacity }}
              />
              <motion.span
                className="bg-accent block h-3 w-3 rounded-full"
                style={{
                  scale: pulseScale,
                  boxShadow: '0 0 14px rgba(var(--accent-rgb),0.95)',
                }}
              />
            </div>
          </div>

          <div className="relative mt-2.5 h-4 font-mono text-[10px]">
            <span className="absolute left-0 top-0 text-white/50">
              always watching
            </span>
            <motion.span
              style={{ opacity: caughtOpacity }}
              className="text-accent absolute left-[48%] top-0 w-[200px] -translate-x-1/2 text-center"
            >
              caught, live, with proof
            </motion.span>
          </div>

          {/* the proof: the captured request, surfaced on the catch */}
          <div className="relative mt-6 h-[134px]">
            <motion.div
              style={{ opacity: caughtOpacity, y: chipY, scale: chipScale }}
              className="absolute left-[48%] top-0 w-[252px] max-w-[calc(100%-1rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-[rgba(var(--accent-rgb),0.32)] bg-[rgba(var(--accent-rgb),0.13)] shadow-[0_12px_36px_rgba(0,0,0,0.42)] ring-1 ring-inset ring-[rgba(var(--accent-rgb),0.16)] backdrop-blur-md"
            >
              {/* glassy top sheen */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-9"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.10), transparent)',
                }}
              />
              <div className="relative px-4 py-3.5">
                <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.24em]">
                  <span className="flex items-center gap-1.5 text-white/55">
                    <span className="bg-accent h-1 w-1 rounded-full" />
                    EVIDENCE
                  </span>
                  <span className="text-accent-soft">200 OK</span>
                </div>
                <div className="mt-2.5 font-mono text-[12.5px] text-white/90">
                  GET /invoice/105
                </div>
                <div className="mt-1 font-mono text-[11px] text-white/55">
                  caller user A · owner user B
                </div>
                <div className="text-accent-soft mt-1.5 font-mono text-[11px] font-medium">
                  ownership mismatch
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <p className="relative mt-2 text-center text-[13.5px] leading-relaxed text-white/60 md:text-[14.5px]">
        Same day. Same violation. The scanner was not looking.{' '}
        <span className="text-white/85">BoLD was.</span>
      </p>

      {/* The defining question, folded in as the conclusion */}
      <div className="relative mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
        <div className="font-display text-[18px] font-medium text-white md:text-[21px]">
          “Did user A just read user B’s data?”
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="font-mono text-[12px] text-white/45">
            <span className="tracking-[0.2em]">SCANNER:</span> no idea
          </div>
          <div className="font-mono text-[12px] text-accent">
            <span className="tracking-[0.2em]">BoLD:</span> that’s the whole job
          </div>
        </div>
      </div>
    </div>
  )
}
