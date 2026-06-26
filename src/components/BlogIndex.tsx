import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { posts, formatDate } from '@/lib/blog'
import { rise, container } from '@/lib/motion'

const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export function BlogIndex() {
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
          FIELD NOTES
        </motion.div>
        <motion.h1
          variants={rise}
          className="mt-4 font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[48px]"
        >
          The BoLD blog.
        </motion.h1>
        <motion.p
          variants={rise}
          className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base"
        >
          Plain-spoken writing on runtime security: how broken authorization
          actually breaks, breakdowns of the real incidents, and what AI-coded
          apps leak by default.
        </motion.p>
      </motion.div>

      <div className="relative mt-14">
        <DriftingLight />
        <motion.div
          className="relative space-y-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
          variants={listStagger}
        >
          {posts.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
              <GlassCard className="p-7 md:p-8">
                <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-white/40">
                  <span>{formatDate(p.date)}</span>
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span>{p.readingMinutes} min read</span>
                </div>
                <h2 className="mt-4 font-display text-[22px] font-semibold leading-snug tracking-[-0.01em] text-white md:text-[26px]">
                  {p.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                  {p.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-white/55"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="text-accent/90 ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em]">
                    READ
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
