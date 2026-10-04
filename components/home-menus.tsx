'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Beef, Plus, UtensilsCrossed } from 'lucide-react'

import ItemCard from '@/components/item-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { resolveAssetUrl } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Category, MenuItem, MenuSection, SiteBundle, SiteSettings } from '@/lib/types'

function QuickItemRow({ item, settings }: { item: MenuItem; settings: SiteSettings }) {
  const { add, increment, decrement, lines, openCart } = useCart()
  const cartLine = lines.find((line) => line.id === item.id)
  const qty = cartLine?.quantity ?? 0

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground">{item.nameAr}</span>
        <span className="block truncate text-[11px] text-muted-foreground">
          {item.unitAr ? `${item.unitAr} • ` : ''}
          {item.descriptionAr}
        </span>
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-black text-brand-red whitespace-nowrap">
          {item.price} {settings.currency}
        </span>

        {item.isAvailable ? (
          qty === 0 ? (
            <button
              type="button"
              onClick={() => { add(item); openCart() }}
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-brand-green-deep transition-colors shadow-sm"
              aria-label={`إضافة ${item.nameAr}`}
            >
              <Plus className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={openCart}
              className="flex h-7 items-center gap-1 rounded-full bg-primary/10 px-2.5 text-[11px] font-black text-primary hover:bg-primary/20 transition-colors"
            >
              {qty}×
            </button>
          )
        ) : null}
      </div>
    </li>
  )
}

function SectionPanel({
  title,
  description,
  icon,
  categories,
  items,
  settings,
  href,
  tone,
}: {
  title: string
  description: string
  icon: React.ReactNode
  categories: Category[]
  items: MenuItem[]
  settings: SiteSettings
  href: string
  tone: 'green' | 'orange'
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl border border-border bg-white soft-card',
        tone === 'green' ? 'border-brand-green/20' : 'border-brand-orange/20'
      )}
    >
      {/* رأس البطاقة */}
      <div
        className={cn(
          'flex items-center gap-4 p-6',
          tone === 'green'
            ? 'bg-gradient-to-l from-brand-green/12 via-brand-green/5 to-transparent'
            : 'bg-gradient-to-l from-brand-orange/15 via-brand-orange/5 to-transparent'
        )}
      >
        <span
          className={cn(
            'grid size-14 shrink-0 place-items-center rounded-2xl border text-2xl',
            tone === 'green'
              ? 'border-brand-green/30 bg-brand-green/10 text-brand-green-deep'
              : 'border-brand-orange/35 bg-brand-orange/12 text-brand-orange'
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-black text-foreground">{title}</h3>
          <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-4 px-6 pb-6">
        {/* الأقسام الفرعية */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.id}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[11px] font-bold',
                tone === 'green'
                  ? 'border-brand-green/20 bg-brand-green/5 text-brand-green-deep'
                  : 'border-brand-orange/25 bg-brand-orange/8 text-brand-orange'
              )}
            >
              {category.nameAr}
            </span>
          ))}
        </div>

        {/* قائمة الأصناف */}
        <ul className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border bg-white/80">
          {items.map((item) => (
            <QuickItemRow key={item.id} item={item} settings={settings} />
          ))}
        </ul>

        <Button asChild variant={tone === 'green' ? 'default' : 'orange'} className="w-full gap-2 font-bold">
          <Link href={href}>
            شوف المنيو كامل
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function HomeMenus({ bundle, settings }: { bundle: SiteBundle; settings: SiteSettings }) {
  const { categories, items } = bundle

  const pickCategories = (section: MenuSection) => categories.filter((entry) => entry.section === section)
  const pickItems = (section: MenuSection, limit = 5) =>
    items.filter((entry) => entry.categorySection === section).slice(0, limit)

  const featured = items.filter((entry) => entry.isFeatured === 1).slice(0, 8)

  return (
    <>
      {/* الأكثر طلبًا */}
      {featured.length > 0 ? (
        <section id="featured" className="relative py-16 sm:py-20">
          {/* خلفية زخرفية */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 end-0 size-64 rounded-full bg-brand-orange/10 blur-3xl"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge variant="orange" className="mb-3 gap-1.5">
                  🔥 الأكثر طلبًا
                </Badge>
                <h2 className="text-2xl font-black text-foreground sm:text-3xl">
                  أصناف <span className="text-brand-gradient">الكل بيطلبها</span>
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  مختارات من المصنعات والمشويات — ضيفها للسلة مباشرة من هنا.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/menu">
                  المنيو الكامل
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((item) => (
                <ItemCard key={item.id} item={item} settings={settings} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* القسمان الرئيسيان */}
      <section id="menus" className="relative bg-gradient-to-b from-white/80 via-secondary/20 to-white/60 py-16 sm:py-20">
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 start-0 size-80 rounded-full bg-brand-green/8 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="success" className="mb-3">
              المنيو
            </Badge>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl">
              منيوين في مكان واحد:{' '}
              <span className="text-brand-gradient">المصنعات والمطعم</span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              مصنعات مجهّزة للبيت والفرن، وأطباق ساخنة من مطبخ جرجبيتا — اختار قسمك وابدأ الطلب.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <SectionPanel
              title="منيو المصنعات"
              description="سجق، كفتة، برجر، لانشون، بسطرمة وشاورما — تجهيز يومي وبمقادير مظبوطة."
              icon={<Beef className="size-7" />}
              categories={pickCategories('products')}
              items={pickItems('products')}
              settings={settings}
              href="/menu#products"
              tone="green"
            />

            <SectionPanel
              title="منيو المطعم"
              description="مشويات على الفحم، طواجن وفتة، وساندوتشات ساخنة في عيش بلدي."
              icon={<UtensilsCrossed className="size-7" />}
              categories={pickCategories('restaurant')}
              items={pickItems('restaurant')}
              settings={settings}
              href="/menu#restaurant"
              tone="orange"
            />
          </div>
        </div>
      </section>
    </>
  )
}
