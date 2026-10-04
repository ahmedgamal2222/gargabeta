'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'size-10 text-[9px]',
  md: 'size-14 text-[11px]',
  lg: 'size-24 text-sm',
  xl: 'size-32 text-base',
} as const

/**
 * شعار جرجبيتا.
 * ترتيب الأولوية:
 *  1) شعار مرفوع من لوحة التحكم (رابط /api/uploads/... أو رابط خارجي)
 *  2) ملف حقيقي وضعه صاحب المطعم داخل frontend/public/images باسم logo.jpeg أو logo.png
 *  3) الشعار الافتراضي logo.svg
 *  4) بديل نصّي أنيق إذا فشل كل ما سبق
 */
const DROP_IN_LOGOS = ['/images/logo.jpeg', '/images/logo.png']

function buildCandidates(src?: string | null): string[] {
  const provided = (src ?? '').trim()
  const isDefault = !provided || provided === '/images/logo.svg'
  const list = isDefault
    ? [...DROP_IN_LOGOS, provided || '/images/logo.svg']
    : [provided, ...DROP_IN_LOGOS, '/images/logo.svg']

  return Array.from(new Set(list.filter(Boolean)))
}

export default function BrandLogo({
  src,
  name,
  size = 'md',
  className,
}: {
  src?: string | null
  name: string
  size?: keyof typeof SIZES
  className?: string
}) {
  const [failed, setFailed] = useState<string[]>([])

  const candidates = buildCandidates(src)
  const current = candidates.find((candidate) => !failed.includes(candidate))

  if (!current) {
    return (
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-full border-2 border-brand-green/60 bg-white font-black text-brand-green-deep shadow-sm',
          SIZES[size],
          className
        )}
        aria-label={name}
      >
        <span className="px-1 text-center leading-tight">{name}</span>
      </span>
    )
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={current}
      alt={name}
      onError={() => setFailed((current2) => [...current2, current])}
      className={cn('shrink-0 rounded-full border border-border bg-white object-contain', SIZES[size], className)}
    />
  )
}
