import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { rise, container } from '@/lib/motion'

type Rival = {
  id: string
  name: string
  link?: { label: string; url: string }
  whatItIs: string
  goodAt: string
  differ: string
}

const RIVALS: Rival[] = [
  {
    id: 'vibeeval',
    name: 'VibeEval',
    link: { label: 'vibe-eval.com', url: 'https://vibe-eval.com/' },
    whatItIs:
      'An autonomous agent that probes your running app like an attacker and ships each finding with a reproducible exploit.',
    goodAt:
      'Broad coverage: keys, RLS, auth bypass, CORS, IDOR, headers. It proves findings with a captured request, and it genuinely tests for ownership bugs too. It is a strong tool.',
    differ:
      'VibeEval attacks your app to see what breaks, on demand or on a loop. BoLD watches real users and fires when an actual production request returns someone else’s data. One simulates an attacker; the other judges what really happened to a real person. They are complementary: run VibeEval before launch, run BoLD in production for the violation that slips through anyway.',
  },
  {
    id: 'scanners',
    name: 'Pre-launch scanners',
    link: { label: 'vibeappscanner.com', url: 'https://vibeappscanner.com/' },
    whatItIs: 'A low-cost scan that returns a fix list before you ship.',
    goodAt:
      'A fast sanity check before launch. Good value for catching the obvious things early, with almost no setup.',
    differ:
      'It is a point-in-time checkup against your deployed URL. It is not in the path of live traffic, and it is not watching when a real user hits the bug next Tuesday. BoLD lives in the request path, continuously.',
  },
  {
    id: 'pentest',
    name: 'Pentest / human audit',
    whatItIs: 'A deep expert manual review of your application.',
    goodAt:
      'Depth, creativity, and the business-logic flaws a tool will miss. Nothing replaces a sharp human for a one-time deep look.',
    differ:
      'It is a snapshot in time, and expensive to repeat. BoLD is continuous and automatic on the one family it covers, every day, on every request.',
  },
  {
    id: 'platform',
    name: 'Platform built-in scans',
    link: { label: 'lovable.dev', url: 'https://lovable.dev/' },
    whatItIs:
      'A free check the platform runs before you publish (Lovable’s pre-publish scan, and similar).',
    goodAt:
      'Catching the obvious before you ship, at no cost, with zero setup. A genuinely useful guardrail for first-time builders.',
    differ:
      'It runs at build time, on that platform only, and (as the Lovable incidents show) the builder can ignore it and ship anyway. BoLD runs on your live app regardless of how it was built.',
  },
]

export function ComparePage() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-6 pb-32 pt-32 md:pt-40">
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div variants={rise}>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-white/40 transition-colors hover:text-white/70"
          >
            <span
              aria-hidden
              className="transition-transform group-hover:-translate-x-0.5"
            >
              ←
            </span>
            BACK TO BoLD
          </Link>
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-8 font-mono text-[11px] tracking-[0.32em] text-white/45"
        >
          THE HONEST MAP
        </motion.div>
        <motion.h1
          variants={rise}
          className="mt-4 font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[48px]"
        >
          How BoLD is different.
          <br />
          Honestly.
        </motion.h1>
        <motion.p
          variants={rise}
          className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base"
        >
          There are good tools for AI-app security. Most of them scan or probe
          your app and hand you a report. BoLD does one specific thing none of
          them do: it watches your real production traffic and judges whether a
          real user just touched data they do not own. Here is the honest map of
          where each tool fits, including what the others do well.
        </motion.p>
      </motion.div>

      <div className="relative mt-14">
        <DriftingLight />
        <div className="relative space-y-5">
        {RIVALS.map((r) => (
          <GlassCard
            key={r.id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
            className="p-7 md:p-9"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="font-display text-[21px] font-semibold tracking-[-0.01em] text-white md:text-[25px]">
                BoLD <span className="text-white/35">vs</span> {r.name}
              </h2>
              {r.link && (
                <a
                  href={r.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.08em] text-white/45 underline decoration-white/15 underline-offset-4 transition-colors hover:text-white/75 hover:decoration-white/50"
                >
                  {r.link.label}
                  <span aria-hidden className="text-[10px]">
                    ↗
                  </span>
                </a>
              )}
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-white/50">
              {r.whatItIs}
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-white/35">
                  WHAT THEY’RE GOOD AT
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/65">
                  {r.goodAt}
                </p>
              </div>
              <div className="md:border-accent/25 md:border-l md:pl-5">
                <div className="text-accent/80 font-mono text-[10px] tracking-[0.22em]">
                  WHERE BoLD DIFFERS
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/80">
                  {r.differ}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
        </div>
      </div>

      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-10% 0px' }}
        className="glass-refract mt-14 rounded-3xl p-8 md:p-10"
      >
        <p className="text-[16px] leading-relaxed text-white/75 md:text-[18px]">
          Most tools answer{' '}
          <span className="text-white/55">“could this app be broken?”</span>{' '}
          BoLD answers{' '}
          <span className="text-white">
            “did a real user just get data that was not theirs?”
          </span>{' '}
          Run the scanners before launch. Run BoLD in production. They are not
          the same job.
        </p>
        <Link
          to="/"
          className="group mt-6 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] text-white/70 underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white/50"
        >
          BACK TO BoLD
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
