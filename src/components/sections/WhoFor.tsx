import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { rise } from '@/lib/motion'

const CHIPS = [
  'Funded startups · 5–20 devs, real users',
  'MSSPs',
  'Security & engineering leads',
]

export function WhoFor() {
  return (
    <Section index="07" eyebrow="WHO IT’S FOR">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        For the people with something to lose.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        Not hobby projects, and not a $9 scanner. BoLD is for the person who owns
        both the security and the code, and feels it when a breach turns into a
        liability with a dollar figure.
      </motion.p>

      <motion.div variants={rise} className="mt-10 flex flex-wrap gap-3">
        {CHIPS.map((c) => (
          <span
            key={c}
            className="glass-soft rounded-full px-5 py-2.5 text-[14px] text-white/80"
          >
            {c}
          </span>
        ))}
      </motion.div>

      <motion.p
        variants={rise}
        className="mt-8 max-w-2xl text-[14px] leading-relaxed text-white/45"
      >
        No fake logo walls. No “trusted by 10,000 companies.” We’re pre-launch.
        We’d rather earn the first ten teams who’d be genuinely upset if we
        disappeared.
      </motion.p>
    </Section>
  )
}
