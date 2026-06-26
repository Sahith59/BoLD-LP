import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'PRIVACY', to: '/privacy' },
  { label: 'TERMS', to: '/terms' },
  { label: 'COMPARE', to: '/compare' },
  { label: 'BLOG', to: '/blog' },
]

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <span className="font-mono text-[12px] font-semibold tracking-[0.42em] text-white/70">
          BoLD
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.24em] text-white/40">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-white/75"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="font-mono text-[10px] tracking-[0.26em] text-white/35">
          RUNTIME ALARM · BETA · {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
