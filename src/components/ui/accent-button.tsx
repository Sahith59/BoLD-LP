import * as React from 'react'
import { cn } from '@/lib/utils'

interface AccentButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  contentClassName?: string
}

/** The one primary CTA — accent-tinted liquid glass with a warm glow. */
export const AccentButton = React.forwardRef<
  HTMLButtonElement,
  AccentButtonProps
>(({ className, children, contentClassName, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'group relative isolate cursor-pointer rounded-full px-7 py-3.5 text-[15px] font-medium tracking-tight text-white outline-none transition-all duration-300',
        'focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, rgba(var(--accent-rgb),0.42), rgba(var(--accent-rgb),0.22))',
        border: '1px solid rgba(var(--accent-rgb),0.55)',
        boxShadow:
          'inset 0 1px 0 0 rgba(255,255,255,0.35), 0 10px 30px -8px rgba(var(--accent-rgb),0.55)',
        backdropFilter: 'blur(12px) saturate(150%)',
        WebkitBackdropFilter: 'blur(12px) saturate(150%)',
      }}
      {...props}
    >
      <span
        className={cn(
          'relative z-[1] flex items-center justify-center gap-2.5',
          contentClassName,
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-1 top-px h-1/2 rounded-full opacity-60"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0))',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: '0 16px 44px -10px rgba(var(--accent-rgb),0.8)' }}
      />
    </button>
  )
})
AccentButton.displayName = 'AccentButton'
