import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { AccentLink } from '@/components/ui/accent-button'
import { BetaPill } from '@/components/ui/beta-pill'
import { appUrl } from '@/lib/config'
import { container, rise } from '@/lib/motion'

// The 3D wordmark pulls in Three.js and R3F, the heaviest part of the page.
// Lazy-load it so the hero copy paints immediately and the glass fades in after.
const BoldLogo3D = lazy(() => import('@/components/BoldLogo3D'))

/** The hero hook copy + CTA. */
function HeroCopy({ onCta }: { onCta: () => void }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center px-6 pb-12 pt-[42vh] text-center"
    >
      <motion.div variants={rise} className="mb-5">
        <BetaPill />
      </motion.div>

      <motion.div
        variants={rise}
        className="mb-5 font-mono text-[11px] tracking-[0.34em] text-white/45"
      >
        RUNTIME ASSURANCE FOR AI-CODED APPS
      </motion.div>

      <motion.h1
        variants={rise}
        className="max-w-5xl bg-gradient-to-b from-white to-white/55 bg-clip-text font-display text-[24px] font-semibold leading-[1.1] tracking-[-0.015em] text-transparent md:text-[36px]"
      >
        One of your users can read another&apos;s private data.
        <br className="hidden sm:block" /> Right now. You&apos;d never know.
      </motion.h1>

      <motion.p
        variants={rise}
        className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-white/70 md:text-[17px]"
      >
        Your app confirms users are logged in. It never confirms the data is
        theirs. BoLD lives in the request path and fires the moment someone
        reaches what they don&apos;t own, with proof and the one-line fix. It
        reads how data is accessed, never what&apos;s inside it.
      </motion.p>

      {/* Positioning line — the scanner contrast, our sharpest sentence */}
      <motion.p
        variants={rise}
        className="mt-6 max-w-3xl font-display text-[17px] font-medium leading-snug text-white/80 md:text-[19px]"
      >
        Scanners tell you what{' '}
        <span className="text-white/50">could go wrong</span>.{' '}
        <span className="text-white">BoLD tells you what just went wrong.</span>
      </motion.p>

      <motion.div
        variants={rise}
        className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
      >
        <AccentLink href={appUrl('hero')}>
          Try the beta
          <span aria-hidden className="text-[15px]">
            →
          </span>
        </AccentLink>
        <button
          type="button"
          onClick={onCta}
          className="inline-flex items-center rounded-full border border-white/15 px-6 py-3.5 text-[15px] text-white/80 transition-colors hover:border-white/30 hover:text-white"
        >
          Get launch updates
        </button>
      </motion.div>

      <motion.p
        variants={rise}
        className="mt-7 font-mono text-[11px] tracking-[0.12em] text-white/40"
      >
        Live beta · test accounts only · a free check on your own app
      </motion.p>
    </motion.div>
  )
}

export function Hero({
  gradientCanvas,
  onCta,
  reduce: _reduce,
}: {
  gradientCanvas: HTMLCanvasElement | null
  onCta: () => void
  reduce: boolean | null
}) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Live 3D glass wordmark — fills the first viewport */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[100svh]">
        <Suspense fallback={null}>
          <BoldLogo3D gradientCanvas={gradientCanvas} />
        </Suspense>
      </div>

      {/* Soft readability halo behind the copy. Fades out well before the top
          and bottom edges, so there is no visible band / fold / seam. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[100svh] bg-[radial-gradient(72%_46%_at_50%_64%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.18)_46%,transparent_72%)]" />

      <HeroCopy onCta={onCta} />
    </section>
  )
}
