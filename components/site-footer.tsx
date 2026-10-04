import Link from 'next/link'
import { Clock, Instagram, MapPin, Phone } from 'lucide-react'

import BrandLogo from '@/components/brand-logo'
import { generalWhatsappUrl } from '@/lib/api'
import type { SiteSettings } from '@/lib/types'

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-border bg-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BrandLogo src={settings.logoUrl} name={settings.brandName} size="md" />
            <div>
              <p className="text-lg font-black text-foreground">{settings.brandName}</p>
              <p className="text-xs font-semibold text-muted-foreground">{settings.brandTagline}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{settings.aboutText}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-black text-foreground">روابط سريعة</p>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'المنيو الكامل', href: '/menu' },
              { label: 'منيو المصنعات', href: '/menu#products' },
              { label: 'منيو المطعم', href: '/menu#restaurant' },
              { label: 'المعرض والفيديوهات', href: '/#gallery' },
              { label: 'لوحة التحكم', href: '/admin' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-black text-foreground">تواصل معنا</p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-green" />
              <span>{settings.hours}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-brand-green" />
              <a href={`tel:${settings.phone}`} dir="ltr" className="hover:text-primary">
                {settings.phone}
              </a>
            </li>
          </ul>

          <div className="flex flex-wrap gap-2 pt-1">
            {settings.whatsappNumbers.map((entry) => (
              <a
                key={`${entry.number}-${entry.label}`}
                href={generalWhatsappUrl(settings, `مرحبًا ${settings.brandName} 👋`, entry.number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                واتساب {entry.label}: <span dir="ltr">{entry.number}</span>
              </a>
            ))}
            {settings.instagram ? (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="size-3.5" /> إنستغرام
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-[11px] text-muted-foreground sm:px-6 lg:px-8">
        © {year} {settings.brandName} — جميع الحقوق محفوظة. الأسعار قابلة للتغيير حسب السوق.
      </div>
    </footer>
  )
}
