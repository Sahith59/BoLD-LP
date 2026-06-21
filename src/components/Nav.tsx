import { motion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { EASE } from '@/lib/motion'

// Swap this to change the top-right tagline.
const TAGLINE = 'CATCHES THE BREAK-IN, LIVE'

export function Nav({
  onCta,
  onHome,
}: {
  onCta: () => void
  onHome: () => void
}) {
  // Tagline belongs to the opening screen only. Fade it out as the hero
  // scrolls away so it never floats over the content below.
  const { scrollY } = useScroll()
  const taglineOpacity = useTransform(scrollY, [80, 320], [1, 0])

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="flex w-full items-center justify-between px-5 py-4 md:px-8">
        {/* Logo — far left, the 'o' is the live alarm */}
        <Link
          to="/"
          onClick={(e) => {
            // let cmd/ctrl/shift-click open a new tab; otherwise scroll home
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            e.preventDefault()
            onHome()
          }}
          className="group flex select-none items-center gap-[3px] font-display text-[20px] font-semibold leading-none tracking-tight text-white transition-transform duration-200 hover:scale-[1.04] md:text-[22px]"
          aria-label="BoLD home"
        >
          <span>B</span>
          <span className="relative mx-[1px] inline-flex h-[15px] w-[15px] translate-y-[1px] items-center justify-center">
            <span className="border-accent absolute inset-0 rounded-full border-[1.6px] transition-shadow duration-300 group-hover:shadow-[0_0_14px_rgba(var(--accent-rgb),0.85)]" />
            <span className="pulse-dot bg-accent h-[5px] w-[5px] rounded-full" />
          </span>
          <span>LD</span>
        </Link>

        {/* Tagline + CTA — far right */}
        <div className="flex items-center gap-5 md:gap-7">
          <motion.span
            style={{ opacity: taglineOpacity }}
            className="pointer-events-none hidden font-mono text-[10px] tracking-[0.32em] text-white/45 md:block"
          >
            {TAGLINE}
          </motion.span>
          <button
            onClick={onCta}
            className="glass-soft rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.24em] text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            EARLY ACCESS
          </button>
        </div>
      </div>
    </motion.header>
  )
}
