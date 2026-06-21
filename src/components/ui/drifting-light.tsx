import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Faint warm + cool glows that drift behind a group of glass cards, so every
 * refractive edge shimmers with movement instead of going static over the dark
 * background. Self-contained: respects reduced-motion on its own. Drop it as the
 * first child of a `relative` wrapper, with the cards in a `relative` layer above.
 */
export function DriftingLight({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]',
        className,
      )}
    >
      <motion.div
        className="absolute left-[8%] top-[14%] h-[78%] w-[46%] rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,238,205,0.5), transparent 72%)',
          filter: 'blur(64px)',
        }}
        animate={
          reduce ? {} : { x: ['-14%', '34%', '-14%'], y: ['-10%', '20%', '-10%'] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[6%] right-[6%] h-[66%] w-[42%] rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(214,226,255,0.34), transparent 72%)',
          filter: 'blur(72px)',
        }}
        animate={
          reduce ? {} : { x: ['12%', '-28%', '12%'], y: ['8%', '-18%', '8%'] }
        }
        transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
