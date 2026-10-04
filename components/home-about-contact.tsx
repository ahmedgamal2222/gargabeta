import { Bike, Clock, MapPin, MessageCircle, Phone, ShieldCheck, Snowflake } from 'lucide-react'

import BrandLogo from '@/components/brand-logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { generalWhatsappUrl, toInternationalNumber } from '@/lib/api'
import type { SiteSettings } from '@/lib/types'

const FEATURES = [
  { icon: Snowflake, title: 'تجهيز يومي', text: 'المصنعات تُجهَّز طازجة كل يوم مش مخزّنة.' },
  { icon: ShieldCheck, title: 'بدون إضافات صناعية', text: 'توابل ومقادير بيتية مظبوطة.' },
  { icon: Bike, title: 'توصيل سريع', text: 'داخل أسوان ولسه سخن.' },
]

export default function HomeAboutContact({ settings }: { settings: SiteSettings }) {
  return (
    <>
      {/* عن جرجبيتا */}
      <section id="about" className="relative py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
          <div className="flex flex-col items-start gap-5">
            <BrandLogo src={settings.logoUrl} name={settings.brandName} size="xl" />
            <Badge variant="orange">THE FOOD PRINT</Badge>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl">{settings.aboutTitle}</h2>
            <p className="text-sm leading-8 text-muted-foreground sm:text-[15px]">{settings.aboutText}</p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild variant="whatsapp">
                <a href={generalWhatsappUrl(settings)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  اطلب الآن
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="size-4" />
                  موقعنا على الخريطة
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title}>
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    <span className="grid size-11 place-items-center rounded-2xl border border-brand-green/25 bg-brand-green/10">
                      <Icon className="size-5 text-brand-green-deep" />
                    </span>
                    <p className="text-sm font-black text-foreground">{feature.title}</p>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">{feature.text}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* تواصل + العنوان */}
      <section id="contact" className="relative bg-white/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="success" className="mb-3">
              تواصل معنا
            </Badge>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl">
              طلبك يوصلك في <span className="text-brand-gradient">دقايق</span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              اطلب من الواتساب مباشرة، أو اتصل بينا. التوصيل داخل أسوان حسب المنطقة.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex h-full flex-col gap-2 p-5">
                <MapPin className="size-5 text-brand-green" />
                <p className="text-sm font-black text-foreground">العنوان</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">{settings.address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex h-full flex-col gap-2 p-5">
                <Clock className="size-5 text-brand-green" />
                <p className="text-sm font-black text-foreground">مواعيد العمل</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">{settings.hours}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex h-full flex-col gap-2 p-5">
                <Phone className="size-5 text-brand-green" />
                <p className="text-sm font-black text-foreground">اتصال</p>
                <a href={`tel:${settings.phone}`} dir="ltr" className="text-sm font-bold text-brand-red">
                  {settings.phone}
                </a>
                <p className="text-[12px] text-muted-foreground">{settings.deliveryNote}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <MessageCircle className="size-5 text-[#25D366]" />
                <p className="text-sm font-black text-foreground">أرقام الواتساب</p>
                <ul className="space-y-2">
                  {settings.whatsappNumbers.map((entry) => (
                    <li key={`${entry.number}-${entry.label}`}>
                      <a
                        href={generalWhatsappUrl(settings, `مرحبًا ${settings.brandName} 👋 عايز أطلب.`, entry.number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-bold text-foreground/80 transition-colors hover:text-primary"
                      >
                        {entry.label}: <span dir="ltr">{toInternationalNumber(entry.number)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="whatsapp" size="sm" className="mt-auto">
                  <a href={generalWhatsappUrl(settings)} target="_blank" rel="noopener noreferrer">
                    اطلب على الواتساب
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
