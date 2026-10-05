'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  Bike,
  Clock,
  Flame,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react'

import BrandLogo from '@/components/brand-logo'
import HeroSlider from '@/components/hero-slider'
import ShareMenuButton from '@/components/share-menu-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { generalWhatsappUrl, resolveAssetUrl } from '@/lib/api'
import { HERO_SLIDES } from '@/lib/real-images'
import type { SiteSettings } from '@/lib/types'

const HIGHLIGHTS = [
  { icon: Flame, title: 'مشويات على الفحم', text: 'تُحضَّر بعد الطلب مش طبق جاهز.' },
  { icon: BadgeCheck, title: 'لحوم بلدي طازجة', text: 'اختيار يومي من السوق.' },
  { icon: Bike, title: 'توصيل داخل أسوان', text: 'طلبك يوصل بسرعة ولسه سخن.' },
]

const STATS = [
  { value: '١٠٠٪', label: 'لحوم طازجة' },
  { value: '٥★', label: 'تقييم العملاء' },
  { value: 'يومي', label: 'تجهيز يومي' },
]

export default function Hero({ settings }: { settings: SiteSettings }) {
  const [mounted, setMounted] = useState(false)
  const [heroFailed, setHeroFailed] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36"
      style={{ minHeight: '95svh' }}
    >
      {/* خلفيات زخرفية محسّنة */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-32 -start-32 size-96 rounded-full bg-brand-yellow/30 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-16 -end-32 size-[28rem] rounded-full bg-brand-green/20 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 start-1/2 size-64 -translate-x-1/2 rounded-full bg-brand-orange/15 blur-3xl"
      />

      {/* دوائر عائمة ديكورية */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-40 start-[10%] size-3 rounded-full bg-brand-green/60 animate-float"
        style={{ animationDelay: '0s' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-60 end-[15%] size-2 rounded-full bg-brand-orange/70 animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-32 start-[20%] size-2.5 rounded-full bg-brand-yellow/80 animate-float"
        style={{ animationDelay: '3s' }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8">
        {/* ====== النص الجانبي الأيسر ====== */}
        <div
          className={`transition-all duration-1000 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* الشعار + الاسم */}
          <div className="mb-7 flex items-center gap-4">
            <div className="relative">
              <BrandLogo src={settings.logoUrl} name={settings.brandName} size="lg" />
              <span className="absolute -top-1 -end-1 flex size-4 items-center justify-center rounded-full bg-brand-green shadow-sm">
                <Star className="size-2.5 fill-white text-white" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-foreground sm:text-3xl">{settings.brandName}</p>
              <p className="text-xs font-semibold tracking-wide text-brand-green-deep sm:text-sm">
                {settings.brandTagline}
              </p>
            </div>
          </div>

          <Badge variant="solid" className="mb-5 gap-1.5 px-4 py-1.5 text-[13px]">
            <Sparkles className="size-3.5" />
            لحوم طازجة • مصنعات • مشويات
          </Badge>

          <h1 className="text-3xl leading-snug font-black text-foreground sm:text-4xl lg:text-[3.2rem] lg:leading-tight">
            {settings.heroTitle}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
            {settings.heroSubtitle}
          </p>

          {/* أزرار الاتصال */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="whatsapp" size="lg" className="h-12 gap-2 px-6 text-[15px] font-black shadow-lg hover:shadow-xl transition-shadow">
              <a href={generalWhatsappUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-5" />
                اطلب على الواتساب
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="h-12 gap-2 px-6 text-[15px] font-bold hover:bg-primary/5 hover:border-primary">
              <Link href="/menu">
                <ShoppingBag className="size-5" />
                تصفّح المنيو
              </Link>
            </Button>

            <ShareMenuButton size="lg" className="h-12 px-6 text-[15px] font-bold" />
          </div>

          {/* معلومات سريعة */}
          <div className="mt-7 flex flex-wrap gap-5 text-[12px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-brand-green" />
              {settings.hours}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bike className="size-4 text-brand-green" />
              {settings.deliveryNote}
            </span>
          </div>

          {/* إحصائيات */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-white/70 px-3 py-3 text-center backdrop-blur-sm"
              >
                <p className="text-lg font-black text-brand-green">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-bold text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ====== بطاقة الهيرو الجانبية ====== */}
        <div
          className={`transition-all delay-200 duration-1000 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <div className="relative">
            {/* هالة توهج خلف البطاقة */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-green/25 via-brand-yellow/15 to-brand-orange/20 blur-2xl scale-110"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white p-3 soft-card">
              {/* الصورة الرئيسية */}
              <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-brand-yellow/25 via-white to-brand-green/15 sm:aspect-[3/4]">
                {settings.heroImage && settings.heroImage !== '/images/hero-meat.svg' ? (
                  !heroFailed ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resolveAssetUrl(settings.heroImage)}
                      alt={settings.brandName}
                      onError={() => setHeroFailed(true)}
                      className="size-full object-cover"
                    />
                  ) : (
                    <HeroSlider slides={HERO_SLIDES} />
                  )
                ) : (
                  /* لا صورة مخصّصة بعد من لوحة التحكم — نعرض سلايدر صور جرجبيتا الحقيقية */
                  <HeroSlider slides={HERO_SLIDES} />
                )}

                {/* بادج عائم فوق الصورة */}
                <div className="absolute bottom-4 start-4 end-4 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs font-black text-foreground/90">اطلب الآن وتوصّل لحد بابك</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {settings.deliveryNote} • {settings.hours}
                  </p>
                </div>
              </div>

              {/* مميزات المطعم */}
              <div className="grid grid-cols-3 gap-2 p-3">
                {HIGHLIGHTS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-border/60 bg-gradient-to-b from-white to-secondary/30 px-2 py-3 text-center transition-all hover:border-primary/30 hover:shadow-sm"
                      title={item.text}
                    >
                      <Icon className="mx-auto size-4 text-brand-green" />
                      <p className="mt-1.5 text-[10px] leading-tight font-bold text-foreground/85">
                        {item.title}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
