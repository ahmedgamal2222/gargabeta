import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-brand-green via-primary to-brand-green-deep text-primary-foreground shadow-[0_14px_35px_-16px_var(--brand-green)] hover:-translate-y-0.5 hover:brightness-105',
        whatsapp:
          'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_14px_35px_-16px_rgba(37,211,102,0.9)] hover:-translate-y-0.5',
        orange:
          'bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-red text-white shadow-[0_14px_35px_-16px_var(--brand-orange)] hover:-translate-y-0.5',
        outline:
          'border border-primary/40 bg-white/70 text-foreground hover:border-primary hover:bg-primary/10',
        ghost: 'text-foreground/80 hover:bg-primary/10 hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
