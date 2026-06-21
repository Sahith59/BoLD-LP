import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Loader2 } from 'lucide-react'
import { Section } from '@/components/ui/section'
import { GlassPanel } from '@/components/ui/glass-panel'
import { AccentButton } from '@/components/ui/accent-button'
import { EASE, rise } from '@/lib/motion'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'loading' | 'success'

export function FinalCTA() {
  const fieldId = useId()
  const errId = `${fieldId}-err`
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const successRef = useRef<HTMLDivElement>(null)

  const validate = (value: string) => {
    if (!value.trim()) return 'Enter your email so we can reach you.'
    if (!EMAIL_RE.test(value)) return 'That doesn’t look like a valid email.'
    return null
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate(email)
    setError(err)
    if (err) return
    setStatus('loading')
    // Mock capture — no backend in the design phase.
    window.setTimeout(() => {
      setStatus('success')
      requestAnimationFrame(() => successRef.current?.focus())
    }, 850)
  }

  return (
    <Section id="early-access" index="08" eyebrow="THE ASK">
      <GlassPanel className="px-6 py-14 md:px-16 md:py-20">
        <motion.h2
          variants={rise}
          className="font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-[48px]"
        >
          Be first in line.
        </motion.h2>
        <motion.p
          variants={rise}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60 md:text-base"
        >
          We’re onboarding a first group of funded startups and MSSPs. Leave your
          email and we’ll run a free check on your live app, test accounts only,
          and show you exactly what we’d catch, before anyone exploits it.
        </motion.p>

        <motion.div variants={rise} className="mt-10 max-w-xl">
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
                className="glass-soft flex items-center gap-3 rounded-2xl px-5 py-5 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span className="bg-accent grid h-8 w-8 flex-none place-items-center rounded-full text-black">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <div>
                  <div className="text-[15px] font-medium text-white">
                    You’re on the list.
                  </div>
                  <div className="text-[13px] text-white/55">
                    We’ll email you when there’s something real to show.
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
              >
                <label
                  htmlFor={fieldId}
                  className="mb-2 block font-mono text-[10px] tracking-[0.24em] text-white/45"
                >
                  WORK EMAIL
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id={fieldId}
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    aria-invalid={!!error}
                    aria-describedby={error ? errId : undefined}
                    disabled={status === 'loading'}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    onBlur={(e) => setError(validate(e.target.value))}
                    className="h-[52px] flex-1 rounded-2xl border border-white/12 bg-white/[0.04] px-5 text-[15px] text-white placeholder:text-white/30 outline-none backdrop-blur-md transition focus:border-white/30 focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
                  />
                  <AccentButton
                    type="submit"
                    disabled={status === 'loading'}
                    className="h-[52px] shrink-0 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining…
                      </>
                    ) : (
                      'Get early access'
                    )}
                  </AccentButton>
                </div>

                <div className="min-h-[20px]" aria-live="polite">
                  {error && (
                    <p
                      id={errId}
                      role="alert"
                      className="mt-2.5 text-[13px] text-rose-300"
                    >
                      {error}
                    </p>
                  )}
                </div>

                <p className="mt-1 text-[12.5px] text-white/40">
                  No spam. One email when there’s something real to show you.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </GlassPanel>
    </Section>
  )
}
