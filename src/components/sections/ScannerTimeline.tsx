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
const PLAY_MS = 1700

/**
 * One day, two tracks. The scanner checks at 7am and again tomorrow, blind to
 * the 2pm violation in between. BoLD is an unbroken line that lights up at the
 * exact moment. On scroll-in the violation appears, then BoLD catches it.
 * Reduced motion holds the final lit/caught state.
 */
export function ScannerTimeline() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  const p = useMotionValue(reduce ? 1 : 0)
  const playing = useRef(false)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    if (inView && !reduce) playing.current = true
  }, [inView, reduce])

  useAnimationFrame((now) => {
    if (!playing.current || p.get() >= 1) return
    if (startedAt.current === null) startedAt.current = now
    p.set(Math.min(1, (now - startedAt.current) / PLAY_MS))
  })

  // The violation surfaces first (scanner is blind to it)...
  const violationOpacity = useTransform(p, [0.1, 0.35], [0, 1], { clamp: true })
  // ...then BoLD catches it on the live line.
  const pulseScale = useTransform(p, [0.4, 0.62], [0.4, 1], { clamp: true })
  const ringScale = useTransform(p, [0.4, 0.85], [0.5, 3.4], { clamp: true })
  const ringOpacity = useTransform(p, [0.4, 0.5, 0.85], [0, 0.8, 0], {
    clamp: true,
  })
  const caughtOpacity = useTransform(p, [0.46, 0.72], [0, 1], { clamp: true })

  return (
    <div ref={ref} className="glass-panel rounded-2xl p-6 md:p-8">
      <div className="mb-7 font-mono text-[10px] tracking-[0.3em] text-white/35">
        ONE DAY
      </div>

      {/* SCANNER track */}
      <div className="relative">
        <div className="font-mono text-[10px] tracking-[0.24em] text-white/35">
          THE SCANNER
        </div>
        <motion.div
          style={{ opacity: violationOpacity }}
          className="absolute left-[48%] top-[22px] w-[210px] -translate-x-1/2 text-center font-mono text-[10px] leading-tight text-white/40"
        >
          2pm: user A reads user B&apos;s data
        </motion.div>
        <div className="relative mt-[52px] h-px bg-white/12">
          <span className="absolute left-[2%] top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35" />
          <motion.span
            style={{ opacity: violationOpacity }}
            className="absolute left-[48%] top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45"
          />
          <span className="absolute left-[98%] top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25" />
        </div>
        <div className="relative mt-2.5 h-4 font-mono text-[10px] text-white/35">
          <span className="absolute left-0 top-0">7am scan: looks fine</span>
          <span className="absolute right-0 top-0 text-right">
            next scan: tomorrow
          </span>
        </div>
      </div>

      {/* Same-moment connector */}
      <div className="relative h-7">
        <motion.div
          style={{ opacity: violationOpacity, left: V }}
          className="absolute bottom-0 top-0 -translate-x-1/2 border-l border-dashed border-white/20"
        />
      </div>

      {/* BoLD track */}
      <div className="relative">
        <div className="text-accent flex items-center gap-2 font-mono text-[10px] tracking-[0.24em]">
          <span className="pulse-dot bg-accent inline-block h-1.5 w-1.5 rounded-full" />
          BoLD
        </div>
        <div
          className="bg-accent relative mt-[52px] h-[2px]"
          style={{ boxShadow: '0 0 16px rgba(var(--accent-rgb),0.55)' }}
        >
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
          <span className="absolute left-0 top-0 text-white/40">
            always watching
          </span>
          <motion.span
            style={{ opacity: caughtOpacity }}
            className="text-accent absolute left-[48%] top-0 w-[200px] -translate-x-1/2 text-center"
          >
            caught, live, with proof
          </motion.span>
        </div>
      </div>

      <p className="mt-9 text-center text-[13.5px] leading-relaxed text-white/55 md:text-[14.5px]">
        Same day. Same violation. The scanner was not looking.{' '}
        <span className="text-white/80">BoLD was.</span>
      </p>
    </div>
  )
}
