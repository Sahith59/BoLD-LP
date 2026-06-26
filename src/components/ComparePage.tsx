import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Check, Minus, X } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { DriftingLight } from '@/components/ui/drifting-light'
import { rise, container } from '@/lib/motion'

// ---- Capability matrix -----------------------------------------------------
// Every claim below is conservative and sourced in the detail cards. The point
// is not "BoLD wins every column"; it is that every tool is strong somewhere,
// and only BoLD holds all four at once.

type Cell = 'yes' | 'partial' | 'no'

const CAPS: { short: string; long: string }[] = [
  { short: 'Live prod traffic', long: 'Watches real requests in production, not a test target.' },
  {
    short: 'Object ownership',
    long: 'Knows user A does not own object 105, from your data, not a pattern.',
  },
  {
    short: 'Single violation',
    long: 'Fires on one real violation, with no attack pattern or volume needed.',
  },
  {
    short: 'Drop-in deploy',
    long: 'A small team can ship it without an enterprise rollout.',
  },
]

const MATRIX: { tool: string; cells: Cell[]; self?: boolean }[] = [
  { tool: 'BoLD', cells: ['yes', 'yes', 'yes', 'yes'], self: true },
  { tool: 'WAF & API gateway', cells: ['yes', 'no', 'no', 'partial'] },
  { tool: 'API security platforms', cells: ['yes', 'partial', 'no', 'no'] },
  { tool: 'RASP & IAST', cells: ['yes', 'partial', 'partial', 'no'] },
  { tool: 'API contract firewall', cells: ['yes', 'no', 'no', 'partial'] },
  { tool: 'SAST', cells: ['no', 'no', 'no', 'yes'] },
  { tool: 'DAST & API scanners', cells: ['no', 'partial', 'no', 'partial'] },
  { tool: 'Pentest & bug bounty', cells: ['no', 'yes', 'no', 'no'] },
  { tool: 'APM & error monitoring', cells: ['yes', 'no', 'no', 'yes'] },
  { tool: 'Authorization tooling & RLS', cells: ['yes', 'yes', 'no', 'partial'] },
]

function Mark({ v }: { v: Cell }) {
  if (v === 'yes')
    return (
      <Check className="text-accent mx-auto h-4 w-4" strokeWidth={2.6} />
    )
  if (v === 'partial')
    return <Minus className="mx-auto h-4 w-4 text-white/45" strokeWidth={2.6} />
  return <X className="mx-auto h-3.5 w-3.5 text-white/20" strokeWidth={2.4} />
}

