import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const glassButtonVariants = cva(
  'glass-button relative isolate cursor-pointer rounded-full transition-all',
  {
    variants: {
      size: {
        default: 'text-[15px] font-medium',
        sm: 'text-sm font-medium',
        lg: 'text-lg font-medium',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const glassButtonTextVariants = cva(
  'glass-button-text relative block select-none tracking-tight',
  {
    variants: {
      size: {
        default: 'px-7 py-3.5',
        sm: 'px-4 py-2',
        lg: 'px-9 py-4',
        icon: 'flex h-11 w-11 items-center justify-center',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, ...props }, ref) => {
    return (
      <div className={cn('glass-button-wrap rounded-full', className)}>
        <button className={cn(glassButtonVariants({ size }))} ref={ref} {...props}>
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <div className="glass-button-shadow rounded-full" />
      </div>
    )
  },
)
GlassButton.displayName = 'GlassButton'

export { GlassButton, glassButtonVariants }
