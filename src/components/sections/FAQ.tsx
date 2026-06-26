import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Section } from '@/components/ui/section'
import { EASE, rise } from '@/lib/motion'

type QA = { q: string; a: ReactNode }

const FAQS: QA[] = [
  {
    q: 'Isn’t this just a WAF or firewall?',
    a: (
      <>
        No. A firewall blocks traffic that matches known-bad patterns. BoLD
        watches something a firewall cannot see: whether a real, logged-in user
        just reached a record they do not own. It never blocks anything. It
        tells you, with proof, the moment ownership breaks.{' '}
        <Link to="/blog/alarm-not-scanner" className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-soft hover:decoration-accent/60">
          Why an alarm, not a scanner
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Won’t it cry wolf on data we share on purpose?',
    a: (
      <>
        No, and that is the hard part we built for. Doctors, support agents,
        teammates, and admins all have a real path to that access, and BoLD
        stays quiet on every one of them. It speaks only when access succeeds
        with no grant behind it, the case where the ownership check was simply
        missing.{' '}
        <Link to="/blog/an-alarm-you-can-trust" className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-soft hover:decoration-accent/60">
          How it tells the difference
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Will it add latency or risk to my app?',
    a: (
      <>
        No. Reporting is fire-and-forget and out of the hot path. Your handler
        runs exactly as before and the response goes back untouched. If BoLD is
        ever slow or down, your app does not notice. It is read-only and never
        proxies a request.{' '}
        <Link to="/#install" className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-soft hover:decoration-accent/60">
          See how it plugs in
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Do you store our users’ data?',
    a: (
      <>
        No. BoLD reads metadata only: who called, which object, and whether they
        owned it. Never the request body, never a token, never the contents. We
        make you safer without becoming the place a breach comes from.{' '}
        <Link to="/blog/what-bold-sees" className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-soft hover:decoration-accent/60">
          What BoLD sees, and never keeps
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Can’t Row-Level Security or our framework already do this?',
    a: (
      <>
        RLS is the fix, and you should use it. It is also exactly the check that
        goes missing or misconfigured when a leak happens, and nothing tells you
        when it silently fails in production. BoLD is the alarm for that gap.
        They work together.
      </>
    ),
  },
  {
    q: 'How is this different from Datadog, Sentry, or Cloudflare?',
    a: (
      <>
        Those watch for errors, performance, and traffic. A broken-access leak
        throws none of those: it returns a clean <code>200 OK</code> with no
        error and no anomaly. BoLD knows who owns each record, so it sees the
        one thing tools without that context cannot.{' '}
        <Link to="/compare" className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-soft hover:decoration-accent/60">
          The full comparison
        </Link>
        .
      </>
    ),
  },
]

function Item({ q, a }: QA) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      variants={rise}
      className="glass-soft overflow-hidden rounded-2xl"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:px-7"
      >
        <span className="font-display text-[16px] font-medium text-white md:text-[18px]">
          {q}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`grid h-7 w-7 flex-none place-items-center rounded-full ${
            open ? 'bg-accent/20 text-accent' : 'bg-white/8 text-white/55'
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-6 pr-10 text-[14.5px] leading-relaxed text-white/60 md:px-7 md:pr-16">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <Section index="12" eyebrow="STRAIGHT ANSWERS">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        The questions a security lead actually asks.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        No dodging. Here is exactly what BoLD is, what it touches, and what it
        will never do.
      </motion.p>

      <div className="mt-10 grid gap-3">
        {FAQS.map((f) => (
          <Item key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </Section>
  )
}
