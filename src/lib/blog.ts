// Markdown-in-repo blog. Posts live in src/content/blog/*.md with frontmatter;
// this loads them at build time via Vite's import.meta.glob, parses the
// frontmatter, computes reading time, and sorts newest-first. No backend, no
// CMS, version-controlled.

export type Post = {
  slug: string
  title: string
  date: string // ISO yyyy-mm-dd
  excerpt: string
  author: string
  tags: string[]
  readingMinutes: number
  content: string // markdown body, frontmatter stripped
}

const files = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function parseFrontmatter(raw: string): {
  data: Record<string, string>
  body: string
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1]!.split('\n')) {
    const i = line.indexOf(':')
    if (i === -1) continue
    const key = line.slice(0, i).trim()
    const val = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (key) data[key] = val
  }
  return { data, body: raw.slice(match[0].length) }
}

function parseTags(v?: string): string[] {
  if (!v) return []
  return v
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path
      .split('/')
      .pop()!
      .replace(/\.md$/, '')
    const { data, body } = parseFrontmatter(raw)
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      excerpt: data.excerpt ?? '',
      author: data.author ?? 'The BoLD team',
      tags: parseTags(data.tags),
      readingMinutes: readingMinutes(body),
      content: body,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
