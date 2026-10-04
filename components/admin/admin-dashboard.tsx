'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BadgePercent,
  ClipboardList,
  ExternalLink,
  Images,
  LayoutDashboard,
  ListTree,
  LogOut,
  Settings,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react'

import BrandLogo from '@/components/brand-logo'
import CategoriesPanel from '@/components/admin/categories-panel'
import ItemsPanel from '@/components/admin/items-panel'
import MediaPanel from '@/components/admin/media-panel'
import OrdersPanel from '@/components/admin/orders-panel'
import SettingsPanel from '@/components/admin/settings-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { adminApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { AdminOverview, AdminUser } from '@/lib/types'

type TabKey = 'overview' | 'categories' | 'items' | 'media' | 'orders' | 'settings'

const TABS: Array<{ key: TabKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { key: 'categories', label: 'الأقسام', icon: ListTree },
  { key: 'items', label: 'الأصناف', icon: UtensilsCrossed },
  { key: 'media', label: 'الوسائط', icon: Images },
  { key: 'orders', label: 'الطلبات', icon: ClipboardList },
  { key: 'settings', label: 'الإعدادات', icon: Settings },
]

function OverviewTab() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setOverview(await adminApi.overview())
    } catch {
      // تجاهل — سيظهر صفر
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const counts = overview?.counts ?? {}
  const cards = [
    { label: 'أقسام المنيو', value: counts.categories ?? 0, icon: ListTree },
    { label: 'أصناف المنيو', value: counts.items ?? 0, icon: UtensilsCrossed },
    { label: 'صور وفيديوهات', value: counts.media ?? 0, icon: Images },
    { label: 'طلبات جديدة', value: counts.newOrders ?? 0, icon: BadgePercent },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <CardContent className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-2xl font-black text-foreground">
                    {loading ? '…' : card.value}
                  </p>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl border border-brand-green/25 bg-brand-green/10">
                  <Icon className="size-5 text-brand-green-deep" />
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-black text-foreground">
              <ShoppingBag className="size-4 text-brand-green" />
              إجمالي قيمة الطلبات
            </p>
            <span className="text-lg font-black text-brand-red">
              {loading ? '…' : (counts.ordersTotal ?? 0).toLocaleString('ar-EG')} ج.م
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-xs font-bold text-muted-foreground">أحدث الطلبات</p>
            {overview?.recent?.length ? (
              <ul className="divide-y divide-border rounded-xl border border-border">
                {overview.recent.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                  >
                    <span className="text-sm font-bold text-foreground">
                      #{order.id} — {order.customerName || 'بدون اسم'}
                    </span>
                    <span className="text-xs text-muted-foreground" dir="ltr">
                      {order.customerPhone}
                    </span>
                    <span className="text-sm font-black text-brand-red">{order.total} ج.م</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                لا توجد طلبات بعد — أول طلب من الموقع هيظهر هنا.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboard({
  admin,
  onLogout,
}: {
  admin: AdminUser
  onLogout: () => void
}) {
  const [tab, setTab] = useState<TabKey>('overview')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BrandLogo src="/images/logo.jpeg" name="جرجبيتا" size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-black text-foreground">لوحة تحكم جرجبيتا</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {admin.name} — <span dir="ltr">{admin.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                <ExternalLink className="size-3.5" />
                الموقع
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="size-3.5" />
              خروج
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
          <div className="scroll-x flex gap-2 pb-1">
            {TABS.map((entry) => {
              const Icon = entry.icon
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => setTab(entry.key)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors',
                    tab === entry.key
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-white text-foreground/75 hover:border-primary/50'
                  )}
                >
                  <Icon className="size-3.5" />
                  {entry.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === 'overview' ? <OverviewTab /> : null}
        {tab === 'categories' ? <CategoriesPanel /> : null}
        {tab === 'items' ? <ItemsPanel /> : null}
        {tab === 'media' ? <MediaPanel /> : null}
        {tab === 'orders' ? <OrdersPanel /> : null}
        {tab === 'settings' ? <SettingsPanel /> : null}
      </main>
    </div>
  )
}
