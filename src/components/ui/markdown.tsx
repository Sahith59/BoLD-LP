import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Dependency-free markdown renderer tuned for blog prose: h2/h3, paragraphs,
// unordered/ordered lists, blockquotes, fenced code blocks, horizontal rules,
// and inline **bold**, *italic*, `code`, and [links](href). Internal links
// (href starting with /) route through React Router; external links open in a
// new tab. The post controls its own markdown, so this covers what it uses.

const INLINE = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))|(\*[^*\n]+\*)|(`[^`]+`)/g

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  INLINE.lastIndex = 0
  while ((m = INLINE.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {tok.slice(2, -2)}
        </strong>,
      )
    } else if (tok.startsWith('[')) {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)
      const label = mm?.[1] ?? tok
      const href = mm?.[2].trim() ?? ''
      const cls =
        'text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent'
      if (/^\//.test(href)) {
        nodes.push(
          <Link key={key++} to={href} className={cls}>
            {label}
          </Link>,
        )
      } else {
        nodes.push(
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
          >
            {label}
          </a>,
        )
      }
    } else if (tok.startsWith('`')) {
      nodes.push(
        <code
          key={key++}
          className="text-accent-soft rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px]"
        >
          {tok.slice(1, -1)}
        </code>,
      )
    } else {
      nodes.push(<em key={key++}>{tok.slice(1, -1)}</em>)
    }
    last = m.index + tok.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const BLOCK_BREAK = /^(#{2,3})\s|^\s*[-*]\s|^\s*\d+\.\s|^\s*>|^```|^---+\s*$/

export function Markdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]!

    // fenced code block
    if (line.trim().startsWith('```')) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i]!.trim().startsWith('```')) {
        buf.push(lines[i]!)
        i++
      }
      i++ // skip closing fence
      blocks.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-white/80"
        >
          <code>{buf.join('\n')}</code>
        </pre>,
      )
      continue
    }

    if (!line.trim()) {
      i++
      continue
    }

    // headings
    const h = /^(#{2,3})\s+(.+)$/.exec(line)
    if (h) {
      if (h[1]!.length === 2) {
        blocks.push(
          <h2
            key={key++}
            className="mt-12 font-display text-[22px] font-semibold leading-snug tracking-[-0.01em] text-white md:text-[26px]"
          >
            {renderInline(h[2]!)}
          </h2>,
        )
      } else {
        blocks.push(
          <h3
            key={key++}
            className="mt-9 font-display text-[18px] font-semibold leading-snug text-white md:text-[20px]"
          >
            {renderInline(h[2]!)}
          </h3>,
        )
      }
      i++
      continue
    }

    // horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-10 border-white/10" />)
      i++
      continue
    }

    // blockquote
    if (line.trim().startsWith('>')) {
      const buf: string[] = []
      while (i < lines.length && lines[i]!.trim().startsWith('>')) {
        buf.push(lines[i]!.replace(/^\s*>\s?/, ''))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="border-accent/50 my-2 border-l-2 pl-5 text-[16px] italic leading-relaxed text-white/80"
        >
          {renderInline(buf.join(' '))}
        </blockquote>,
      )
      continue
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i]!)) {
        items.push(lines[i]!.replace(/^\s*[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul
          key={key++}
          className="marker:text-accent/60 list-disc space-y-2 pl-5 text-[15.5px] leading-[1.7] text-white/70"
        >
          {items.map((it, ii) => (
            <li key={ii}>{renderInline(it)}</li>
          ))}
        </ul>,
      )
      continue
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i]!)) {
        items.push(lines[i]!.replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      blocks.push(
        <ol
          key={key++}
          className="marker:text-white/40 list-decimal space-y-2 pl-5 text-[15.5px] leading-[1.7] text-white/70"
        >
          {items.map((it, ii) => (
            <li key={ii}>{renderInline(it)}</li>
          ))}
        </ol>,
      )
      continue
    }

    // paragraph
    const buf: string[] = []
    while (i < lines.length && lines[i]!.trim() && !BLOCK_BREAK.test(lines[i]!)) {
      buf.push(lines[i]!)
      i++
    }
    blocks.push(
      <p key={key++} className="text-[15.5px] leading-[1.75] text-white/70">
        {renderInline(buf.join(' '))}
      </p>,
    )
  }

  return <div className="space-y-5">{blocks}</div>
}