function CapabilityMatrix() {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      className="glass-refract mt-14 overflow-hidden rounded-3xl p-5 md:p-7"
    >
      <div className="text-accent/80 font-mono text-[10px] tracking-[0.28em]">
        THE ONE SLOT BoLD FILLS
      </div>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/60">
        Every tool here is genuinely good at something. Only BoLD holds all four
        of these at once, which is the exact gap a quiet ownership leak slips
        through.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[660px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 pr-3 font-mono text-[10px] font-normal tracking-[0.14em] text-white/40">
                TOOL
              </th>
              {CAPS.map((c) => (
                <th
                  key={c.short}
                  className="px-3 py-3 text-center font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-white/40"
                >
                  {c.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) => (
              <tr
                key={row.tool}
                className={`border-b border-white/[0.06] ${
                  row.self ? 'bg-accent/[0.07]' : ''
                }`}
              >
                <td
                  className={`py-3.5 pr-3 text-[13.5px] ${
                    row.self
                      ? 'text-accent font-semibold'
                      : 'text-white/75'
                  }`}
                >
                  {row.tool}
                </td>
                {row.cells.map((c, i) => (
                  <td key={i} className="px-3 py-3.5 text-center">
                    <Mark v={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/8 pt-5 font-mono text-[10px] tracking-[0.1em] text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <Check className="text-accent h-3.5 w-3.5" strokeWidth={2.6} /> YES
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Minus className="h-3.5 w-3.5 text-white/45" strokeWidth={2.6} /> PARTIAL
        </span>
        <span className="inline-flex items-center gap-1.5">
          <X className="h-3 w-3 text-white/20" strokeWidth={2.4} /> NO
        </span>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-2 text-[12.5px] leading-relaxed text-white/45 sm:grid-cols-2">
        {CAPS.map((c) => (
          <div key={c.short}>
            <dt className="inline font-medium text-white/65">{c.short}. </dt>
            <dd className="inline">{c.long}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  )
}

// ---- Detail cards ----------------------------------------------------------

type Rival = {
  id: string
  name: string
  link?: { label: string; url: string }
  whatItIs: string
  goodAt: string
  differ: string
}

type Group = { id: string; title: string; blurb: string; rivals: Rival[] }

const GROUPS: Group[] = [
  {
    id: 'preship',
    title: 'Before you ship',
    blurb:
      'Point-in-time checks that hunt for the bug before real users arrive. Worth running. None of them are watching on a live Tuesday.',
    rivals: [
      {
        id: 'sast',
        name: 'SAST',
        link: { label: 'semgrep.dev', url: 'https://semgrep.dev/' },
        whatItIs:
          'Static analysis (Snyk Code, Semgrep, Checkmarx) that reads your source before you ship and flags risky patterns.',
        goodAt:
          'Catching injection, hardcoded secrets, and known-insecure functions early, right in the pull request, with easy CI setup.',
        differ:
          'Broken object-level authorization is a logic and data problem, not a syntax one. Whether user A owns invoice 105 cannot be read from the source, only from a real request against real data. Static analysis is excellent before the code runs. BoLD watches what happens after it does.',
      },
      {
        id: 'dast',
        name: 'DAST & API scanners',
        link: {
          label: 'stackhawk.com',
          url: 'https://www.stackhawk.com/blog/understanding-and-protecting-against-api1-broken-object-level-authorization/',
        },
        whatItIs:
          'Tools that probe a running target with crafted requests (Burp Suite, OWASP ZAP, StackHawk) and, with the right setup, can find some IDOR and BOLA.',
        goodAt:
          'Confirming exploitable issues against a deployed app. With two test accounts configured, a scanner or an extension like Burp’s Autorize can replay one user’s requests as another and surface object-level holes.',
        differ:
          'That is a point-in-time test against test accounts, run before launch or on a schedule, not on your real users’ live traffic. It finds the bug if you aim it there. BoLD watches every real request continuously and catches the violation the day an actual customer triggers it.',
      },
      {
        id: 'pentest',
        name: 'Pentest & bug bounty',
        link: { label: 'hackerone.com', url: 'https://www.hackerone.com/' },
        whatItIs:
          'Skilled humans reviewing your app, on a contract (a pentest) or a running program (HackerOne, Bugcrowd).',
        goodAt:
          'Depth, creativity, and business-logic flaws a tool will miss. IDOR is one of the most reported bug-bounty categories precisely because humans are so good at it. Nothing replaces a sharp human for a deep look.',
        differ:
          'It is a snapshot, scoped and expensive to repeat, and you learn at report time, which can be long after the bug went live. BoLD is continuous and automatic on the one family it covers, on every request, the moment it happens.',
      },
      {
        id: 'vibeeval',
        name: 'VibeEval',
        link: { label: 'vibe-eval.com', url: 'https://vibe-eval.com/' },
        whatItIs:
          'An autonomous agent that probes your running app like an attacker and ships each finding with a reproducible exploit.',
        goodAt:
          'Broad coverage: keys, RLS, auth bypass, CORS, IDOR, headers. It proves findings with a captured request and genuinely tests for ownership bugs too. A strong tool.',
        differ:
          'VibeEval attacks your app to see what breaks, on demand or on a loop. BoLD watches real users and fires when an actual production request returns someone else’s data. One simulates an attacker; the other judges what really happened to a real person. Run VibeEval before launch, run BoLD in production for the violation that slips through anyway.',
      },
      {
        id: 'scanners',
        name: 'Pre-launch scanners',
        link: { label: 'vibeappscanner.com', url: 'https://vibeappscanner.com/' },
        whatItIs: 'A low-cost scan that returns a fix list before you ship.',
        goodAt:
          'A fast sanity check before launch, good value for catching the obvious things early, with almost no setup.',
        differ:
          'It is a point-in-time checkup against your deployed URL. It is not in the path of live traffic, and it is not watching when a real user hits the bug next Tuesday. BoLD lives in the request path, continuously.',
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
          'It runs at build time, on that platform only, and the builder can ignore it and ship anyway. BoLD runs on your live app regardless of how it was built.',
      },
    ],
  },
  {
    id: 'runtime',
    title: 'Watching at runtime',
    blurb:
      'Tools that sit in or beside live traffic. These are the closest neighbors, and where the real distinction lives.',
    rivals: [
      {
        id: 'waf',
        name: 'WAFs & API gateways',
        link: {
          label: 'developers.cloudflare.com',
          url: 'https://developers.cloudflare.com/api-shield/security/bola-vulnerability-detection/',
        },
        whatItIs:
          'A layer in front of your API (Cloudflare API Shield, AWS WAF, Kong) that blocks malicious payloads, validates schemas, and rate-limits abuse.',
        goodAt:
          'Stopping injection, bots, and volumetric attacks at the edge, and flagging enumeration. Cloudflare can label endpoints where a session pulls far more unique records than the baseline.',
        differ:
          'A WAF reads the request, not your data, so it cannot know that invoice 105 belongs to someone else. Cloudflare’s BOLA labels are statistical: they need an endpoint to have seen at least 10,000 sessions and look for enumeration or parameter pollution, so a quiet single violation slips through. BoLD decides per request from your ownership data and fires on the first one.',
      },
      {
        id: 'apisec',
        name: 'API security platforms',
        link: { label: 'salt.security', url: 'https://salt.security/' },
        whatItIs:
          'Enterprise platforms (Salt Security, Traceable, Noname) that discover every API, mirror traffic, and use behavioral models to detect attacks including BOLA.',
        goodAt:
          'Full API inventory across a large estate, and catching attacker reconnaissance by baselining behavior across enormous call volumes over time. For a big organization, this is serious, capable security.',
        differ:
          'Their BOLA detection is behavioral and probabilistic: it watches API behavior over days, weeks, or months to spot an attack pattern, and it is built for enterprise scale and budgets. BoLD makes a deterministic ownership decision on a single request, deploys as a drop-in SDK, and is built for the team shipping an AI-coded app, not a security operations center.',
      },
      {
        id: 'rasp',
        name: 'RASP & IAST',
        link: {
          label: 'contrastsecurity.com',
          url: 'https://www.contrastsecurity.com/',
        },
        whatItIs:
          'A runtime agent instrumented inside your app (Contrast Security) that watches execution and can detect, and sometimes block, attacks in real time, including some broken access control.',
        goodAt:
          'Deep visibility from inside the running app across many vulnerability classes at once: injection, deserialization, and access-control checks, without a separate scan. A strong enterprise AppSec platform.',
        differ:
          'RASP is a broad, agent-based platform built for enterprise AppSec teams and the full OWASP spectrum. BoLD does one thing on purpose: it judges object ownership on live requests and hands you the violation in plain English with a one-line fix, as a drop-in with a metadata-only footprint. Different scope, different audience.',
      },
      {
        id: 'apifirewall',
        name: 'API contract firewalls',
        link: {
          label: '42crunch.com',
          url: 'https://42crunch.com/how-to-protect-apis-from-owasp-authorization-risks-bola-bopla-bfla/',
        },
        whatItIs:
          'A runtime firewall (42Crunch), deployed as a sidecar or gateway, that enforces your OpenAPI contract: schema conformance, token validation, and rate limits.',
        goodAt:
          'Locking an API to its contract with sub-millisecond latency, rejecting anything that does not match the schema, and auditing your OpenAPI definition for authorization-risky patterns before you ship.',
        differ:
          'Object ownership is not in your schema. A request for invoice 105 with a valid token and a well-formed shape conforms to the contract perfectly, so the firewall passes it. BoLD checks the thing a contract cannot encode: whether the caller actually owns what came back.',
      },
      {
        id: 'apm',
        name: 'APM & error monitoring',
        link: { label: 'datadoghq.com', url: 'https://www.datadoghq.com/' },
        whatItIs:
          'Observability for performance and failures (Datadog, Sentry, New Relic): traces, latency, errors, and crashes in production.',
        goodAt:
          'Telling you the instant your app slows down or throws, with the context to debug it fast. Essential operational visibility.',
        differ:
          'A broken-access leak is a success, not a failure. It returns a clean 200 OK with normal latency and no exception, so it never shows up on an APM dashboard. BoLD is built to see exactly the request these tools are designed to treat as healthy.',
      },
    ],
  },
  {
    id: 'enforce',
    title: 'Enforcing authorization',
    blurb:
      'How you prevent the bug in the first place. BoLD is how you know that prevention actually held, everywhere.',
    rivals: [
      {
        id: 'authz',
        name: 'Authorization libraries',
        link: { label: 'openfga.dev', url: 'https://openfga.dev/' },
        whatItIs:
          'Frameworks and services (Oso, OpenFGA, Cerbos, Permit.io) that let you define and enforce who can access what, with a policy engine your code calls on each request.',
        goodAt:
          'Centralizing authorization out of your business logic and enforcing it cleanly. Used well, they are exactly how you stop these bugs from existing.',
        differ:
          'They enforce the check your code remembers to call. The leak happens at the endpoint that never called them, or the query that read around them, and a policy engine cannot flag the route that never asked it a question. BoLD watches the response itself, so it catches the gap whether or not any check ran. Use them to enforce; use BoLD to verify enforcement actually happened.',
      },
      {
        id: 'rls',
        name: 'Database RLS',
        link: {
          label: 'supabase.com/docs',
          url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
        },
        whatItIs:
          'Row-level security policies in the database (Postgres, Supabase) that scope every query to the current user, so the data layer enforces ownership.',
        goodAt:
          'When every policy is correct, it is the strongest place to enforce ownership, because it covers every query by default. The right foundation.',
        differ:
          'RLS fails silently: a service-role key bypasses every policy, a new table ships without one, an application-layer join reads around the row filter. Nothing raises an error when it stops covering a route. BoLD is the smoke detector for that silence, and tells you the night a route slipped out from under it.',
      },
    ],
  },
]

function RivalCard({ r }: { r: Rival }) {
  return (
    <GlassCard
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      className="p-7 md:p-9"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em] text-white md:text-[24px]">
          BoLD <span className="text-white/35">vs</span> {r.name}
        </h3>
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
  )
}

export function ComparePage() {
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-6 pb-32 pt-32 md:pt-40">
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
          The app security market is full of good tools, and you probably run a
          few already. Almost all of them scan or probe your app and hand you a
          report, or watch for outages and attacks at scale. BoLD does one
          specific thing none of them do on its own: it watches your real
          production traffic and judges whether a real user just touched data
          they do not own. Here is the honest map of where every category fits,
          what each is genuinely good at, and the exact line where BoLD is
          different.
        </motion.p>
      </motion.div>

      <CapabilityMatrix />

      <div className="relative mt-16">
        <DriftingLight />
        <div className="relative space-y-12">
          {GROUPS.map((g) => (
            <div key={g.id}>
              <motion.div
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-12% 0px' }}
                className="mb-5"
              >
                <div className="text-accent/70 font-mono text-[10px] tracking-[0.3em]">
                  {g.title.toUpperCase()}
                </div>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/45">
                  {g.blurb}
                </p>
              </motion.div>
              <div className="space-y-5">
                {g.rivals.map((r) => (
                  <RivalCard key={r.id} r={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-10% 0px' }}
        className="glass-refract mt-16 rounded-3xl p-8 md:p-10"
      >
        <p className="text-[16px] leading-relaxed text-white/75 md:text-[18px]">
          Most tools answer{' '}
          <span className="text-white/55">“could this app be broken?”</span>{' '}
          BoLD answers{' '}
          <span className="text-white">
            “did a real user just get data that was not theirs?”
          </span>{' '}
          Run the scanners before launch. Enforce with RLS and a policy engine.
          Then run BoLD in production for the violation that slips through
          anyway. They are not the same job.
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
