'use client'

import { useMemo, useState } from 'react'
import { Image as ImageIcon, Play, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { resolveAssetUrl } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/lib/types'

type Filter = 'all' | 'photo' | 'video'

function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  )
  return match ? match[1] : null
}

/** المعرض: صور تُفتح في نافذة عرض + فيديوهات (يوتيوب أو ملف مرفوع) */
export default function HomeGallery({ media }: { media: MediaItem[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [active, setActive] = useState<MediaItem | null>(null)

  const visible = useMemo(
    () => media.filter((entry) => (filter === 'all' ? true : entry.type === filter)),
    [media, filter]
  )

  const photosCount = media.filter((entry) => entry.type === 'photo').length
  const videosCount = media.filter((entry) => entry.type === 'video').length

  const tabs: Array<{ key: Filter; label: string; count: number }> = [
    { key: 'all', label: 'الكل', count: media.length },
    { key: 'photo', label: 'صور', count: photosCount },
    { key: 'video', label: 'فيديوهات', count: videosCount },
  ]

  return (
    <section id="gallery" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="success" className="mb-3">
              المعرض
            </Badge>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl">
              لحظات من <span className="text-brand-gradient">جرجبيتا</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              صور المحل والمصنعات والمشويات + فيديوهات من المطبخ — كل الصور والفيديوهات تُدار من لوحة التحكم.
            </p>
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-bold transition-all',
                  filter === tab.key
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-white text-foreground/75 hover:border-primary/50'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-border bg-white/60 p-10 text-center text-sm text-muted-foreground">
            لا توجد وسائط منشورة حتى الآن — أضف صورك وفيديوهاتك من لوحة التحكم (تبويب الوسائط).
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((entry) => {
              const source = resolveAssetUrl(entry.url)
              const videoId = entry.type === 'video' ? youtubeId(entry.url) : null

              if (entry.type === 'video' && videoId) {
                return (
                  <div
                    key={entry.id}
                    className="overflow-hidden rounded-2xl border border-border bg-white soft-card"
                  >
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={entry.titleAr}
                        allowFullScreen
                        loading="lazy"
                        className="size-full"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold text-foreground">{entry.titleAr}</p>
                      <p className="text-[11px] text-muted-foreground">{entry.descriptionAr}</p>
                    </div>
                  </div>
                )
              }

              if (entry.type === 'video' && source) {
                return (
                  <div
                    key={entry.id}
                    className="overflow-hidden rounded-2xl border border-border bg-white soft-card"
                  >
                    <video controls preload="metadata" className="aspect-video w-full bg-ink/90" src={source} />
                    <div className="p-4">
                      <p className="text-sm font-bold text-foreground">{entry.titleAr}</p>
                      <p className="text-[11px] text-muted-foreground">{entry.descriptionAr}</p>
                    </div>
                  </div>
                )
              }

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => (source ? setActive(entry) : undefined)}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-white text-start soft-card"
                >
                  <span className="grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br from-secondary via-white to-brand-green/10">
                    {source ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={entry.thumbnailUrl ? resolveAssetUrl(entry.thumbnailUrl) : source}
                        alt={entry.titleAr}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex flex-col items-center gap-2 text-muted-foreground/60">
                        {entry.type === 'video' ? <Play className="size-8" /> : <ImageIcon className="size-8" />}
                        <span className="text-[11px]">لا يوجد ملف بعد</span>
                      </span>
                    )}
                  </span>
                  <span className="block p-4">
                    <span className="block text-sm font-bold text-foreground">{entry.titleAr}</span>
                    <span className="block text-[11px] text-muted-foreground">{entry.descriptionAr}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* عارض الصورة */}
      {active ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/80 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="إغلاق"
            className="absolute top-5 end-5 grid size-10 place-items-center rounded-full bg-white/90 text-ink"
            onClick={() => setActive(null)}
          >
            <X className="size-5" />
          </button>
          <figure className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                active.thumbnailUrl ? resolveAssetUrl(active.thumbnailUrl) : resolveAssetUrl(active.url)
              }
              alt={active.titleAr}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
            <figcaption className="pt-3 text-center text-sm font-bold text-foreground">
              {active.titleAr}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  )
}
