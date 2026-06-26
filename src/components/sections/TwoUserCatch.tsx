import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react'
import { Lock, Play, RotateCcw, User } from 'lucide-react'

const RUN_MS = 4400 // one pass of the request, A -> BoLD -> caught
const REST = 0.95 // hold here so the CAUGHT state stays lit at the end

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setNarrow(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

const PHASES = [
  'User A is logged in. So far, perfectly normal.',
  'A changes the URL and requests record #105.',
  'BoLD reads the request, live. Does A own #105?',
  'Caught. A is reaching a record that isn’t theirs.',
]

function phaseOf(t: number) {
  if (t < 0.12) return 0
  if (t < 0.46) return 1
  if (t < 0.62) return 2
  return 3
}

/**
 * One wire segment between two nodes: a track that fades at both ends so it
 * reads as deliberate wiring, a connection port at each end, and a glowing
 * packet that travels its length. Horizontal on desktop, vertical on mobile.
 */
function Wire({
  vertical,
  progress,
  visible,
}: {
  vertical: boolean
  progress: MotionValue<number>
  visible: MotionValue<number>
}) {
  const pos = useTransform(progress, [0, 1], ['0%', '100%'])

  const port =
    'absolute h-1.5 w-1.5 rounded-full bg-white/35 ring-2 ring-white/5'

  return (
    <div
      className={
        vertical
          ? 'relative my-1 h-16 w-px flex-none self-center'
          : 'relative mx-1.5 h-px flex-1'
      }
    >
      {/* base track */}
      <div
        className={
          vertical
            ? 'absolute inset-0 bg-gradient-to-b from-white/5 via-white/20 to-white/5'
            : 'absolute inset-0 bg-gradient-to-r from-white/5 via-white/20 to-white/5'
        }
      />
      {/* connection ports */}
      <span
        className={`${port} ${
          vertical
            ? 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2'
            : 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
        }`}
      />
      <span
        className={`${port} ${
          vertical
            ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
            : 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2'
        }`}
      />
      {/* travelling packet */}
      <motion.span
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={
          vertical
            ? { left: '50%', top: pos, opacity: visible }
            : { left: pos, top: '50%', opacity: visible }
        }
      >
        <span className="relative block h-2.5 w-2.5">
          <span className="bg-accent absolute inset-0 rounded-full" />
          <span className="bg-accent absolute inset-0 rounded-full opacity-70 blur-[5px]" />
        </span>
      </motion.span>
    </div>
  )
}

/**
 * The signature: a request from User A travels the live request path, where
 * BoLD sits inline. BoLD checks ownership as it happens and catches A reaching
 * User B's record. The visitor sends the request themselves, watches BoLD fire,
 * and can replay it. Auto-runs once when scrolled into view so it is never dead.
 */
export function TwoUserCatch({ reduce }: { reduce: boolean | null }) {
  const vertical = useIsNarrow()
  const t = useMotionValue(reduce ? REST : 0)
  const [phase, setPhase] = useState(reduce ? 3 : 0)
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(reduce ? true : false)
  const rootRef = useRef<HTMLDivElement>(null)
  const controls = useRef<AnimationPlaybackControls | null>(null)

  // Drive the narration phase off the timeline value.
  useEffect(() => {
    const unsub = t.on('change', (v) => {
      const p = phaseOf(v)
      setPhase((prev) => (prev === p ? prev : p))
    })
    return () => unsub()
  }, [t])

  const run = useCallback(() => {
    if (reduce) {
      t.set(REST)
      setPhase(3)
      setHasRun(true)
      return
    }
    controls.current?.stop()
    t.set(0)
    setPhase(0)
    setHasRun(true)
    setRunning(true)
    const c = animate(t, REST, { duration: RUN_MS / 1000, ease: 'linear' })
    controls.current = c
    c.then(() => setRunning(false)).catch(() => {})
  }, [reduce, t])

  // First time the catch scrolls into view, play it once on its own.
  useEffect(() => {
    if (reduce) return
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run()
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.55 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce, run])

  useEffect(() => () => controls.current?.stop(), [])

  // Packet A -> BoLD (left wire)
  const leftProgress = useTransform(t, [0.14, 0.44], [0, 1], { clamp: true })
  const leftVisible = useTransform(t, [0.1, 0.16, 0.44, 0.49], [0, 1, 1, 0])

  // BoLD inspecting (status dot flares as the request passes through)
  const watchScale = useTransform(t, [0.44, 0.53, 0.62], [1, 1.7, 1], {
    clamp: true,
  })
  const watchGlow = useTransform(t, [0.44, 0.53, 0.62], [0.45, 1, 0.45], {
    clamp: true,
  })

  // Packet BoLD -> B (right wire)
  const rightProgress = useTransform(t, [0.62, 0.88], [0, 1], { clamp: true })
  const rightVisible = useTransform(t, [0.6, 0.66, 0.86, 0.92], [0, 1, 1, 0])

  // The catch (fires on User B's record), held lit at REST
  const pulseScale = useTransform(t, [0.84, 0.95], [0.5, 2.4], { clamp: true })
  const pulseOpacity = useTransform(t, [0.82, 0.9, 0.95], [0, 0.85, 0.4])
  const bGlow = useTransform(t, [0.84, 0.9], [0, 1], { clamp: true })
  const caughtOpacity = useTransform(t, [0.86, 0.92], [0, 1], { clamp: true })
  const caughtY = useTransform(t, [0.86, 0.92], [10, 0], { clamp: true })

  return (
    <div ref={rootRef}>
      <div className="mx-auto w-full max-w-5xl select-none">
        <div className="flex flex-col items-stretch md:flex-row md:items-center">
          {/* User A */}
          <div className="md:w-[25%] md:flex-none">
            <div className="glass-refract rounded-2xl p-4 md:min-h-[152px]">
              <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-white/45">
                <User className="h-3 w-3" /> USER A · LOGGED IN
              </div>
              <div className="mt-3 rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 font-mono text-[10.5px] text-white/75">
                GET /invoice/<span className="text-accent-soft">105</span>
              </div>
              <div className="mt-2 font-mono text-[8.5px] tracking-[0.08em] text-white/35">
                ↑ changed from 104
              </div>
            </div>
          </div>

          {/* A -> BoLD */}
          <Wire vertical={vertical} progress={leftProgress} visible={leftVisible} />

          {/* BoLD — inline gateway on the request path */}
          <div className="relative z-20 flex-none self-center">
            <div className="glass-refract-soft flex flex-col items-center gap-1.5 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-2">
                <motion.span
                  className="bg-accent block h-2.5 w-2.5 rounded-full"
                  style={{
                    scale: watchScale,
                    opacity: watchGlow,
                    boxShadow: '0 0 14px rgba(var(--accent-rgb),0.95)',
                  }}
                />
                <span className="font-mono text-[13px] font-semibold tracking-[0.18em] text-white">
                  BoLD
                </span>
              </div>
              <span className="font-mono text-[8px] tracking-[0.22em] text-white/45">
                IN THE REQUEST PATH
              </span>
            </div>
          </div>

          {/* BoLD -> B */}
          <Wire
            vertical={vertical}
            progress={rightProgress}
            visible={rightVisible}
          />

          {/* User B's record */}
          <div className="md:w-[25%] md:flex-none">
            <div className="relative">
              {/* soft amber alarm halo around the card (replaces the thin ring) */}
              <motion.div
                className="pointer-events-none absolute -inset-3 rounded-[22px]"
                style={{
                  opacity: bGlow,
                  background:
                    'radial-gradient(closest-side, rgba(var(--accent-rgb),0.5), transparent 80%)',
                  filter: 'blur(12px)',
                }}
              />

              <div className="glass-refract relative overflow-hidden rounded-2xl p-4 md:min-h-[152px]">
                {/* the entire glass washes amber when caught */}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: bGlow,
                    background:
                      'linear-gradient(155deg, rgba(var(--accent-rgb),0.42), rgba(var(--accent-rgb),0.24))',
                  }}
                />
                {/* soft inner pulse for alarm life */}
                <motion.div
                  className="bg-accent pointer-events-none absolute inset-x-6 top-1/2 h-20 -translate-y-1/2 rounded-full"
                  style={{
                    opacity: pulseOpacity,
                    scale: pulseScale,
                    filter: 'blur(22px)',
                  }}
                />

                <div className="relative">
                  <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-white/45">
                    <Lock className="h-3 w-3" /> RECORD #105
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="h-2 w-3/4 rounded bg-white/15" />
                    <div className="h-2 w-1/2 rounded bg-white/10" />
                    <div className="h-2 w-2/3 rounded bg-white/10" />
                  </div>
                  <div className="mt-4 font-mono text-[8.5px] tracking-[0.08em] text-white/40">
                    owner: <span className="text-white/70">User B</span>
                  </div>
                </div>
              </div>

              {/* Caught tag + reason */}
              <motion.div
                className="absolute -right-1 -top-3 z-20"
                style={{ opacity: caughtOpacity, y: caughtY }}
              >
                <span className="bg-accent flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.16em] text-black shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
                  CAUGHT
                </span>
              </motion.div>
              <motion.div
                className="text-accent absolute -bottom-7 right-0 z-20 font-mono text-[9px] tracking-[0.04em]"
                style={{ opacity: caughtOpacity }}
              >
                owner B ≠ requester A
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Narration */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {PHASES.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                i === phase ? 'bg-accent' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[11px] tracking-[0.02em] text-white/65 md:text-[12px]">
        {PHASES[phase]}
      </p>

      {/* The interaction: the visitor sends the bad request themselves */}
      {!reduce && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={run}
            disabled={running}
            aria-label={
              hasRun ? 'Replay the catch' : 'Send the request as User A'
            }
            className="glass-soft group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] font-medium text-white/85 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-60"
          >
            <span className="bg-accent/15 text-accent grid h-6 w-6 place-items-center rounded-full transition group-hover:bg-accent/25">
              {hasRun ? (
                <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <Play className="h-3 w-3 translate-x-px" strokeWidth={2.5} />
              )}
            </span>
            {running
              ? 'Sending the request…'
              : hasRun
                ? 'Replay the catch'
                : 'Send the request as User A'}
          </button>
        </div>
      )}
    </div>
  )
}
