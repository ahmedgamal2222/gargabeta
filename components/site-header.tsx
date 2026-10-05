'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, Menu, Phone, ShoppingBag, X } from 'lucide-react'

import BrandLogo from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { generalWhatsappUrl } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/lib/types'

const NAV_LINKS = [
  { label: 'الرئيسية', href: '/' },
  { label: 'المنيو', href: '/menu' },
  { label: 'المصنعات', href: '/menu#products' },
  { label: 'فروعنا', href: '/#branches' },
  { label: 'المعرض', href: '/#gallery' },
  { label: 'عن جرجبيتا', href: '/#about' },
  { label: 'تواصل معنا', href: '/#contact' },
]

export default function SiteHeader({ settings }: { settings: SiteSettings }) {
  const { count, openCart } = useCart()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ===== شريط علوي للمعلومات — يختفي عند النزول لتوفير مساحة ===== */}
      <div
        className={cn(
          'overflow-hidden bg-gradient-to-l from-brand-green-deep via-brand-green to-brand-green-deep text-white transition-all duration-300',
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-[11px] font-semibold sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone}`} dir="ltr" className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
              <Phone className="size-3.5" />
              {settings.phone}
            </a>
            <span className="hidden items-center gap-1.5 opacity-90 sm:flex">
              <Clock className="size-3.5" />
              {settings.hours}
            </span>
          </div>
          <span className="truncate opacity-90">{settings.deliveryNote}</span>
        </div>
      </div>

      {/* ===== الشريط الرئيسي ===== */}
      <div
        className={cn(
          'transition-all duration-300',
          scrolled ? 'glass-panel shadow-[0_10px_40px_-30px_rgba(0,0,0,0.5)]' : 'bg-white/90 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo src={settings.logoUrl} name={settings.brandName} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-base font-black text-foreground sm:text-lg">
                {settings.brandName}
              </span>
              <span className="hidden text-[11px] font-semibold text-muted-foreground sm:block">
                {settings.brandTagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const basePath = link.href.split('#')[0] || '/'
              const isActive = basePath === pathname && !link.href.includes('#')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                    'text-foreground/80 hover:bg-primary/10 hover:text-primary',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              aria-label="سلة الطلبات"
              className="relative grid size-10 place-items-center rounded-full border border-border bg-white text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ShoppingBag className="size-5" />
              {count > 0 ? (
                <span className="absolute -top-1 -end-1 grid size-5 place-items-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </button>

            <Button asChild variant="whatsapp" size="sm" className="glow-pulse hidden sm:inline-flex">
              <a href={generalWhatsappUrl(settings)} target="_blank" rel="noopener noreferrer">
                اطلب على الواتساب
              </a>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="القائمة"
              className="grid size-10 place-items-center rounded-full border border-border bg-white lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* خط تدرّج أخضر رفيع أسفل الهيدر لإحساس احترافي */}
        <span
          aria-hidden
          className="block h-[3px] w-full bg-gradient-to-l from-transparent via-brand-green to-transparent opacity-70"
        />
      </div>

      {/* قائمة الجوال */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute inset-y-0 end-0 flex w-[82%] max-w-sm flex-col gap-2 bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 font-black">
                <BrandLogo src={settings.logoUrl} name={settings.brandName} size="sm" />
                {settings.brandName}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="إغلاق"
                className="grid size-9 place-items-center rounded-full border border-border"
              >
                <X className="size-4" />
              </button>
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}

            <Button asChild variant="whatsapp" className="mt-4">
              <a href={generalWhatsappUrl(settings)} target="_blank" rel="noopener noreferrer">
                اطلب على الواتساب
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
