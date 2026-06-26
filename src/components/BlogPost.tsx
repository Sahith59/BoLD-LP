import { useEffect } from 'react'
import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/glass-panel'
import { Markdown } from '@/components/ui/markdown'
import { getPost, formatDate } from '@/lib/blog'
import { rise, container } from '@/lib/motion'

const backLink =
  'group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-white/40 transition-colors hover:text-white/70'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  useEffect(() => {
    if (post) document.title = `${post.title} · BoLD`
    return () => {
      document.title = 'BoLD'
    }
  }, [post])

  if (!post) {
    return (
      <div className="relative z-10 mx-auto max-w-2xl px-6 pb-32 pt-40 text-center">
        <h1 className="font-display text-[28px] font-semibold text-white">
          That post doesn’t exist.
        </h1>
        <p className="mt-3 text-[15px] text-white/55">
          It may have moved, or the link is wrong.
        </p>
        <Link
          to="/blog"
          className="text-accent mt-6 inline-block font-mono text-[12px] tracking-[0.16em]"
        >
          ← ALL POSTS
        </Link>
      </div>
    )
  }

  return (
    <div className="relative z-10 mx-auto max-w-2xl px-6 pb-32 pt-32 md:pt-40">
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div variants={rise}>
          <Link to="/blog" className={backLink}>
            <span
              aria-hidden
              className="transition-transform group-hover:-translate-x-0.5"
            >
              ←
            </span>
            ALL POSTS
          </Link>
        </motion.div>

        {post.tags.length > 0 && (
          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-white/55"
              >
                {t}
              </span>
            ))}
          </motion.div>
        )}

        <motion.h1
          variants={rise}
          className="mt-4 font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[40px]"
        >
          {post.title}
        </motion.h1>

        <motion.div
          variants={rise}
          className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-white/40"
        >
          <span>{formatDate(post.date)}</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span>{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span>{post.readingMinutes} min read</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={rise}
        className="mt-12"
      >
        <Markdown content={post.content} />
      </motion.div>

      <div className="mt-16 border-t border-white/10 pt-10">
        <GlassPanel className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[15px] leading-relaxed text-white/70">
            Want BoLD watching for this on your own app?
          </p>
          <Link
            to="/#early-access"
            className="group inline-flex flex-none items-center gap-2 font-mono text-[12px] tracking-[0.16em] text-white/70 underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white/50"
          >
            GET EARLY ACCESS
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </GlassPanel>
        <div className="mt-8">
          <Link to="/blog" className={backLink}>
            <span
              aria-hidden
              className="transition-transform group-hover:-translate-x-0.5"
            >
              ←
            </span>
            ALL POSTS
          </Link>
        </div>
      </div>
    </div>
  )
}
