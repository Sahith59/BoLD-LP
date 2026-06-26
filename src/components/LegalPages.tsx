import { useEffect, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { COMPANY } from '@/lib/config'
import { rise, container } from '@/lib/motion'

// Substantive starting-point legal pages, published under the BoLD brand only.
// They name the real subprocessors and real rights so they hold up to scrutiny.
// Set VITE_LEGAL_JURISDICTION once chosen, and have a lawyer review before you
// rely on these for compliance.

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
          EFFECTIVE · {COMPANY.effectiveDate.toUpperCase()}
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
    <h2 className="mt-11 font-display text-[20px] font-semibold text-white">
      {children}
    </h2>
  )
}
function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-[15px] leading-relaxed text-white/65">{children}</p>
  )
}
function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="marker:text-accent/40 mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-white/65">
      {children}
    </ul>
  )
}
const linkCls =
  'text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:text-accent-soft'
function In({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={linkCls}>
      {children}
    </Link>
  )
}
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {children}
    </a>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell eyebrow="THE FINE PRINT" title="Privacy">
      <P>
        This Privacy Policy explains how {COMPANY.name} (“{COMPANY.name}”, “we”,
        “us”) handles personal information collected through this website,
        including the early-access and contact forms on it. The {COMPANY.name}{' '}
        product has its own privacy terms, shown when you sign in to the app. We
        are a security company, and we apply the same discipline to your data
        that we apply to the product: collect the minimum, name everyone who
        touches it, and never sell it.
      </P>

      <H2>1. Information we collect</H2>
      <P>Information you give us:</P>
      <UL>
        <li>Your email address, when you join our email list for launch updates.</li>
        <li>
          Your name (optional), email address, and message, when you use the
          contact form.
        </li>
      </UL>
      <P>Information collected automatically:</P>
      <UL>
        <li>
          Aggregate, cookieless analytics: page views, referring sites,
          approximate region, and device or browser type. This uses no cookies,
          does not track you across other sites, and builds no advertising
          profile.
        </li>
        <li>
          Standard server logs, including your IP address and user agent, kept
          briefly to run the site, prevent abuse, and apply rate limiting.
        </li>
      </UL>
      <P>
        We do not use advertising cookies, third-party trackers, or
        fingerprinting.
      </P>

      <H2>2. How we use it, and our legal basis</H2>
      <UL>
        <li>
          <span className="text-white/85">
            To send the early-access updates you asked for, and to reply to your
            messages.
          </span>{' '}
          Basis: your consent, and our legitimate interest in responding to you.
        </li>
        <li>
          <span className="text-white/85">
            To operate, secure, and debug the site, including preventing abuse.
          </span>{' '}
          Basis: our legitimate interest in a working, safe site.
        </li>
        <li>
          <span className="text-white/85">
            To understand, in aggregate, how the site is used.
          </span>{' '}
          Basis: our legitimate interest, with no profiling of individuals.
        </li>
      </UL>

      <H2>3. Who processes data for us</H2>
      <P>
        We keep this list short by design. Each provider receives only what it
        needs:
      </P>
      <UL>
        <li>
          <span className="text-white/85">Resend</span>, our email provider,
          receives your email address (and your name and message, if you use the
          contact form) to deliver the emails you asked for. See its{' '}
          <Ext href="https://resend.com/legal/privacy-policy">
            privacy policy
          </Ext>
          .
        </li>
        <li>
          <span className="text-white/85">Cloudflare</span>, our hosting and
          analytics provider, processes site requests and produces the
          aggregate, cookieless analytics above. See its{' '}
          <Ext href="https://www.cloudflare.com/privacypolicy/">
            privacy policy
          </Ext>
          .
        </li>
      </UL>
      <P>
        We do not sell or rent your personal information, and we do not share it
        for advertising. We may disclose information if the law requires it, or
        to protect the rights, safety, or security of our users or the public.
      </P>

      <H2>4. International transfers</H2>
      <P>
        Our providers may process data in the United States and other countries.
        Where required, we rely on appropriate safeguards, such as the standard
        contractual clauses, for those transfers.
      </P>

      <H2>5. How long we keep it</H2>
      <UL>
        <li>
          Early-access email: until you unsubscribe or ask us to remove it, or
          until we retire the list.
        </li>
        <li>
          Contact messages: up to 24 months after we have resolved your request,
          then deleted.
        </li>
        <li>Server logs: a short rolling window, typically no more than 30 days.</li>
        <li>Analytics: aggregate, and not tied to you as an individual.</li>
      </UL>

      <H2>6. Your rights</H2>
      <P>
        Depending on where you live, you have some or all of these rights over
        your personal information:
      </P>
      <UL>
        <li>Access a copy of what we hold.</li>
        <li>Correct anything inaccurate.</li>
        <li>Delete it.</li>
        <li>Restrict or object to certain processing.</li>
        <li>Receive it in a portable format.</li>
        <li>
          Withdraw consent at any time, without affecting processing already
          carried out.
        </li>
      </UL>
      <P>
        If you are in the EEA or the UK (GDPR), all of the above apply, and you
        may also lodge a complaint with your local data protection authority. If
        you are in California (CCPA and CPRA), you have the right to know,
        delete, and correct your information, and to opt out of its sale or
        sharing. We do not sell or share your personal information, so there is
        nothing to opt out of, and we will never discriminate against you for
        exercising a right. To exercise any right, reach us through our{' '}
        <In to="/contact">contact page</In>. We respond within 30 days.
      </P>

      <H2>7. How we protect it</H2>
      <P>
        We collect little, and we guard what we collect. Data is encrypted in
        transit, access is limited to what is necessary, and we minimize what we
        retain so that we are never an attractive target. No method of
        transmission or storage is perfectly secure, but a small footprint is
        the strongest protection there is, and it is the one we lead with.
      </P>

      <H2>8. Children</H2>
      <P>
        This site is not directed to children under 16, and we do not knowingly
        collect their personal information. If you believe a child has given us
        data, contact us and we will delete it.
      </P>

      <H2>9. Changes</H2>
      <P>
        If we make a material change to this policy, we will update the date
        above and, where appropriate, notify you. Continuing to use the site
        after a change means you accept the updated policy.
      </P>

      <H2>10. Contact</H2>
      <P>
        Questions, or want to exercise a right? Reach us through our{' '}
        <In to="/contact">contact page</In>.
      </P>
    </LegalShell>
  )
}

