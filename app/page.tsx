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

export const revalidate = 0
export const dynamic = 'force-static'

export default async function HomePage() {
  const { bundle } = await getSiteBundle()
  const { settings, media } = bundle

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: settings.brandName,
    description: settings.heroSubtitle,
    image: settings.logoUrl,
    servesCuisine: ['مشويات', 'لحوم', 'مصنعات لحوم', 'مأكولات مصرية'],
    priceRange: '$$',
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'أسوان',
      addressCountry: 'EG',
    },
    openingHours: settings.hours,
    hasMap: settings.mapUrl,
    acceptsReservations: false,
  }

  return (
    <CartProvider>
      <SiteHeader settings={settings} />
      <main className="relative overflow-hidden">
        <Hero settings={settings} />
        <HomeMenus bundle={bundle} settings={settings} />
        <HomeGallery media={media} />
        <HomeAboutContact settings={settings} />
      </main>
      <SiteFooter settings={settings} />
      <CartDrawer settings={settings} />
      <FloatingActions settings={settings} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </CartProvider>
  )
}
