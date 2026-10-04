import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/12 text-primary',
        solid: 'border-transparent bg-primary text-primary-foreground',
        orange: 'border-transparent bg-brand-orange/15 text-brand-orange',
        red: 'border-transparent bg-destructive/12 text-destructive',
        outline: 'border-border bg-white/70 text-muted-foreground',
        success: 'border-transparent bg-brand-green/15 text-brand-green-deep',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
