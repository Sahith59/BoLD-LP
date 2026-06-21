import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { container } from '@/lib/motion'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string
  index?: string
}

/** A full-width landing section with a centered, max-width inner column. */
export function Section({
  className,
  children,
  eyebrow,
  index,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn('relative z-10 px-6 py-24 md:py-32', className)}
      {...props}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
        className="mx-auto w-full max-w-6xl"
      >
        {(eyebrow || index) && (
          <div className="mb-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.32em] text-white/45">
            {index && <span className="text-white/30">{index}</span>}
            {index && <span className="h-px w-6 bg-white/20" />}
            {eyebrow && <span>{eyebrow}</span>}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  )
}
