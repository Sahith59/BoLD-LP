import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'

/**
 * The BoLD creature — obsidian glass companion. Floats, breathes, gaze-tracks
 * the cursor, and sits in a small lens that refracts the real background behind
 * it. Lightweight (one transparent PNG, no extra WebGL).
 */
export function BoldBot() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const ry = useSpring(useTransform(mx, [-1, 1], [-16, 16]), {
    stiffness: 110,
    damping: 16,
  })
  const rx = useSpring(useTransform(my, [-1, 1], [12, -12]), {
    stiffness: 110,
    damping: 16,
  })

  useEffect(() => {
    if (reduce) return
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduce, mx, my])

  return (
    <motion.div
      className="pointer-events-none fixed bottom-2 right-2 z-30 h-[180px] w-[180px] md:bottom-4 md:right-4 md:h-[240px] md:w-[240px]"
      style={{ perspective: 700 }}
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
    >
      {/* amber aura, breathing with the alarm ring */}
      <motion.div
        className="absolute inset-[14%] -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(232,163,61,0.30), rgba(232,163,61,0.06) 58%, transparent 76%)',
        }}
        animate={reduce ? {} : { opacity: [0.5, 1, 0.5], scale: [0.9, 1.07, 0.9] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* refraction lens — bends + lifts the real background behind the bot */}
      <div
        className="absolute inset-[8%] rounded-full"
        style={{
          backdropFilter:
            'url(#liquid-glass) blur(5px) saturate(135%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(5px) saturate(135%) brightness(1.05)',
          WebkitMaskImage:
            'radial-gradient(closest-side, #000 48%, transparent 80%)',
          maskImage: 'radial-gradient(closest-side, #000 48%, transparent 80%)',
        }}
      />

      {/* gaze wrapper — tilts toward the cursor */}
      <motion.div className="h-full w-full" style={{ rotateX: rx, rotateY: ry }}>
        {/* float + breathe */}
        <motion.img
          src="/bot/bold-bot.png"
          alt="BoLD"
          draggable={false}
          className="h-full w-full select-none object-contain drop-shadow-[0_22px_38px_rgba(0,0,0,0.7)]"
          animate={reduce ? {} : { y: [0, -8, 0], scale: [1, 1.018, 1] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
