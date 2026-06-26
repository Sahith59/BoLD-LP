import { motion } from 'motion/react'
import BoldLogo3D from '@/components/BoldLogo3D'
import { AccentButton } from '@/components/ui/accent-button'
import { container, rise } from '@/lib/motion'

/** The hero hook copy + CTA. */
function HeroCopy({ onCta }: { onCta: () => void }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center px-6 pb-12 pt-[42vh] text-center"
    >
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

      <motion.div variants={rise} className="mt-12">
        <AccentButton onClick={onCta}>Get early access</AccentButton>
      </motion.div>

      <motion.p
        variants={rise}
        className="mt-7 font-mono text-[11px] tracking-[0.12em] text-white/40"
      >
        Pre-launch · onboarding a first group of funded startups &amp; MSSPs ·
        test accounts only
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
        <BoldLogo3D gradientCanvas={gradientCanvas} />
      </div>

      {/* Soft readability halo behind the copy. Fades out well before the top
          and bottom edges, so there is no visible band / fold / seam. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[100svh] bg-[radial-gradient(72%_46%_at_50%_64%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.18)_46%,transparent_72%)]" />

      <HeroCopy onCta={onCta} />
    </section>
  )
}
