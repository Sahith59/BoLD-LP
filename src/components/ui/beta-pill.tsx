import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * "Beta is live" status badge in refractive amber liquid glass (the .beta-pill
 * surface refracts the live background through #liquid-glass). The dot emits a
 * radar-ping to read as a live signal; the ping is dropped under reduced motion.
 */
export function BetaPill({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <span
      className={cn(
        'beta-pill relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5',
        className,
      )}
    >
      <span className="text-accent relative z-[1] flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.22em]">
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          {!reduce && (
            <motion.span
              aria-hidden
              className="bg-accent absolute inset-0 rounded-full"
              style={{ filter: 'blur(1.5px)' }}
              animate={{ opacity: [0.45, 0.95, 0.45], scale: [1, 1.7, 1] }}
              transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
            />
          )}
          <span
            className="bg-accent relative block h-1.5 w-1.5 rounded-full"
            style={{ boxShadow: '0 0 8px rgba(var(--accent-rgb),0.9)' }}
          />
        </span>
        BETA IS LIVE
      </span>
    </span>
  )
}
