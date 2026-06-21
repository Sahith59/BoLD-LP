export type Accent = 'amber' | 'rose'

/** Temporary dev control: flip the page's single accent colour live. */
export function AccentToggle({
  accent,
  onChange,
}: {
  accent: Accent
  onChange: (a: Accent) => void
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md">
      {(['amber', 'rose'] as const).map((a) => (
        <button
          key={a}
          onClick={() => onChange(a)}
          className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-[0.24em] transition ${
            accent === a
              ? 'bg-white/90 text-black'
              : 'text-white/55 hover:text-white/85'
          }`}
        >
          {a.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export const ACCENTS: Record<
  Accent,
  { accent: string; soft: string; rgb: string }
> = {
  amber: { accent: '#c77d0a', soft: '#e8a33d', rgb: '199, 125, 10' },
  rose: { accent: '#f43f5e', soft: '#fb7185', rgb: '244, 63, 94' },
}
