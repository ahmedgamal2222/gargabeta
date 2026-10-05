'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, ShoppingCart, SlidersHorizontal, X } from 'lucide-react'

import ItemCard from '@/components/item-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/cart'
import { resolveAssetUrl } from '@/lib/api'
import { REAL_LOGO_URL } from '@/lib/real-images'
import { cn } from '@/lib/utils'
import type { MenuSection, SiteBundle, SiteSettings } from '@/lib/types'

/** صفحة المنيو: تبويب القسمين + بحث + فلترة بالأقسام الفرعية */
export default function MenuExplorer({
  bundle,
  settings,
}: {
  bundle: SiteBundle
  settings: SiteSettings
}) {
  const { categories, items } = bundle
  const { count, total, openCart } = useCart()

  const [section, setSection] = useState<MenuSection>('restaurant')
  const [categoryId, setCategoryId] = useState<number | 'all'>('all')
  const [search, setSearch] = useState('')

  // تحديد القسم من رابط الصفحة (#products / #restaurant / #manufactured)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'products' || hash === 'restaurant' || hash === 'manufactured') setSection(hash)
  }, [])

  const sectionCategories = useMemo(
    () => categories.filter((entry) => entry.section === section),
    [categories, section]
  )

  const availableItems = useMemo(
    () => items.filter((entry) => entry.categorySection === section),
    [items, section]
  )

  const visibleItems = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return availableItems.filter((item) => {
      if (categoryId !== 'all' && item.categoryId !== categoryId) return false
      if (!needle) return true
      return (
        item.nameAr.toLowerCase().includes(needle) || item.descriptionAr.toLowerCase().includes(needle)
      )
    })
  }, [availableItems, categoryId, search])

  const counts = {
    restaurant: items.filter((entry) => entry.categorySection === 'restaurant').length,
    products: items.filter((entry) => entry.categorySection === 'products').length,
    manufactured: items.filter((entry) => entry.categorySection === 'manufactured').length,
  }

  const switchSection = (next: MenuSection) => {
    setSection(next)
    setCategoryId('all')
    setSearch('')
    window.history.replaceState(null, '', `#${next}`)
  }

  return (
    <div className="space-y-6">
      {/* ─── تبويب الأقسام الثلاثة ─── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            {
              key: 'restaurant' as MenuSection,
              title: 'الساندوتشات والمشويات',
              emoji: '🍢',
              image: undefined as string | undefined,
              text: 'كفتة وكباب وشيش طاووق وشيش تكا — تُشوى على الفحم فور الطلب',
              count: counts.restaurant,
            },
            {
              key: 'products' as MenuSection,
              title: 'البوكسات والإضافات',
              emoji: '🥩',
              image: undefined as string | undefined,
              text: 'تشكيلات مشكّلة للعزومات • صوصات وأطباق جانبية',
              count: counts.products,
            },
            {
              key: 'manufactured' as MenuSection,
              title: 'المصنّعات البلدي',
              emoji: '🥓',
              image: resolveAssetUrl(settings.logoUrl) || REAL_LOGO_URL,
              text: 'لحوم ومصنّعات بلدي طازجة — سجق، بسطرمة، كفتة وطرب',
              count: counts.manufactured,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            id={tab.key}
            onClick={() => switchSection(tab.key)}
            className={cn(
              'rounded-2xl border p-5 text-start transition-all duration-300',
              section === tab.key
                ? 'border-primary bg-primary/8 shadow-[0_12px_35px_-20px_var(--brand-green)] ring-2 ring-primary/25'
                : 'border-border bg-white hover:border-primary/40 hover:shadow-md'
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                {tab.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={tab.image}
                    alt=""
                    className="size-8 shrink-0 rounded-full border border-border bg-white object-contain"
                  />
                ) : (
                  <span className="text-xl">{tab.emoji}</span>
                )}
                <span className="truncate text-lg font-black text-foreground">{tab.title}</span>
              </span>
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-[11px] font-bold',
                  section === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/70'
                )}
              >
                {tab.count} صنف
              </span>
            </span>
            <span className="mt-1.5 block text-[12px] text-muted-foreground">{tab.text}</span>
          </button>
        ))}
      </div>

      {/* ─── شريط البحث والفلترة ─── */}
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* البحث */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 start-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن صنف… مثال: كفتة"
              className="ps-11 h-11 bg-secondary/30 focus:bg-white"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute top-1/2 end-3 -translate-y-1/2 grid size-6 place-items-center rounded-full hover:bg-muted"
              >
                <X className="size-3.5 text-muted-foreground" />
              </button>
            ) : null}
          </div>

          {/* فلترة الأقسام */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            <div className="scroll-x flex gap-1.5 pb-0.5">
              <button
                type="button"
                onClick={() => setCategoryId('all')}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all',
                  categoryId === 'all'
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-secondary/40 text-foreground/75 hover:border-primary/50 hover:bg-white'
                )}
              >
                الكل
              </button>
              {sectionCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={cn(
                    'shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all',
                    categoryId === category.id
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-secondary/40 text-foreground/75 hover:border-primary/50 hover:bg-white'
                  )}
                >
                  {category.nameAr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── نتائج البحث ─── */}
      {visibleItems.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-white/70 p-12 text-center">
          <Search className="size-10 text-muted-foreground/30" />
          <div>
            <p className="font-black text-foreground/70">مفيش أصناف مطابقة</p>
            <p className="mt-1 text-sm text-muted-foreground">جرّب كلمة تانية أو اختار قسم مختلف</p>
          </div>
          <Button variant="outline" onClick={() => { setSearch(''); setCategoryId('all') }}>
            إعادة ضبط الفلتر
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-muted-foreground">
              {visibleItems.length} صنف
              {search ? ` — نتائج: "${search}"` : ''}
            </p>
            {count > 0 ? (
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/8 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/15 transition-colors"
              >
                <ShoppingCart className="size-3.5" />
                السلة ({count} صنف — {total} {settings.currency})
              </button>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((item) => (
              <ItemCard key={item.id} item={item} settings={settings} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
