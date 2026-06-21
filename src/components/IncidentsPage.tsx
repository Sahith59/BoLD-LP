import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { INCIDENTS } from '@/content/incidents'
import { rise, container } from '@/lib/motion'

export function IncidentsPage() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-6 pb-32 pt-32 md:pt-40">
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div variants={rise}>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-white/40 transition-colors hover:text-white/70"
          >
            <span
              aria-hidden
              className="transition-transform group-hover:-translate-x-0.5"
            >
              ←
            </span>
            BACK TO BoLD
          </Link>
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-8 font-mono text-[11px] tracking-[0.32em] text-white/45"
        >
          THE RECEIPTS
        </motion.div>
        <motion.h1
          variants={rise}
          className="mt-4 font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[48px]"
        >
          It’s already happening.
          <br />
          Here are the receipts.
        </motion.h1>
        <motion.p
          variants={rise}
          className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base"
        >
          Every case below is a real, publicly reported incident. We link the
          primary sources so you can verify each one. The pattern is identical
          every time: the app confirmed the user was logged in, but never
          checked whether the data belonged to them.
        </motion.p>
      </motion.div>

      <div className="relative mt-14">
        <DriftingLight />
        <div className="relative space-y-5">
        {INCIDENTS.map((inc) => (
          <div key={inc.id} id={inc.id} className="scroll-mt-28">
          <GlassCard
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
            className="p-7 md:p-9"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-white md:text-[26px]">
                {inc.name}
              </h2>
              <span className="font-mono text-[11px] tracking-[0.18em] text-white/40">
                {inc.date}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-accent font-display text-[34px] font-semibold leading-none tracking-[-0.02em] tabular-nums md:text-[42px]">
                {inc.stat}
              </span>
              <span className="text-[14px] text-white/55">{inc.statLabel}</span>
            </div>

            <div className="mt-6">
              <div className="font-mono text-[10px] tracking-[0.22em] text-white/35">
                HOW IT HAPPENED
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/65 md:text-[15px]">
                {inc.how}
              </p>
            </div>

            {inc.note && (
              <p className="mt-4 border-l-2 border-white/15 pl-3.5 text-[13px] italic leading-relaxed text-white/45">
                {inc.note}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/8 pt-5">
              <span className="font-mono text-[10px] tracking-[0.22em] text-white/35">
                SOURCES
              </span>
              {inc.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-white/75 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
                >
                  {s.label}
                  <span aria-hidden className="text-[11px]">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </GlassCard>
          </div>
        ))}
        </div>
      </div>

      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-10% 0px' }}
        className="glass-refract mt-14 rounded-3xl p-8 md:p-10"
      >
        <p className="text-[16px] leading-relaxed text-white/75 md:text-[18px]">
          Different companies, different industries, the same root cause every
          time. An app that checks if you are logged in but not whether the data
          is yours.{' '}
          <span className="text-white">
            BoLD watches the live request for exactly this, and proves it the
            moment it happens, without ever touching real user data.
          </span>
        </p>
        <Link
          to="/"
          className="group mt-6 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] text-white/70 underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white/50"
        >
          BACK TO BoLD
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
