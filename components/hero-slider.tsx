'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface HeroSlide {
  src: string
  alt?: string
}

/**
 * سلايدر صور احترافي للهيرو: تبديل تلقائي + أسهم + نقاط تنقّل + إيقاف عند
 * التحويم بالماوس. يتجاهل أي صورة فشل تحميلها بدل إظهار أيقونة كسر.
 */
export default function HeroSlider({
  slides,
  intervalMs = 4200,
  className,
}: {
  slides: HeroSlide[]
  intervalMs?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState<Record<number, boolean>>({})

  const visibleSlides = slides.filter((_, slideIndex) => !failed[slideIndex])

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [paused, slides.length, intervalMs])

  if (slides.length === 0 || visibleSlides.length === 0) return null

  const go = (next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length)
  }

  return (
    <div
      className={cn('relative size-full overflow-hidden', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) =>
        failed[slideIndex] ? null : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt ?? ''}
            onError={() => setFailed((current) => ({ ...current, [slideIndex]: true }))}
            loading={slideIndex === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out',
              slideIndex === index ? 'opacity-100 animate-[kenburns_7s_ease-out_both]' : 'opacity-0'
            )}
          />
        )
      )}

      {/* تدرّج خفيف أسفل الصورة لقراءة أوضح لأي نص فوقها */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/35 to-transparent"
      />

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="الصورة السابقة"
            className="absolute inset-y-0 start-2 z-10 flex items-center"
          >
            <span className="grid size-8 place-items-center rounded-full bg-white/85 text-foreground opacity-80 shadow-md backdrop-blur-sm transition-opacity hover:opacity-100">
              <ChevronRight className="size-4" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="الصورة التالية"
            className="absolute inset-y-0 end-2 z-10 flex items-center"
          >
            <span className="grid size-8 place-items-center rounded-full bg-white/85 text-foreground opacity-80 shadow-md backdrop-blur-sm transition-opacity hover:opacity-100">
              <ChevronLeft className="size-4" />
            </span>
          </button>

          <div className="absolute inset-x-0 top-3 z-10 flex items-center justify-center gap-1.5">
            {slides.map((slide, dotIndex) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(dotIndex)}
                aria-label={`الصورة ${dotIndex + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  dotIndex === index ? 'w-6 bg-white shadow-sm' : 'w-1.5 bg-white/60 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
