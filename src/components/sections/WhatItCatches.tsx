import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { rise } from '@/lib/motion'

// The authorization-and-ownership family: the "Now" scope. One root cause (no
// ownership check) wearing six shapes, each tagged with its category so the
// section reads as a taxonomy, not a single bug.
const FAMILY = [
  {
    tag: 'BOLA / IDOR',
    lead: 'Read someone else’s records.',
    detail: 'Invoices, files, messages, profiles. Change one ID and a stranger’s data comes back.',
  },
  {
    tag: 'UNAUTHORIZED WRITES',
    lead: 'Edit or delete data you do not own.',
    detail: 'Not just viewing it. Changing or destroying it.',
  },
  {
    tag: 'FUNCTION-LEVEL AUTHZ',
    lead: 'Reach an admin action as a normal user.',
    detail: 'The privileged endpoint the AI never locked.',
  },
  {
    tag: 'PRIVILEGE ESCALATION',
    lead: 'Promote yourself with one field.',
    detail: 'Send role: admin in the request and the app trusts it.',
  },
  {
    tag: 'EXCESSIVE EXPOSURE',
    lead: 'Pull back more than you should.',
    detail: 'Responses leaking extra fields, other users’ data, internal flags.',
  },
  {
    tag: 'CROSS-TENANT',
    lead: 'See another tenant’s data.',
    detail: 'One customer’s account exposing another’s, in multi-tenant apps.',
  },
]

export function WhatItCatches() {
  return (
    <Section id="catches" index="03" eyebrow="WHAT BoLD CATCHES">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        It is never just one bug.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        The invoice was one shape of a single failure. Underneath the whole
        family is the same root cause: the app never checks ownership.{' '}
        <span className="text-white/85">
          The wrong user, or the wrong role, succeeds in doing the wrong thing to
          the wrong object, or sees the wrong data.
        </span>
      </motion.p>

      <div className="relative mt-12">
        <DriftingLight />
        <div className="relative grid gap-4 md:grid-cols-3">
          {FAMILY.map((f) => (
            <GlassCard key={f.tag} className="flex flex-col p-6">
              <div className="text-accent font-mono text-[10px] tracking-[0.22em]">
                {f.tag}
              </div>
              <h3 className="mt-3 font-display text-[17px] font-medium leading-snug text-white">
                {f.lead}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                {f.detail}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      <motion.p
        variants={rise}
        className="mt-10 max-w-2xl text-[14.5px] leading-relaxed text-white/50"
      >
        Every one of them only becomes real inside a live request, with a real
        identity reaching a real object.{' '}
        <span className="text-white/75">
          That is the one place BoLD watches.
        </span>
      </motion.p>
    </Section>
  )
}
