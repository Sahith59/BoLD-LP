import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/ui/section'
import { GlassPanel } from '@/components/ui/glass-panel'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { rise } from '@/lib/motion'

const CASES = [
  {
    source: 'McDonald’s hiring AI · Paradox.ai',
    year: '2025',
    lead: 'up to',
    stat: '64M',
    statLabel: 'records exposed',
    body: 'A default admin password ("123456") plus an IDOR flaw on sequential applicant IDs. A researcher changed the ID and the API handed back other applicants’ data.',
  },
  {
    source: 'Intel · "Intel Outside"',
    year: '2024',
    lead: null,
    stat: '~270K',
    statLabel: 'employee records exposed',
    body: 'A bypassed login and an over-exposed internal API returned the entire global employee directory in a single response.',
  },
]

const LEDGER = [
  ['Lovable', '170+ apps exposed, missing row-level security', 'lovable'],
  ['Tea', '72K images including IDs, plus 1.1M private messages', 'tea'],
  ['Moltbook', '1.5M API tokens and 35K emails, a vibe-coded app with RLS off', 'moltbook'],
]

export function Incidents() {
  return (
    <Section index="03" eyebrow="IT’S ALREADY HAPPENING">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        This isn’t hypothetical.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        Real apps, real users, this year. Every one leaked the same way: the app
        never checked who owned the data it handed back. That is BOLA, and it is
        the number one API vulnerability.
      </motion.p>

      {/* The two biggest cases */}
      <div className="relative mt-12">
        <DriftingLight />
        <div className="relative grid gap-4 md:grid-cols-2">
          {CASES.map((c) => (
            <GlassCard key={c.source} className="flex flex-col p-7 md:p-8">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-white/40">
                <span>{c.source}</span>
                <span>{c.year}</span>
              </div>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                {c.lead && (
                  <span className="text-[14px] text-white/45">{c.lead}</span>
                )}
                <span className="text-accent font-display text-[52px] font-semibold leading-none tracking-[-0.02em] tabular-nums md:text-[64px]">
                  {c.stat}
                </span>
                <span className="text-[14px] text-white/55">{c.statLabel}</span>
              </div>
              <p className="mt-6 text-[14.5px] leading-relaxed text-white/60">
                {c.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Three more — each opens its full write-up on /incidents */}
      <motion.div variants={rise}>
        <GlassPanel className="mt-4 divide-y divide-white/8 p-2">
          {LEDGER.map(([name, detail, id]) => (
            <Link
              key={name}
              to={`/incidents#${id}`}
              className="group flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
            >
              <span className="font-mono text-[12px] tracking-[0.1em] text-white/80">
                {name}
              </span>
              <span className="flex items-center gap-2 text-right text-[13px] text-white/45">
                {detail}
                <span
                  aria-hidden
                  className="text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/55"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </GlassPanel>
      </motion.div>

      <motion.p
        variants={rise}
        className="mt-8 max-w-2xl text-[14.5px] leading-relaxed text-white/55"
      >
        None of these were exotic hacks. They were missing ownership checks.{' '}
        <span className="text-white/80">
          That is the exact thing BoLD watches for.
        </span>
      </motion.p>

      <motion.div variants={rise} className="mt-7">
        <Link
          to="/incidents"
          className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] text-white/70 underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white/50"
        >
          SEE ALL THE CASES, WITH SOURCES
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
