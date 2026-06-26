import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { GlassPanel } from '@/components/ui/glass-panel'
import { AccentButton } from '@/components/ui/accent-button'
import { COMPANY, hasRealContactEmail } from '@/lib/config'
import { EASE, rise, container } from '@/lib/motion'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'loading' | 'success'
type Errors = { email?: string; message?: string }

export function ContactPage() {
  const uid = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Contact · BoLD'
  }, [])

  const validate = (): Errors => {
    const e: Errors = {}
    if (!email.trim()) e.email = 'Enter your email so we can reply.'
    else if (!EMAIL_RE.test(email)) e.email = 'That doesn’t look like a valid email.'
    if (!message.trim()) e.message = 'Add a short message.'
    return e
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setFormError(null)
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.status === 429) {
        setStatus('idle')
        setFormError('Too many messages. Give it a minute, then resend.')
        return
      }
      if (res.status === 422) {
        setStatus('idle')
        setFormError('Please check your email and message, then resend.')
        return
      }
      if (!res.ok) {
        setStatus('idle')
        setFormError('Something went wrong on our side. Please try again.')
        return
      }
      setStatus('success')
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus('idle')
      setFormError('We couldn’t reach the server. Check your connection and retry.')
    }
  }

  const field =
    'h-[52px] w-full rounded-2xl border border-white/12 bg-white/[0.04] px-5 text-[15px] text-white placeholder:text-white/30 outline-none backdrop-blur-md transition focus:border-white/30 focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50'
  const label = 'mb-2 block font-mono text-[10px] tracking-[0.24em] text-white/45'

  return (
    <div className="relative z-10 mx-auto max-w-2xl px-6 pb-32 pt-32 md:pt-40">
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
          GET IN TOUCH
        </motion.div>
        <motion.h1
          variants={rise}
          className="mt-4 font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[44px]"
        >
          Talk to us.
        </motion.h1>
        <motion.p
          variants={rise}
          className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60 md:text-base"
        >
          Questions about BoLD, the beta, a security detail, or a partnership?
          Send a note and it reaches the team directly. We read every message.
        </motion.p>

        <motion.div variants={rise} className="mt-10">
          <GlassPanel className="p-6 md:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="success"
                  ref={successRef}
                  tabIndex={-1}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <span className="bg-accent grid h-9 w-9 flex-none place-items-center rounded-full text-black">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <div>
                    <div className="text-[16px] font-medium text-white">
                      Your message is on its way.
                    </div>
                    <div className="text-[14px] text-white/55">
                      We’ll get back to you at {email}.
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor={`${uid}-name`} className={label}>
                      NAME (OPTIONAL)
                    </label>
                    <input
                      id={`${uid}-name`}
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      disabled={status === 'loading'}
                      onChange={(e) => setName(e.target.value)}
                      className={field}
                    />
                  </div>

                  <div>
                    <label htmlFor={`${uid}-email`} className={label}>
                      EMAIL
                    </label>
                    <input
                      id={`${uid}-email`}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                      disabled={status === 'loading'}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
                      }}
                      className={field}
                    />
                    {errors.email && (
                      <p
                        id={`${uid}-email-err`}
                        role="alert"
                        className="mt-2 text-[13px] text-rose-300"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${uid}-message`} className={label}>
                      MESSAGE
                    </label>
                    <textarea
                      id={`${uid}-message`}
                      rows={5}
                      placeholder="What’s on your mind?"
                      value={message}
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? `${uid}-message-err` : undefined
                      }
                      disabled={status === 'loading'}
                      onChange={(e) => {
                        setMessage(e.target.value)
                        if (errors.message)
                          setErrors((p) => ({ ...p, message: undefined }))
                      }}
                      className="w-full resize-y rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 text-[15px] leading-relaxed text-white placeholder:text-white/30 outline-none backdrop-blur-md transition focus:border-white/30 focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
                    />
                    {errors.message && (
                      <p
                        id={`${uid}-message-err`}
                        role="alert"
                        className="mt-2 text-[13px] text-rose-300"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <AccentButton
                      type="submit"
                      disabled={status === 'loading'}
                      className="disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        'Send message'
                      )}
                    </AccentButton>
                    {hasRealContactEmail && (
                      <span className="text-[13px] text-white/45">
                        or email{' '}
                        <a
                          href={`mailto:${COMPANY.email}`}
                          className="text-accent underline decoration-accent/30 underline-offset-2 hover:text-accent-soft"
                        >
                          {COMPANY.email}
                        </a>
                      </span>
                    )}
                  </div>

                  <div className="min-h-[20px]" aria-live="polite">
                    {formError && (
                      <p role="alert" className="text-[13px] text-rose-300">
                        {formError}
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </div>
  )
}
