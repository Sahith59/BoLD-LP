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
      <motion.h1
        variants={rise}
        className="max-w-5xl bg-gradient-to-b from-white to-white/55 bg-clip-text font-display text-[24px] font-semibold leading-[1.1] tracking-[-0.015em] text-transparent md:text-[36px]"
      >
        One of your users can read another&apos;s private data.
        <br className="hidden sm:block" /> Right now. You&apos;d never know.
      </motion.h1>

      <motion.p
        variants={rise}
        className="mt-6 max-w-4xl text-[15px] leading-relaxed text-white/65 md:text-base"
      >
        It starts with the most common flaw in AI-built apps. Your app checks
        that someone is logged in, but never checks that the data they&apos;re
        asking for is actually theirs. So one user changes a number in a URL,
        and your app hands back a stranger&apos;s record. It is invisible until
        the day it isn&apos;t, and it has caused real breaches at companies
        you&apos;ve heard of.
      </motion.p>

      <motion.p
        variants={rise}
        className="mt-4 max-w-4xl text-[15px] leading-relaxed text-white/65 md:text-base"
      >
        BoLD catches it. Not a scanner running once a week from outside, but a
        live alarm sitting in the request path, watching every request the
        moment a real user makes it. When someone reaches data they don&apos;t
        own, you know instantly, with the exact proof and the fix in plain
        English. And it never touches your real users&apos; data to do it.
      </motion.p>

      {/* Positioning line — names the category so it never reads single-bug */}
      <motion.p
        variants={rise}
        className="mt-6 max-w-3xl font-display text-[17px] font-medium leading-snug text-white/80 md:text-[19px]"
      >
        <span className="text-white">
          The live alarm for access violations in AI-built apps.
        </span>{' '}
        It catches the break-in as it happens, not in next week&apos;s report.
      </motion.p>

      <motion.div variants={rise} className="mt-6">
        <AccentButton onClick={onCta}>Get early access</AccentButton>
      </motion.div>

      <motion.p
        variants={rise}
        className="mt-3.5 font-mono text-[11px] tracking-[0.12em] text-white/40"
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
