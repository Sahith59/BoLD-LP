import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { GlassPanel } from '@/components/ui/glass-panel'
import { rise } from '@/lib/motion'

export function Proof() {
  return (
    <Section index="06" eyebrow="THE ALERT">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        Warm voice. Cold proof.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        No severity score, no checklist. When BoLD catches something, you get the
        exact request, what it means in plain English, and the one-line fix, even
        if you’ve never read the code your AI wrote.
      </motion.p>

      <GlassPanel className="mt-10 overflow-hidden p-0">
        {/* terminal header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="font-mono text-[11px] tracking-[0.18em] text-white/45">
            bold ▸ live alert
          </span>
          <span className="bg-accent rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.16em] text-black">
            OWNERSHIP VIOLATION
          </span>
        </div>

        <div className="space-y-5 px-5 py-6 font-mono text-[12.5px] leading-relaxed md:px-7 md:text-[13.5px]">
          {/* the request */}
          <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white/70">
            <div>User A &nbsp;→&nbsp; GET /invoice/105 &nbsp;→&nbsp; 200 OK</div>
            <div className="mt-1 text-white/45">
              record #105 owner = User B &nbsp;·&nbsp;{' '}
              <span className="text-accent">ownership not enforced</span>
            </div>
          </div>

          {/* the plain-English alert */}
          <p className="font-sans text-[14.5px] leading-relaxed text-white/85">
            Heads up. A logged-in user just opened a record they don’t own on
            your <span className="text-white">/invoice</span> page. The app checks
            that people are logged in, but not that the data belongs to them.
          </p>

          {/* the fix */}
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-accent">
              THE ONE-LINE FIX
            </div>
            <p className="font-sans text-white/70">
              Check the record belongs to the logged-in user before returning it.
              On Supabase, switch on Row-Level Security so every query is scoped
              to the current user automatically.
            </p>
          </div>
        </div>
      </GlassPanel>

      <motion.p
        variants={rise}
        className="mt-6 text-[14px] leading-relaxed text-white/55"
      >
        The exact request. Plain English. The one-line fix.{' '}
        <span className="text-white/80">No security degree required.</span>
      </motion.p>
    </Section>
  )
}
