import { type ReactNode } from 'react'

// Lightweight markdown for bot replies: paragraphs, "- " / "1." lists, **bold**,
// *italic*, `code`, and [text](path) links. Links are treated as INTERNAL site
// navigation only (paths starting with / or #) and routed via onInternal. Any
// external or model-invented URL is rendered as plain text and never opened, so a
// hallucinated link like example.com cannot hijack a click. Verified external
// source links are shown separately by the chat's Sources row.

const INLINE = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))|(\*[^*\n]+\*)|(`[^`]+`)/g

function renderInline(
  text: string,
  onInternal?: (href: string) => void,
): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  INLINE.lastIndex = 0
  while ((m = INLINE.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) {
      nodes.push(<strong key={key++}>{tok.slice(2, -2)}</strong>)
    } else if (tok.startsWith('[')) {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)
      const href = mm?.[2].trim() ?? ''
      if (mm && /^[/#]/.test(href)) {
        nodes.push(
          <button
            key={key++}
            type="button"
            onClick={() => onInternal?.(href)}
            className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
          >
            {mm[1]}
          </button>,
        )
      } else {
        // external or model-invented link: show the label as plain text only
        nodes.push(mm ? mm[1] : tok)
      }
    } else if (tok.startsWith('`')) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-[12px]"
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

/** Render a bot message string as formatted rich text. Internal links call
 *  onInternal(path); external/invented URLs are flattened to plain text. */
export function RichText({
  text,
  onInternal,
}: {
  text: string
  onInternal?: (href: string) => void
}) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let para: string[] = []
  let list: string[] = []
  let ordered = false
  let key = 0

  const flushPara = () => {
    if (!para.length) return
    const buf = para
    para = []
    blocks.push(
      <p key={key++} className="leading-relaxed">
        {buf.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {renderInline(line, onInternal)}
          </span>
        ))}
      </p>,
    )
  }
  const flushList = () => {
    if (!list.length) return
    const items = list.map((line, i) => (
      <li key={i}>{renderInline(line, onInternal)}</li>
    ))
    const isOrdered = ordered
    list = []
    blocks.push(
      isOrdered ? (
        <ol key={key++} className="list-decimal space-y-1 pl-5 leading-relaxed">
          {items}
        </ol>
      ) : (
        <ul
          key={key++}
          className="marker:text-accent/70 list-disc space-y-1 pl-5 leading-relaxed"
        >
          {items}
        </ul>
      ),
    )
  }

  for (const line of lines) {
    const bullet = /^\s*[-*]\s+(.+)$/.exec(line)
    const numbered = /^\s*\d+\.\s+(.+)$/.exec(line)
    if (bullet) {
      flushPara()
      if (ordered) flushList()
      ordered = false
      list.push(bullet[1])
    } else if (numbered) {
      flushPara()
      if (!ordered && list.length) flushList()
      ordered = true
      list.push(numbered[1])
    } else if (!line.trim()) {
      flushPara()
      flushList()
    } else {
      flushList()
      para.push(line)
    }
  }
  flushPara()
  flushList()

  return <div className="space-y-2">{blocks}</div>
}
