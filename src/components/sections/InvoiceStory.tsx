import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { TwoUserCatch } from './TwoUserCatch'
import { rise } from '@/lib/motion'

const STEPS = [
  {
    tag: 'NORMAL',
    title: 'You open your own invoice.',
    req: 'GET /invoice/104',
    res: '200 OK · owner: you',
    note: 'Your record. Looks perfect in every demo.',
    danger: false,
  },
  {
    tag: 'THE CHANGE',
    title: 'You change one number.',
    req: 'GET /invoice/105',
    res: 'auth: ✓ logged in',
    note: 'The app confirms your login. It never asks who owns 105.',
    danger: false,
  },
  {
    tag: 'THE LEAK',
    title: 'It hands it over.',
    req: 'GET /invoice/105',
    res: '200 OK · owner: someone else',
    note: 'You are now reading another user’s data. No error. No log. Nothing to alert you.',
    danger: true,
  },
]

export function InvoiceStory({ reduce }: { reduce: boolean | null }) {
  return (
    <Section id="flaw" index="02" eyebrow="THE FLAW">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        Change one number. Read a stranger’s data.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        Your AI wrote a page that loads a record by its ID. It checks that you
        are logged in.{' '}
        <span className="text-white/85">
          It never checks that the record belongs to you.
        </span>{' '}
        That is broken object-level authorization, the number one API
        vulnerability, and it is one of an entire family of access flaws AI tools
        ship by default.
      </motion.p>

      {/* Concrete request/response timeline */}
      <div className="relative mt-12">
        {/* faint drifting light the glass refracts, so every edge shimmers with
            movement instead of going static over the dark background */}
        <DriftingLight />
        <div className="relative grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <GlassCard key={s.tag} className="flex flex-col p-6">
            <div
              className={`font-mono text-[10px] tracking-[0.24em] ${
                s.danger ? 'text-accent' : 'text-white/40'
              }`}
            >
              {s.tag}
            </div>
            <h3 className="mt-4 font-display text-[18px] font-medium text-white">
              {s.title}
            </h3>
            <div className="mt-4 space-y-1.5 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-[11px]">
              <div className="text-white/75">{s.req}</div>
              <div className={s.danger ? 'text-accent-soft' : 'text-white/40'}>
                {s.res}
              </div>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
              {s.note}
            </p>
          </GlassCard>
          ))}
        </div>
      </div>

      {/* Widen toward the whole family (the full catalog lives in its own
          WhatItCatches section), then hand off to the live catch. */}
      <motion.p
        variants={rise}
        className="mx-auto mt-16 max-w-2xl text-center font-display text-[17px] leading-relaxed text-white/65 md:text-[19px]"
      >
        And it is not just invoices. The same ownership failure runs through a
        whole family of access flaws. One question sits underneath all of them:{' '}
        <span className="text-white">
          can someone reach data or an action that is not theirs?
        </span>{' '}
        BoLD answers it, live, for every request.
      </motion.p>

      {/* The signature: the same moment, live, in the request path */}
      <motion.div variants={rise} className="mt-20">
        <div className="mb-8 text-center font-mono text-[10px] tracking-[0.3em] text-white/40">
          THE SAME MOMENT · LIVE, IN THE REQUEST PATH
        </div>
        <TwoUserCatch reduce={reduce} />
        <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-relaxed text-white/60 md:text-[15px]">
          <span className="text-accent">Caught.</span> #105 belongs to User B,
          not A. BoLD saw it the instant it happened, with proof, and never
          touched User B’s real data.
        </p>
      </motion.div>

      <motion.p
        variants={rise}
        className="mx-auto mt-16 max-w-2xl text-center font-display text-[20px] leading-snug text-white/85 md:text-[24px]"
      >
        It works perfectly in every demo, because you only ever open your own
        data. It breaks the day a real user reaches someone else’s.{' '}
        <span className="text-white">
          BoLD is watching for exactly that moment.
        </span>
      </motion.p>
    </Section>
  )
}
