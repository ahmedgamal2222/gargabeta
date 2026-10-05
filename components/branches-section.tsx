import { MapPin, Navigation, Phone } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BRANCHES } from '@/lib/real-images'

/** قسم «فروعنا»: بطاقة لكل فرع بصورة وعنوان وأرقام وزر فتح الخريطة */
export default function BranchesSection() {
  return (
    <section id="branches" className="relative py-16 sm:py-20">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 start-0 size-72 rounded-full bg-brand-green/10 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="success" className="mb-3">
            فروعنا
          </Badge>
          <h2 className="text-2xl font-black text-foreground sm:text-3xl">
            جرجبيتا <span className="text-brand-gradient">قريبة منك</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            زورنا في أقرب فرع أو اطلب التوصيل مباشرة على الواتساب.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {BRANCHES.map((branch) => (
            <Card key={branch.id} className="overflow-hidden p-0">
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branch.image}
                  alt={branch.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute bottom-3 start-4 text-base font-black text-white drop-shadow">
                  {branch.name}
                </span>
              </div>

              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green" />
                  <p className="text-sm font-semibold text-muted-foreground">{branch.address}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {branch.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-bold text-foreground/85 transition-colors hover:border-primary hover:text-primary"
                    >
                      <Phone className="size-3.5 text-brand-green" />
                      {phone}
                    </a>
                  ))}
                </div>

                <Button asChild variant="outline" className="mt-1 gap-2">
                  <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="size-4" />
                    فتح في خرائط جوجل
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
