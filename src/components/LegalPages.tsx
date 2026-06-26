import { useEffect, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { rise, container } from '@/lib/motion'

// Simple, honest starting-point legal pages. Replace the placeholder contact
// address, and have a lawyer review before you rely on these.
const CONTACT = 'privacy@yourdomain.com'
const UPDATED = 'June 2026'

function LegalShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    document.title = `${title} · BoLD`
  }, [title])

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
          {eyebrow}
        </motion.div>
        <motion.h1
          variants={rise}
          className="mt-4 font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[44px]"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={rise}
          className="mt-3 font-mono text-[11px] tracking-[0.16em] text-white/35"
        >
          LAST UPDATED · {UPDATED.toUpperCase()}
        </motion.p>

        <motion.div variants={rise} className="mt-10">
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 font-display text-[20px] font-semibold text-white">
      {children}
    </h2>
  )
}
function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-[15px] leading-relaxed text-white/65">{children}</p>
  )
}
function LI({ children }: { children: ReactNode }) {
  return (
    <li className="mt-2 text-[15px] leading-relaxed text-white/65">
      {children}
    </li>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell eyebrow="THE FINE PRINT" title="Privacy">
      <P>
        This policy covers the BoLD marketing website and the early-access
        signup on it. The beta product has its own privacy terms, shown when you
        sign in. We build a security product, and we hold ourselves to the same
        restraint here: collect the minimum, keep it safe, never sell it.
      </P>

      <H2>What we collect</H2>
      <ul>
        <LI>
          Your email address, when you join the early-access list or ask to be
          notified about general availability.
        </LI>
        <LI>
          Aggregate, cookieless analytics (page views and referrers) if
          analytics is enabled. No cross-site tracking, no advertising profiles.
        </LI>
      </ul>
      <P>That is all. We do not ask for more than we need to reach you.</P>

      <H2>How we use it</H2>
      <ul>
        <LI>To email you about early access, the beta, and general availability.</LI>
        <LI>To understand, in aggregate, how the site is used and improve it.</LI>
      </ul>
      <P>We do not sell or rent your data to anyone.</P>

      <H2>Who processes it for us</H2>
      <P>
        We use a small set of providers purely to run the service: an email
        delivery provider to send the messages you signed up for, a hosting
        provider to serve the site, and a privacy-friendly analytics provider.
        Each receives only what it needs to do its job.
      </P>

      <H2>Your choices</H2>
      <P>
        You can unsubscribe from any email we send. You can ask us to show you
        the data we hold about you, or to delete it, at any time, by emailing{' '}
        <a
          href={`mailto:${CONTACT}`}
          className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent-soft"
        >
          {CONTACT}
        </a>
        . We will act on it.
      </P>

      <H2>Retention</H2>
      <P>
        We keep your email only while it is useful for the purpose you gave it
        for, or until you ask us to remove it, whichever comes first.
      </P>

      <H2>Changes</H2>
      <P>
        If this policy changes in a meaningful way, we will update the date
        above. Continued use of the site after a change means you accept it.
      </P>
    </LegalShell>
  )
}

export function TermsPage() {
  return (
    <LegalShell eyebrow="THE FINE PRINT" title="Terms">
      <P>
        These terms govern your use of the BoLD marketing website. The beta
        product is governed by its own terms, presented when you sign in.
      </P>

      <H2>Use of the site</H2>
      <P>
        You may read, share, and link to this site freely. Please do not attempt
        to disrupt it, scrape it abusively, or use it to break the law. We may
        change or remove content at any time.
      </P>

      <H2>The beta</H2>
      <P>
        Access to the beta is offered at our discretion and may change as the
        product evolves. Signing up for early access does not guarantee access
        on any particular timeline.
      </P>

      <H2>Intellectual property</H2>
      <P>
        The BoLD name, the content, and the design of this site are ours. You
        may quote or reference them with attribution, but not pass them off as
        your own.
      </P>

      <H2>No warranty</H2>
      <P>
        The site is provided as is, without warranties of any kind. To the
        extent the law allows, we are not liable for any loss arising from your
        use of it.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these terms? Email{' '}
        <a
          href={`mailto:${CONTACT}`}
          className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent-soft"
        >
          {CONTACT}
        </a>
        .
      </P>
    </LegalShell>
  )
}
