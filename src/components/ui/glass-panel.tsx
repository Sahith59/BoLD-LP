import * as React from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'
import { rise } from '@/lib/motion'

type GlassPanelProps = HTMLMotionProps<'div'> & {
  as?: 'div'
  /** 'frost' = classic frosted glass, 'refract' = clear refractive glass */
  variant?: 'frost' | 'refract'
}

/** Liquid-glass surface for content cards. Reveals on scroll. */
export function GlassPanel({
  className,
  children,
  variant = 'frost',
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      variants={rise}
      className={cn(
        variant === 'refract' ? 'glass-refract' : 'glass-panel',
        'rounded-3xl',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