export function TermsPage() {
  const gov = COMPANY.jurisdiction
    ? `These Terms are governed by the laws of ${COMPANY.jurisdiction}, without regard to its conflict-of-laws rules, and you agree to the exclusive jurisdiction of its courts.`
    : `These Terms are governed by the laws applicable where ${COMPANY.name} is established, without regard to conflict-of-laws rules.`

  return (
    <LegalShell eyebrow="THE FINE PRINT" title="Terms">
      <P>
        These Terms of Service govern your use of the {COMPANY.name} website.
        They do not cover the {COMPANY.name} product or beta, which is governed
        by a separate agreement presented when you sign in to the app. By using
        this site, you agree to these Terms.
      </P>

      <H2>1. Who may use the site</H2>
      <P>
        You may use this site if you can form a binding contract in your
        jurisdiction and are not barred from doing so under applicable law.
      </P>

      <H2>2. The beta and early access</H2>
      <P>
        Access to the {COMPANY.name} beta is offered at our discretion. We may
        change, limit, or discontinue it at any time, and joining our
        email list does not guarantee access on any particular timeline,
        or at all. Information on this site about the product is provided for
        general guidance and may change as the product evolves.
      </P>

      <H2>3. Acceptable use</H2>
      <P>When using this site, you agree not to:</P>
      <UL>
        <li>
          disrupt or overload it, or attempt to gain unauthorized access to it
          or its underlying systems;
        </li>
        <li>
          scrape or harvest it through automated means beyond ordinary,
          well-behaved indexing;
        </li>
        <li>
          probe, scan, or test the vulnerability of the site, except as part of
          a program we have explicitly invited you into;
        </li>
        <li>use it to break the law or to infringe anyone’s rights;</li>
        <li>misrepresent your affiliation with {COMPANY.name}.</li>
      </UL>

      <H2>4. Intellectual property</H2>
      <P>
        The {COMPANY.name} name, the content, the copy, and the design of this
        site are owned by {COMPANY.name} or its licensors and are protected by
        intellectual property laws. We grant you a limited, personal,
        non-exclusive license to view and share the site for your own
        information. You may quote or reference our content with attribution,
        but you may not copy it wholesale, resell it, or pass it off as your own.
        If you send us feedback or suggestions, you grant us a non-exclusive,
        royalty-free, perpetual license to use them, with no obligation to you.
      </P>

      <H2>5. Third-party links</H2>
      <P>
        The site may link to third-party sites and tools we do not control. We
        are not responsible for their content, policies, or practices, and a
        link is not an endorsement.
      </P>

      <H2>6. Disclaimer</H2>
      <P>
        The site is provided “as is” and “as available”, without warranties of
        any kind, whether express or implied, including warranties of
        merchantability, fitness for a particular purpose, accuracy, or
        non-infringement. We do not warrant that the site will be uninterrupted,
        error-free, or secure, or that any information on it is complete or
        current.
      </P>

      <H2>7. Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, {COMPANY.name} will not be liable
        for any indirect, incidental, special, consequential, or punitive
        damages, or for any loss of data, revenue, or profits, arising out of or
        related to your use of the site. Our total liability for any claim
        relating to the site will not exceed one hundred US dollars (US$100).
        Nothing in these Terms limits liability that cannot be limited under
        applicable law, such as for fraud or willful misconduct.
      </P>

      <H2>8. Changes to these Terms</H2>
      <P>
        We may update these Terms from time to time. When we do, we will revise
        the date above. Your continued use of the site after a change means you
        accept the revised Terms.
      </P>

      <H2>9. Governing law and disputes</H2>
      <P>
        {gov} Before bringing any formal claim, you agree to first contact us
        through our <In to="/contact">contact page</In> so we can try to resolve
        the matter informally.
      </P>

      <H2>10. General</H2>
      <P>
        If any provision of these Terms is found unenforceable, the rest remain
        in effect. Our failure to enforce a provision is not a waiver of it.
        These Terms are the entire agreement between you and {COMPANY.name}{' '}
        regarding the site.
      </P>

      <H2>11. Contact</H2>
      <P>
        Questions about these Terms? Reach us through our{' '}
        <In to="/contact">contact page</In>.
      </P>
    </LegalShell>
  )
}
