'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import CartDrawer from '@/components/cart-drawer'
import FloatingActions from '@/components/floating-actions'
import Hero from '@/components/home-hero'
import HomeAboutContact from '@/components/home-about-contact'
import HomeGallery from '@/components/home-gallery'
import HomeMenus from '@/components/home-menus'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
import { getSiteBundle } from '@/lib/api'
import { CartProvider } from '@/lib/cart'
import { fallbackBundle } from '@/lib/fallback-data'
import type { SiteBundle } from '@/lib/types'

export default function HomePage() {
  const [bundle, setBundle] = useState<SiteBundle>(fallbackBundle)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSiteBundle().then(({ bundle: b }) => {
      setBundle(b)
      setLoading(false)
    })
  }, [])

  const { settings, media } = bundle

  return (
    <CartProvider>
      <SiteHeader settings={settings} />
      <main className="relative overflow-hidden">
        {loading ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm font-bold text-muted-foreground">جاري تحميل المنيو…</p>
            </div>
          </div>
        ) : (
          <>
            <Hero settings={settings} />
            <HomeMenus bundle={bundle} settings={settings} />
            <HomeGallery media={media} />
            <HomeAboutContact settings={settings} />
          </>
        )}
      </main>
      <SiteFooter settings={settings} />
      <CartDrawer settings={settings} />
      <FloatingActions settings={settings} />
    </CartProvider>
  )
}
