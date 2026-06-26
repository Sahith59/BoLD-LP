import { Link } from 'react-router-dom'
import { BetaPill } from '@/components/ui/beta-pill'
import { appUrl } from '@/lib/config'

type FLink = { label: string; to?: string; href?: string }

const COLUMNS: { title: string; links: FLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Try the beta', href: appUrl('footer') },
      { label: 'How it works', to: '/#flaw' },
      { label: 'How it plugs in', to: '/#install' },
      { label: 'Compare', to: '/compare' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Incidents', to: '/incidents' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
]

const linkCls =
  'text-[14px] text-white/55 transition-colors hover:text-white'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 pb-12 pt-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand block */}
          <div>
            <div className="flex select-none items-center gap-[3px] font-display text-[22px] font-semibold leading-none tracking-tight text-white">
              <span>B</span>
              <span className="relative mx-[1px] inline-flex h-[15px] w-[15px] translate-y-[1px] items-center justify-center">
                <span className="border-accent absolute inset-0 rounded-full border-[1.6px]" />
                <span className="bg-accent h-[5px] w-[5px] rounded-full" />
              </span>
              <span>LD</span>
            </div>
            <p className="mt-4 max-w-[260px] text-[14px] leading-relaxed text-white/50">
              The runtime alarm for AI-coded apps. It catches the access bug they
              ship by default, live, with proof.
            </p>
            <BetaPill className="mt-5" />
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
                {col.title}
              </div>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a href={l.href} className={linkCls}>
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.to!} className={linkCls}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-7 sm:flex-row">
          <span className="font-mono text-[11px] tracking-[0.18em] text-white/35">
            © {new Date().getFullYear()} BoLD
          </span>
          <span className="font-mono text-[11px] tracking-[0.22em] text-white/30">
            ALARM, NOT A SCANNER
          </span>
        </div>
      </div>
    </footer>
  )
}
