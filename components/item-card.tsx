'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { resolveAssetUrl } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { MenuItem, SiteSettings } from '@/lib/types'

/** كارت الصنف مع تحكم مباشر في الكمية داخل الكارت */
export default function ItemCard({
  item,
  settings,
  className,
}: {
  item: MenuItem
  settings: SiteSettings
  className?: string
}) {
  const { add, increment, decrement, lines, openCart } = useCart()
  const [imageFailed, setImageFailed] = useState(false)

  const cartLine = lines.find((line) => line.id === item.id)
  const qty = cartLine?.quantity ?? 0

  const tags = item.tagsAr
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  const imageSrc = imageFailed ? '' : resolveAssetUrl(item.imageUrl)

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card soft-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl',
        !item.isAvailable && 'opacity-60',
        qty > 0 && 'border-primary/60 ring-2 ring-primary/20',
        className
      )}
    >
      {/* صورة الصنف */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary via-white to-brand-yellow/20">
        {imageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc}
            alt={item.nameAr}
            onError={() => setImageFailed(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="grid size-full place-items-center">
            <span className="grid size-16 place-items-center rounded-2xl border border-brand-green/25 bg-white/70 text-2xl font-black text-brand-green">
              {item.nameAr.slice(0, 1)}
            </span>
          </span>
        )}

        {/* بادج الوسوم */}
        {tags.length > 0 ? (
          <span className="absolute top-3 start-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant={tag === 'الأكثر طلبًا' ? 'orange' : 'solid'}>
                {tag}
              </Badge>
            ))}
          </span>
        ) : null}

        {/* مؤشر الكمية في السلة */}
        {qty > 0 ? (
          <span className="absolute top-3 end-3 flex size-8 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground shadow-lg">
            {qty}
          </span>
        ) : null}

        {/* غير متاح */}
        {!item.isAvailable ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white/90 px-4 py-1 text-xs font-black text-destructive">
              غير متاح حاليًا
            </span>
          </span>
        ) : null}
      </div>

      {/* محتوى الكارت */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-black text-foreground leading-snug">{item.nameAr}</h3>
        {item.descriptionAr ? (
          <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
            {item.descriptionAr}
          </p>
        ) : (
          <span className="flex-1" />
        )}

        {/* السعر + أزرار التحكم */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 mt-1">
          <div className="flex flex-col">
            <span className="text-lg font-black text-brand-red leading-tight">
              {item.price}
              <span className="ms-1 text-xs font-bold">{settings.currency}</span>
            </span>
            {item.unitAr ? (
              <span className="text-[11px] font-semibold text-muted-foreground">/ {item.unitAr}</span>
            ) : null}
          </div>

          {item.isAvailable ? (
            qty === 0 ? (
              /* زر الإضافة الأولى */
              <Button
                type="button"
                size="sm"
                onClick={() => { add(item); openCart() }}
                className="gap-1.5 font-bold shadow-sm hover:shadow-md transition-shadow"
              >
                <Plus className="size-3.5" />
                أضف للسلة
              </Button>
            ) : (
              /* أزرار التحكم في الكمية */
              <div className="flex items-center gap-1 rounded-full border-2 border-primary/40 bg-primary/5 px-1 py-0.5">
                <button
                  type="button"
                  onClick={() => decrement(item.id)}
                  aria-label="تقليل"
                  className="grid size-7 place-items-center rounded-full text-primary hover:bg-primary/20 transition-colors"
                >
                  <Minus className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={openCart}
                  className="min-w-6 text-center text-sm font-black text-primary hover:text-brand-green-deep transition-colors"
                >
                  {qty}
                </button>
                <button
                  type="button"
                  onClick={() => increment(item.id)}
                  aria-label="زيادة"
                  className="grid size-7 place-items-center rounded-full text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            )
          ) : null}
        </div>

        {/* زر فتح السلة عند وجود عناصر */}
        {qty > 0 ? (
          <button
            type="button"
            onClick={openCart}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary/8 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/15 transition-colors"
          >
            <ShoppingCart className="size-3" />
            عرض السلة ({qty} صنف — {item.price * qty} {settings.currency})
          </button>
        ) : null}
      </div>
    </article>
  )
}
