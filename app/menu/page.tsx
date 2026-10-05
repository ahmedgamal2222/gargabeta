'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import CartDrawer from '@/components/cart-drawer'
import FloatingActions from '@/components/floating-actions'
import MarqueeStrip from '@/components/marquee-strip'
import MenuExplorer from '@/components/menu-explorer'
import ShareMenuButton from '@/components/share-menu-button'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { getSiteBundle } from '@/lib/api'
import { CartProvider } from '@/lib/cart'
import { fallbackBundle } from '@/lib/fallback-data'
import type { SiteBundle } from '@/lib/types'

export default function MenuPage() {
  const [bundle, setBundle] = useState<SiteBundle>(fallbackBundle)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSiteBundle().then(({ bundle: b }) => {
      setBundle(b)
      setLoading(false)
    })
  }, [])

  const { settings } = bundle

  return (
    <CartProvider>
      <SiteHeader settings={settings} />

      <main className="relative overflow-hidden pt-28 pb-8 sm:pt-32">
        <MarqueeStrip />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="success" className="mb-3">
              المنيو الكامل
            </Badge>
            <h1 className="text-3xl font-black text-foreground sm:text-4xl">
              منيو <span className="text-brand-gradient">{settings.brandName}</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              ضيف أصنافك للسلة وابعت الطلب على الواتساب — {settings.deliveryNote}. {settings.minOrder}
            </p>

            <div className="mt-5 flex items-center justify-center">
              <ShareMenuButton />
            </div>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="size-10 animate-spin text-primary" />
                  <p className="text-sm font-bold text-muted-foreground">جاري تحميل المنيو…</p>
                </div>
              </div>
            ) : (
              <MenuExplorer bundle={bundle} settings={settings} />
            )}
          </div>
        </div>
      </main>

      <SiteFooter settings={settings} />
      <CartDrawer settings={settings} />
      <FloatingActions settings={settings} />
    </CartProvider>
  )
}
