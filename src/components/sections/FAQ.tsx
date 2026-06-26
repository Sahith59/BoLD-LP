import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Section } from '@/components/ui/section'
import { EASE, rise } from '@/lib/motion'

const LINK =
  'text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-soft hover:decoration-accent/60'

function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.9em] text-white/85">{children}</span>
}

type QA = { cat: string; q: string; a: ReactNode }

const FAQS: QA[] = [
  {
    cat: 'Positioning',
    q: 'Is this a WAF, a scanner, or an IDS? Be specific.',
    a: (
      <>
        None of them, and the difference is the whole point. A WAF matches
        request payloads against attack signatures. A scanner probes for known
        patterns before you ship. An IDS watches packets on the wire. A broken
        authorization request defeats all three at once: it carries a valid
        session, hits a real route, and returns a clean <Mono>200 OK</Mono>.
        There is no signature, no payload anomaly, nothing on the network. BoLD
        evaluates the one thing none of them can reach: at the moment the
        response leaves your app, did the user who made the request actually own
        the object it handed back.
      </>
    ),
  },
  {
    cat: 'Detection',
    q: 'How do you know what “owned” means without me labeling every endpoint?',
    a: (
      <>
        You tell BoLD once, in the cheapest place to say it: the caller identity
        your code already resolves. From there BoLD compares that identity
        against the owner on the object your handler returns. No machine
        learning, no thirty-day “baseline,” no training on your traffic. The
        ownership rule is explicit, which is exactly why a BoLD alert is a fact
        and not a probability. Ship a new endpoint tomorrow and the same rule
        holds on its first request: who asked, what came back, and whether the
        two were ever linked.
      </>
    ),
  },
  {
    cat: 'Signal',
    q: 'Every runtime tool buries us in alerts. Why is this one different?',
    a: (
      <>
        Because BoLD fires on a fact, not a feeling. Anomaly detection alerts on
        things that look unusual, and unusual is mostly noise wearing a
        confidence score. BoLD speaks only when an object’s owner did not match
        the caller, which is either true or it is not. Legitimately shared data
        carries a real grant, and a grant is not a mismatch, so the support
        agent, the admin, and the teammate on a shared record never trip it.
        There is no sensitivity dial to babysit. If it fires, a real request
        returned someone else’s record, and every alert is worth reading.{' '}
        <Link to="/blog/an-alarm-you-can-trust" className={LINK}>
          How it separates the two
        </Link>
        .
      </>
    ),
  },
  {
    cat: 'Trust',
    q: 'You sit in our request path. Why aren’t you just our next breach?',
    a: (
      <>
        Because BoLD never holds the thing worth stealing. It reads three
        fields, the caller id, the object reference, and the owner, and never
        the body, the token, or the record’s contents. Reporting happens out of
        band and fire-and-forget, so if BoLD is slow or down your response still
        returns untouched, byte for byte. It cannot block, modify, or proxy a
        request, even by accident. A tool that hoards your payloads becomes the
        richest target you own. BoLD is deliberately the opposite: the smallest
        footprint that can still tell you the truth.{' '}
        <Link to="/blog/what-bold-sees" className={LINK}>
          What it sees, and never keeps
        </Link>
        .
      </>
    ),
  },
  {
    cat: 'versus RLS',
    q: 'We run Postgres Row-Level Security. Doesn’t that already cover this?',
    a: (
      <>
        RLS is the right fix, and it is also precisely what is missing the day
        you get breached. It fails in ways that never raise an error: a
        service-role key that bypasses every policy, a new table shipped before
        anyone wrote one, a join in application code that reads around the row
        filter, an <Mono>OR</Mono> in a policy that is wider than its author
        thought. Nothing tells you the check stopped running. BoLD is the smoke
        detector for that silence. It does not replace RLS. It tells you the
        night a route slipped out from under it.
      </>
    ),
  },
  {
    cat: 'versus APM',
    q: 'We already have Datadog and Sentry. Won’t they catch it?',
    a: (
      <>
        They catch failures. This is a success. A broken-access leak is a{' '}
        <Mono>200 OK</Mono> with normal latency and no exception, the
        healthiest-looking line in your logs. Datadog sees a fast, happy
        endpoint. Sentry sees nothing at all, because nothing threw. Your
        dashboards stay green while a stranger reads a customer’s record. Those
        tools tell you when your app breaks. BoLD tells you when your app works
        perfectly for the wrong person.{' '}
        <Link to="/compare" className={LINK}>
          The full comparison
        </Link>
        .
      </>
    ),
  },
]

function Item({
  cat,
  q,
  a,
  index,
  defaultOpen,
}: QA & { index: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <motion.div
      variants={rise}
      className={`glass-soft overflow-hidden rounded-2xl transition-colors ${
        open ? 'bg-white/[0.05]' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 px-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:gap-6 md:px-7 md:py-6"
      >
        <span className="mt-1 font-mono text-[12px] tabular-nums text-white/30">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1">
          <span className="text-accent/80 block font-mono text-[10px] uppercase tracking-[0.24em]">
            {cat}
          </span>
          <span className="mt-2 block font-display text-[17px] font-medium leading-snug text-white md:text-[20px]">
            {q}
          </span>
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full ${
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
            <p className="border-accent/30 ml-9 mr-5 mb-6 border-l-2 pl-4 text-[14.5px] leading-relaxed text-white/65 md:ml-[3.4rem] md:mr-12 md:text-[15px]">
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
    <Section index="12" eyebrow="THE HARD QUESTIONS">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        The ones a security lead actually asks.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        No soft questions, no dodging. Here is exactly what BoLD is, what it
        touches, and the line it will never cross.
      </motion.p>

      <div className="mt-10 grid gap-3">
        {FAQS.map((f, i) => (
          <Item key={f.q} {...f} index={i} defaultOpen={i === 0} />
        ))}
      </div>
    </Section>
  )
}
