import { Flame } from 'lucide-react'

import { MARQUEE_TAGS } from '@/lib/real-images'

export interface MarqueeTag {
  label: string
  image?: string
}

/**
 * شريط متحرك (Marquee) أخضر بصور حقيقية مصغّرة لأشهى الأصناف + النص.
 *
 * الحركة سلسة بلا فراغ: نكرّر العناصر حتى تملأ عرض الشاشة (content)، ثم نضاعف
 * هذا المحتوى مرّتين تمامًا داخل المسار، والأنيميشن يتحرّك بمقدار 50% بالضبط —
 * فعند انتهاء النسخة الأولى تبدأ الثانية في نفس اللحظة بلا أي قفزة أو فراغ.
 */
export default function MarqueeStrip({ tags = MARQUEE_TAGS }: { tags?: MarqueeTag[] }) {
  const safeTags = tags.length > 0 ? tags : MARQUEE_TAGS

  // كرّر العناصر لتملأ الشاشات العريضة، ثم ضاعف المحتوى (نسختان متطابقتان).
  const content = [...safeTags, ...safeTags, ...safeTags]
  const track = [...content, ...content]

  return (
    <div className="relative overflow-hidden border-y border-brand-green-deep/30 bg-gradient-to-r from-brand-green-deep via-brand-green to-brand-green-deep py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.15)]">
      {/* بريق خفيف فوق الشريط لإحساس أكثر حيوية */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/0 via-white/10 to-white/0"
      />
      {/* تلاشٍ ناعم عند الحافتين */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-0 z-10 w-12 bg-gradient-to-r from-brand-green-deep to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 bg-gradient-to-l from-brand-green-deep to-transparent"
      />

      <div className="marquee-track gap-6">
        {track.map((tag, index) => (
          <span
            key={`${tag.label}-${index}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-sm backdrop-blur-sm sm:text-sm"
          >
            {tag.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={tag.image}
                alt=""
                loading="lazy"
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

