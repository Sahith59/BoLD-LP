'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'motion/react'
import { cn } from '@/lib/utils'
import { rise } from '@/lib/motion'

const MAX_TILT = 4 // degrees of lean toward the cursor

type GlassCardProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode
}

/**
 * Layered refractive glass slab. The body and the edge rim are separate
 * backdrop-filter layers (siblings, not nested), so the browser composites both:
 * the rim, masked to the perimeter, makes every edge bend the real background
 * behind it. Leans slightly toward the cursor so it reads as a physical slab.
 */
export function GlassCard({ className, children, ...props }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const sx = useSpring(px, { stiffness: 140, damping: 18 })
  const sy = useSpring(py, { stiffness: 140, damping: 18 })

  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT])
  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT])

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  function onLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      variants={rise}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="glass-slab rounded-3xl"
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      {...props}
    >
      <span aria-hidden className="glass-slab-body" />
      <span aria-hidden className="glass-slab-rim" />
      <span aria-hidden className="glass-slab-sheen" />
      <div className={cn('relative z-[1]', className)}>{children}</div>
    </motion.div>
  )
}
