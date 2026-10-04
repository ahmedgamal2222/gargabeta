import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-[96px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition-colors',
        'placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  )
}

function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'flex h-11 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
        'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
}

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn('text-xs font-semibold tracking-wide text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Textarea, Select, Label }
