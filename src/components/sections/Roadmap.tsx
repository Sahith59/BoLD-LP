import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { rise } from '@/lib/motion'

// The expansion arc, honest about what ships vs what is planned. Now is the
// lit, amber phase (what the live beta covers); Next and Later are
// muted roadmap. The discipline is the point: only runtime-native problems.
const PHASES = [
  {
    when: 'NOW',
    state: 'Live in the beta',
    title: 'Authorization & ownership',
    body: 'Catch the wrong user, role, or tenant reaching data or actions that are not theirs. BOLA, function-level authz, cross-tenant access, privilege escalation, excessive data exposure.',
    live: true,
  },
  {
    when: 'NEXT',
    state: 'On the roadmap',
    title: 'Identity & API abuse',
    body: 'Token replay and suspicious session reuse, credential stuffing, enumeration and object probing, and resource or cost abuse on sensitive endpoints.',
    live: false,
  },
  {
    when: 'LATER',
    state: 'Further out',
    title: 'Business-flow & AI-operation',
    body: 'Refund and quota abuse, GraphQL cost abuse, and anomalous AI tool or API chaining in AI-enabled apps.',
    live: false,
  },
]

export function Roadmap() {
  return (
    <Section index="09" eyebrow="WHERE IT’S GOING">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        Start narrow. Expand on purpose.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        We catch what is only visible at runtime, and we earn each step before
        taking the next.{' '}
        <span className="text-white/85">
          We are not becoming a generic scanner.
        </span>
      </motion.p>

      <div className="relative mt-12">
        <DriftingLight />
        <div className="relative grid gap-4 md:grid-cols-3">
          {PHASES.map((p) =>
            p.live ? (
              <div key={p.when} className="relative">
                {/* amber halo + wash: the live phase glows, the Section-2 idiom */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-2 rounded-[28px]"
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(var(--accent-rgb),0.3), transparent 78%)',
                    filter: 'blur(18px)',
                  }}
                />
                <GlassCard className="flex h-full flex-col p-7">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    style={{
                      background:
                        'linear-gradient(160deg, rgba(var(--accent-rgb),0.16), rgba(var(--accent-rgb),0.05))',
                    }}
                  />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-mono text-[13px] font-semibold tracking-[0.2em]">
                        {p.when}
                      </span>
                      <span className="bg-accent/15 text-accent flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.14em]">
                        <span className="pulse-dot bg-accent inline-block h-1.5 w-1.5 rounded-full" />
                        {p.state}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-[20px] font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                      {p.body}
                    </p>
                  </div>
                </GlassCard>
              </div>
            ) : (
              <GlassCard key={p.when} className="flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white/45">
                    {p.when}
                  </span>
                  <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-white/40">
                    {p.state}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[20px] font-semibold text-white/85">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/50">
                  {p.body}
                </p>
              </GlassCard>
            ),
          )}
        </div>
      </div>

      <motion.p
        variants={rise}
        className="mt-10 max-w-2xl text-[14px] leading-relaxed text-white/45"
      >
        What stays out: dependency, secrets, and static code scanning. Those are
        real, but they belong before deploy, in tools built for them. BoLD lives
        in the request path, where the failures actually happen.
      </motion.p>
    </Section>
  )
}
