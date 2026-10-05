import { Flame } from 'lucide-react'

const DEFAULT_TAGS = [
  'سجق بلدي 🔥',
  'كفتة دوبل',
  'مشويات على الفحم',
  'توصيل سريع داخل أسوان',
  'بوكسات عزومة',
  'شيش طاووق',
  'استيك على الفحم',
  'مصنعات طازجة يوميًا',
]

/** شريط متحرك (Marquee) بعرض أشهى الأصناف — يعطي لمسة احترافية وحيوية للموقع */
export default function MarqueeStrip({ tags = DEFAULT_TAGS }: { tags?: string[] }) {
  const doubled = [...tags, ...tags]

  return (
    <div className="relative overflow-hidden border-y border-brand-green-deep/20 bg-gradient-to-r from-brand-green-deep via-brand-green to-brand-green-deep py-2.5">
      <div className="marquee-track gap-10">
        {doubled.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="flex shrink-0 items-center gap-2 px-4 text-[12px] font-bold text-white/95 sm:text-sm"
          >
            <Flame className="size-3.5 text-brand-yellow" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
