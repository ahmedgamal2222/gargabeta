import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-foreground shadow-sm transition-colors',
        'placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  )
}

export { Input }
