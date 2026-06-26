import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/ui/section'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { ScannerTimeline } from './ScannerTimeline'
import { rise } from '@/lib/motion'

const SCANNER = [
  {
    lead: 'Outside, on a timer.',
    rest: 'Checks the building from the street, then leaves.',
  },
  {
    lead: 'A page of maybes.',
    rest: 'Things that might be wrong, dated this morning.',
  },
  {
    lead: 'Asleep at 2pm.',
    rest: 'When a real user changed the URL, no one was home.',
  },
  {
    lead: 'Loud, then muted.',
    rest: 'Alerts with no context, the kind teams learn to ignore.',
  },
]

const ALARM: { lead: string; rest: string; key?: boolean }[] = [
  {
    lead: 'Inside every request.',
    rest: 'Rides the exact path your real traffic takes.',
  },
  {
    lead: 'Proof, not maybes.',
    rest: 'The request, the owner, the mismatch, in plain English.',
  },
  {
    lead: 'Awake at 2pm.',
    rest: 'The instant someone reaches data that isn’t theirs, it fires.',
  },
  {
    lead: 'Silent unless it’s real.',
    rest: 'Quiet on shared data; it speaks only when ownership breaks.',
    key: true,
  },
]

export function AlarmVsScanner() {
  return (
    <Section id="alarm" index="05" eyebrow="ALARM, NOT SCANNER">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        A scanner inspects. An alarm catches.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        A scanner is a home inspector who walks the outside of your house once a
        day and leaves a report. Useful, but it’s gone at 2am when someone
        actually walks out with the TV. BoLD is the alarm that lives inside.
      </motion.p>

      <div className="relative mt-12">
        <DriftingLight />
        <div className="relative grid gap-4 md:grid-cols-2">
          {/* Scanner — muted */}
          <GlassCard className="p-7 md:p-8">
            <div className="font-mono text-[11px] tracking-[0.24em] text-white/40">
              A SCANNER · THE INSPECTOR
            </div>
            <ul className="mt-6 space-y-4">
              {SCANNER.map((b) => (
                <li
                  key={b.lead}
                  className="flex gap-3 text-[15px] leading-relaxed"
                >
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-white/30" />
                  <span className="text-white/45">
                    <span className="font-medium text-white/70">{b.lead}</span>{' '}
                    {b.rest}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* BoLD — the alarm. Amber lives in the glass itself (soft halo + a
              wash over the slab), the Section-2 idiom, so it reads as the whole
              card glowing amber rather than a painted border. */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-[28px]"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(var(--accent-rgb),0.32), transparent 78%)',
                filter: 'blur(18px)',
              }}
            />
            <GlassCard className="p-7 md:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(var(--accent-rgb),0.16), rgba(var(--accent-rgb),0.05))',
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-accent">
                  <span className="pulse-dot bg-accent inline-block h-1.5 w-1.5 rounded-full" />
                  BoLD · THE ALARM
                </div>
                <ul className="mt-6 space-y-4">
                  {ALARM.map((b) => (
                    <li
                      key={b.lead}
                      className="flex gap-3 text-[15px] leading-relaxed"
                    >
                      <span className="bg-accent mt-2 h-1 w-1 flex-none rounded-full" />
                      <span className={b.key ? 'text-white/85' : 'text-white/70'}>
                        <span
                          className={
                            b.key
                              ? 'font-semibold text-white'
                              : 'font-medium text-white'
                          }
                        >
                          {b.lead}
                        </span>{' '}
                        {b.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* The argument made visual: blind gap vs continuous line, with the
          defining question folded in as its conclusion */}
      <motion.div variants={rise} className="mt-4">
        <ScannerTimeline />
      </motion.div>

      <motion.p
        variants={rise}
        className="mt-10 max-w-2xl text-[14.5px] leading-relaxed text-white/50"
      >
        Scanners are good at what they do. They just cannot see inside a live
        request.{' '}
        <span className="text-white/75">That is the one place BoLD lives.</span>
      </motion.p>

      <motion.div variants={rise} className="mt-7">
        <Link
          to="/compare"
          className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] text-white/70 underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white/50"
        >
          SEE HOW BoLD COMPARES TO OTHER TOOLS
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.div>
    </Section>
  )
}
