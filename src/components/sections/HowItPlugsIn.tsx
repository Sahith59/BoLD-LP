import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Eye, Gauge, FileCheck2, Lock } from 'lucide-react'
import { Section } from '@/components/ui/section'
import { GlassPanel } from '@/components/ui/glass-panel'
import { GlassCard } from '@/components/ui/glass-card'
import { rise } from '@/lib/motion'

// The four load-bearing trust claims. Each is literally true of the shipped
// SDK, so each is safe to state plainly. They are guarantees of restraint
// (out of the hot path, read-only, metadata-only), never of blocking.
const GUARANTEES = [
  {
    icon: Eye,
    label: 'Metadata only',
    body: 'BoLD sees who called, which object, and the owner field. Never a request body, never a token, never your users’ data.',
  },
  {
    icon: Gauge,
    label: 'Out of the hot path',
    body: 'Reporting is fire-and-forget. If BoLD is ever slow or down, your response returns untouched and on time. BoLD can never break or slow your app.',
  },
  {
    icon: FileCheck2,
    label: 'Never alters your response',
    body: 'Your handler runs exactly as before. The response goes back byte for byte.',
  },
  {
    icon: Lock,
    label: 'Read-only',
    body: 'BoLD only observes. It never modifies, blocks, or proxies a single request.',
  },
]

// Honest status labels: nothing reads as shipped when it is not.
const ADAPTERS: {
  status: string
  tone: 'now' | 'soon' | 'later'
  items: string[]
}[] = [
  {
    status: 'Available now',
    tone: 'now',
    items: ['Next.js SDK wrapper', 'One global header · any stack'],
  },
  {
    status: 'Coming',
    tone: 'soon',
    items: ['Supabase connector', 'SDK for any framework'],
  },
  {
    status: 'Exploring',
    tone: 'later',
    items: ['Edge / DNS hook', 'Reverse proxy'],
  },
]

const TONE: Record<string, string> = {
  now: 'text-accent',
  soon: 'text-white/55',
  later: 'text-white/40',
}
const DOT: Record<string, string> = {
  now: 'bg-accent',
  soon: 'bg-white/45',
  later: 'bg-white/25',
}

function CodeLine({ children }: { children: ReactNode }) {
  return <div className="whitespace-pre">{children}</div>
}

export function HowItPlugsIn() {
  return (
    <Section id="install" index="08" eyebrow="HOW IT PLUGS IN">
      <motion.h2
        variants={rise}
        className="max-w-2xl font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-white md:text-[40px]"
      >
        A few lines in your app. BoLD watches the rest.
      </motion.h2>
      <motion.p
        variants={rise}
        className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base"
      >
        Add the <span className="text-white/80">@bold/next</span> wrapper to an
        API route, or set one global header with no code change. BoLD sees your
        real traffic and raises the alarm the instant one user can reach another
        user’s data.
      </motion.p>

      {/* The "few lines" proof: the real wrapper API */}
      <GlassPanel className="mt-10 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="font-mono text-[11px] tracking-[0.18em] text-white/45">
            app/api/orders/[id]/route.ts
          </span>
          <span className="bg-accent/15 text-accent rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.16em]">
            DROP-IN
          </span>
        </div>
        <div className="space-y-1 px-5 py-6 font-mono text-[12.5px] leading-[1.7] md:px-7 md:text-[13px]">
          <CodeLine>
            <span className="text-accent">import</span>
            <span className="text-white/80"> {'{ withBold }'} </span>
            <span className="text-accent">from</span>
            <span className="text-white/60"> "@bold/next"</span>
            <span className="text-white/40">;</span>
          </CodeLine>
          <CodeLine>{' '}</CodeLine>
          <CodeLine>
            <span className="text-accent">export const</span>
            <span className="text-white/85"> GET </span>
            <span className="text-white/40">= </span>
            <span className="text-white/85">withBold</span>
            <span className="text-white/40">(</span>
          </CodeLine>
          <CodeLine>
            <span className="text-white/40">{'  '}async (req, ctx) =&gt; {'{'}</span>
          </CodeLine>
          <CodeLine>
            <span className="text-white/35">
              {'    '}/* your handler, unchanged */
            </span>
          </CodeLine>
          <CodeLine>
            <span className="text-white/40">{'  }'},</span>
          </CodeLine>
          <CodeLine>
            <span className="text-white/40">
              {'  { '}resolveCallerId: (req) =&gt; getUserId(req){' }'},
            </span>
            <span className="text-white/30">
              {' '}// who’s calling, so own-access is never flagged
            </span>
          </CodeLine>
          <CodeLine>
            <span className="text-white/40">);</span>
          </CodeLine>
        </div>
      </GlassPanel>

      {/* The four guarantees */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {GUARANTEES.map((g) => (
          <GlassCard key={g.label} className="flex gap-4 p-6">
            <span className="bg-accent/12 text-accent grid h-10 w-10 flex-none place-items-center rounded-xl">
              <g.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <div className="font-display text-[15px] font-semibold text-white">
                {g.label}
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">
                {g.body}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Breadth, labeled honestly */}
      <motion.div
        variants={rise}
        className="glass-soft mt-5 rounded-3xl px-6 py-7 md:px-8"
      >
        <div className="font-mono text-[10px] tracking-[0.28em] text-white/40">
          WAYS BoLD CONNECTS
        </div>
        <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-3">
          {ADAPTERS.map((a) => (
            <div key={a.status}>
              <div
                className={`flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.16em] ${TONE[a.tone]}`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${DOT[a.tone]}`}
                />
                {a.status.toUpperCase()}
              </div>
              <ul className="mt-3 space-y-2">
                {a.items.map((it) => (
                  <li
                    key={it}
                    className={`text-[13.5px] leading-snug ${
                      a.tone === 'now' ? 'text-white/80' : 'text-white/45'
                    }`}
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 border-t border-white/8 pt-5 text-[13.5px] leading-relaxed text-white/50">
          Every connection method hands BoLD the same metadata and runs the same
          decision engine, so the trust never changes. Only where BoLD sits in
          your stack.
        </p>
      </motion.div>

      <motion.p
        variants={rise}
        className="mt-8 max-w-2xl text-[14px] leading-relaxed text-white/45"
      >
        BoLD only ever watches and tells you.{' '}
        <span className="text-white/75">
          It is an alarm, not a firewall, and never blocks a request.
        </span>
      </motion.p>
    </Section>
  )
}
