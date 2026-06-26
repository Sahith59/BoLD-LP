import * as React from 'react'
import { cn } from '@/lib/utils'

interface AccentButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  contentClassName?: string
}

/** The one primary CTA: amber liquid glass that refracts the live background
 *  (the same `#liquid-glass` lens as the 3D wordmark), etched with a raised
 *  bevel and a wet gleam that sweeps on hover. overflow-hidden clips every inner
 *  layer to the pill so nothing pokes past the rounded corners. */
export const AccentButton = React.forwardRef<
  HTMLButtonElement,
  AccentButtonProps
>(({ className, children, contentClassName, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'accent-button group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-[15px] font-semibold tracking-tight text-white outline-none',
        'focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        className,
      )}
      {...props}
    >
      {/* top specular sheen, matched to the pill shape so corners stay clean */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,246,226,0.5) 0%, rgba(255,246,226,0) 48%)',
        }}
      />
      {/* wet-glass gleam that sweeps across on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-2/5 -translate-x-[160%] opacity-0 transition-all duration-[800ms] ease-out group-hover:translate-x-[260%] group-hover:opacity-90"
        style={{
          background:
            'linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent)',
        }}
      />
      <span
        className={cn(
          'relative z-[1] flex items-center justify-center gap-2.5',
          contentClassName,
        )}
      >
        {children}
      </span>
    </button>
  )
})
AccentButton.displayName = 'AccentButton'
