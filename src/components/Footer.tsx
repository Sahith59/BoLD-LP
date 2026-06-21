export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-mono text-[12px] font-semibold tracking-[0.42em] text-white/70">
          BoLD
        </span>
        <span className="font-mono text-[10px] tracking-[0.26em] text-white/35">
          RUNTIME ALARM · PRE-LAUNCH · {new Date().getFullYear()}
        </span>
        <span className="font-mono text-[10px] tracking-[0.26em] text-white/35">
          ALARM, NOT A SCANNER
        </span>
      </div>
    </footer>
  )
}
