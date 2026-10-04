import type { Metadata } from 'next'

import CartDrawer from '@/components/cart-drawer'
import FloatingActions from '@/components/floating-actions'
import MenuExplorer from '@/components/menu-explorer'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { getSiteBundle } from '@/lib/api'
import { CartProvider } from '@/lib/cart'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'المنيو — مصنعات ومشويات',
  description:
    'منيو جرجبيتا الكامل: مصنعات اللحوم والفراخ واللانشون والبسطرمة، ومشويات وطواجن وساندوتشات ومشروبات. اطلب على الواتساب.',
}

export default async function MenuPage() {
  const { bundle } = await getSiteBundle()
  const { settings } = bundle

  return (
    <CartProvider>
      <SiteHeader settings={settings} />

      <main className="relative overflow-hidden pt-28 pb-8 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          </div>

          <div className="mt-10">
            <MenuExplorer bundle={bundle} settings={settings} />
          </div>
        </div>
      </main>

      <SiteFooter settings={settings} />
      <CartDrawer settings={settings} />
      <FloatingActions settings={settings} />
    </CartProvider>
  )
}
