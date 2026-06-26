import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { rise } from '@/lib/motion'

const CHIPS = [
  'Solo founders to funded teams',
  'Apps built fast, with or without AI',
  'MSSPs & agencies protecting clients',
  'Anything holding PII, payments, or private data',
]

export function WhoFor() {
  return (
    <Section index="10" eyebrow="WHO IT’S FOR">
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
        Team of one or team of fifty. Code you wrote by hand or generated in an
        afternoon. None of it changes the math: the moment your app holds data
        that belongs to someone else, a single missing ownership check is all
        that stands between a normal day and a breach with your name on it. BoLD
        watches for that exact moment, live, so it never becomes your story.
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
        No fake logo walls. No “trusted by 10,000 companies.” We’re early, and
        we’d rather earn the first teams who’d be genuinely upset if we
        disappeared than chase a number.
      </motion.p>
    </Section>
  )
}
