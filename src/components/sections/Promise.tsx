import { motion } from 'motion/react'
import { Section } from '@/components/ui/section'
import { GlassPanel } from '@/components/ui/glass-panel'
import { rise } from '@/lib/motion'

export function Promise() {
  return (
    <Section id="promise" index="07" eyebrow="THE PROMISE">
      <GlassPanel className="px-7 py-14 text-center md:px-16 md:py-20">
        <motion.div
          variants={rise}
          className="font-mono text-[10px] tracking-[0.3em] text-accent"
        >
          INSPECT BEHAVIOR, NOT CONTENT
        </motion.div>
        <motion.blockquote
          variants={rise}
          className="mx-auto mt-7 max-w-3xl font-display text-[23px] font-medium leading-[1.32] tracking-[-0.01em] text-white md:text-[32px]"
        >
          To catch the theft, we sit where the data flows, so we made sure we
          never keep it. BoLD reads the <span className="text-white">pattern</span>{' '}
          of access: who touched which record, and whether they owned it. Never
          what’s inside it.
        </motion.blockquote>
        <motion.p
          variants={rise}
          className="mx-auto mt-7 max-w-xl text-[14.5px] leading-relaxed text-white/55"
        >
          Metadata, not your users’ data. Redacted before it’s processed. Test
          accounts only. We make you safer without becoming the place a breach
          comes from.
        </motion.p>
      </GlassPanel>
    </Section>
  )
}
