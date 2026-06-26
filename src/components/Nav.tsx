import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { AccentLink } from '@/components/ui/accent-button'
import { appUrl } from '@/lib/config'
import { EASE } from '@/lib/motion'

const CHAPTERS = [
  {
    n: '01',
    label: 'The flaw',
    to: '/#flaw',
    desc: 'Change one number, read a stranger’s data.',
  },
  {
    n: '02',
    label: 'What BoLD catches',
    to: '/#catches',
    desc: 'The whole access-violation family.',
  },
  {
    n: '03',
    label: 'Alarm vs scanner',
    to: '/#alarm',
    desc: 'Why runtime, not a periodic scan.',
  },
  {
    n: '04',
    label: 'The promise',
    to: '/#promise',
    desc: 'Metadata only, never your data.',
  },
]
const LINKS = [
  { label: 'Incidents', to: '/incidents' },
  { label: 'Compare', to: '/compare' },
  { label: 'Blog', to: '/blog' },
]

function Hamburger() {
  return (
    <span className="relative block h-3.5 w-[18px]">
      <span className="absolute left-0 top-0 h-[1.5px] w-full rounded bg-current" />
      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded bg-current" />
      <span className="absolute bottom-0 left-0 h-[1.5px] w-full rounded bg-current" />
    </span>
  )
}

function Logo({ onHome }: { onHome: () => void }) {
  return (
    <Link
      to="/"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        onHome()
      }}
      className="group flex flex-none select-none items-center gap-[3px] font-display text-[20px] font-semibold leading-none tracking-tight text-white transition-transform duration-200 hover:scale-[1.04] md:text-[22px]"
      aria-label="BoLD home"
    >
      <span>B</span>
      <span className="relative mx-[1px] inline-flex h-[15px] w-[15px] translate-y-[1px] items-center justify-center">
        <span className="border-accent absolute inset-0 rounded-full border-[1.6px] transition-shadow duration-300 group-hover:shadow-[0_0_14px_rgba(var(--accent-rgb),0.85)]" />
        <span className="pulse-dot bg-accent h-[5px] w-[5px] rounded-full" />
      </span>
      <span>LD</span>
    </Link>
  )
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
}

/** Full-screen refractive glass menu: the chapters as glass cards, then the
 *  pages and CTA. One component for desktop and mobile. */
function FullMenu({
  open,
  onClose,
  onCta,
}: {
  open: boolean
  onClose: () => void
  onCta: () => void
}) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => closeRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  function trapTab(e: ReactKeyboardEvent) {
    if (e.key !== 'Tab') return
    const root = panelRef.current
    if (!root) return
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    )
    if (!nodes.length) return
    const first = nodes[0]!
    const last = nodes[nodes.length - 1]!
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onKeyDown={trapTab}
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {/* frosted glass backdrop, click to dismiss */}
          <div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: 'rgba(6,6,9,0.74)',
              backdropFilter: 'blur(26px) saturate(130%)',
              WebkitBackdropFilter: 'blur(26px) saturate(130%)',
            }}
          />

          <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col px-6 pb-10 pt-5 md:px-8">
            <div className="flex flex-none items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.3em] text-white/40">
                HOW IT WORKS
              </span>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close menu"
                className="glass-soft flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{ position: 'relative' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-8">
              <motion.div
                className="grid gap-4 sm:grid-cols-2"
                initial={reduce ? false : 'hidden'}
                animate={reduce ? false : 'show'}
                variants={reduce ? undefined : gridVariants}
              >
                {CHAPTERS.map((c) => (
                  <Link key={c.to} to={c.to} onClick={onClose} className="group block">
                    <GlassCard className="flex items-start gap-5 p-6 md:p-7">
                      <span className="text-accent/70 font-mono text-[12px] tracking-[0.1em]">
                        {c.n}
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-[20px] font-semibold leading-snug text-white md:text-[23px]">
                          {c.label}
                        </div>
                        <div className="mt-1.5 text-[14px] leading-snug text-white/55">
                          {c.desc}
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className="ml-auto -translate-x-1 self-center text-[16px] text-white/30 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-white/70 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </GlassCard>
                  </Link>
                ))}
              </motion.div>
            </div>

            <div className="flex flex-none flex-col items-center gap-6 border-t border-white/10 pt-7 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-6">
                {LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={onClose}
                    className="font-mono text-[12px] tracking-[0.16em] text-white/55 transition-colors hover:text-white"
                  >
                    {l.label.toUpperCase()}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onCta()
                  }}
                  className="font-mono text-[12px] tracking-[0.16em] text-white/55 transition-colors hover:text-white"
                >
                  GET UPDATES
                </button>
                <AccentLink href={appUrl('menu')} onClick={onClose}>
                  Try the beta
                </AccentLink>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Nav({
  onCta,
  onHome,
}: {
  onCta: () => void
  onHome: () => void
}) {
  const { scrollY } = useScroll()
  const barOpacity = useTransform(scrollY, [0, 90], [0, 1])
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const lastFocus = useRef<HTMLElement | null>(null)

  const openMenu = () => {
    lastFocus.current = document.activeElement as HTMLElement
    setMenuOpen(true)
  }
  const closeMenu = () => {
    setMenuOpen(false)
    requestAnimationFrame(() => lastFocus.current?.focus())
  }

  // Close on navigation.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  // Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll while the menu is open.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const isActive = (to: string) => location.pathname === to
  const linkBase =
    'rounded-full px-3.5 py-2 text-[13.5px] transition-colors hover:text-white'

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-40"
      >
        <motion.div
          aria-hidden
          style={{ opacity: barOpacity }}
          className="pointer-events-none absolute inset-0 border-b border-white/10 bg-black/35 backdrop-blur-xl"
        />

        <div className="relative flex w-full items-center justify-between px-5 py-4 md:px-8">
          <Logo onHome={onHome} />

          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={openMenu}
              className={`text-white/70 ${linkBase}`}
            >
              How it works
            </button>
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`${linkBase} ${isActive(l.to) ? 'text-white' : 'text-white/70'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-none items-center gap-3">
            <AccentLink
              href={appUrl('nav')}
              className="hidden px-5 py-2.5 text-[13px] md:inline-flex"
            >
              Try the beta
            </AccentLink>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={openMenu}
              className="glass-soft flex h-9 w-9 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:hidden"
              style={{ position: 'relative' }}
            >
              <Hamburger />
            </button>
          </div>
        </div>
      </motion.header>

      <FullMenu open={menuOpen} onClose={closeMenu} onCta={onCta} />
    </>
  )
}
