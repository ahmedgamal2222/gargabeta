import { Flame } from 'lucide-react'

import { HERO_SLIDES } from '@/lib/real-images'

const DEFAULT_TAGS = [
  { label: 'سجق بلدي', image: HERO_SLIDES[5]?.src },
  { label: 'كفتة دوبل', image: HERO_SLIDES[2]?.src },
  { label: 'مشويات على الفحم', image: HERO_SLIDES[1]?.src },
  { label: 'شيش طاووق', image: HERO_SLIDES[4]?.src },
  { label: 'بوكسات عزومة', image: HERO_SLIDES[3]?.src },
  { label: 'استيك على الفحم', image: HERO_SLIDES[0]?.src },
  { label: 'توصيل سريع داخل أسوان', image: undefined },
]

/**
 * شريط متحرك (Marquee) أخضر بصور حقيقية مصغّرة لأشهى الأصناف + النص — يعطي
 * لمسة احترافية وحيوية بدل شريط فارغ بنص صغير فقط.
 */
export default function MarqueeStrip({ tags = DEFAULT_TAGS }: { tags?: Array<{ label: string; image?: string }> }) {
  const doubled = [...tags, ...tags, ...tags]

  return (
    <div className="relative overflow-hidden border-y border-brand-green-deep/30 bg-gradient-to-r from-brand-green-deep via-brand-green to-brand-green-deep py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.15)]">
      {/* بريق خفيف متحرك فوق الشريط لإحساس أكثر حيوية */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/0 via-white/10 to-white/0"
      />
      <div className="marquee-track gap-6">
        {doubled.map((tag, index) => (
          <span
            key={`${tag.label}-${index}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-sm backdrop-blur-sm sm:text-sm"
          >
            {tag.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={tag.image}
                alt=""
                className="size-6 shrink-0 rounded-full border-2 border-white/50 object-cover"
              />
            ) : (
              <Flame className="size-4 shrink-0 text-brand-yellow" />
            )}
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  )
}

