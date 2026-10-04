'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label, Select, Textarea } from '@/components/ui/field'
import { useCart } from '@/lib/cart'
import { resolveAssetUrl, submitOrder, toInternationalNumber } from '@/lib/api'
import type { SiteSettings } from '@/lib/types'

/** يبني رسالة الواتساب محليًا (تُستخدم لو تعذّر الاتصال بالـ API) */
function buildLocalMessage(options: {
  brandName: string
  currency: string
  customerName: string
  customerPhone: string
  area: string
  address: string
  notes: string
  lines: Array<{ nameAr: string; quantity: number; unitAr: string; price: number }>
  total: number
}): string {
  const rows = options.lines
    .map(
      (line) =>
        `• ${line.nameAr} × ${line.quantity}${line.unitAr ? ` ${line.unitAr}` : ''} = ${
          line.price * line.quantity
        } ${options.currency}`
    )
    .join('\n')

  const parts = [
    `🍽️ *طلب جديد من ${options.brandName}*`,
    '',
    `👤 الاسم: ${options.customerName || '—'}`,
    `📞 الهاتف: ${options.customerPhone || '—'}`,
  ]
  if (options.area) parts.push(`📍 المنطقة: ${options.area}`)
  if (options.address) parts.push(`🏠 العنوان: ${options.address}`)
  parts.push('', '*الأصناف:*', rows, '', `💰 *الإجمالي: ${options.total} ${options.currency}*`)
  if (options.notes) parts.push('', `📝 ملاحظات: ${options.notes}`)
  return parts.join('\n')
}

export default function CartDrawer({ settings }: { settings: SiteSettings }) {
  const { lines, count, total, isOpen, closeCart, increment, decrement, remove, clear } = useCart()

  const [form, setForm] = useState({ name: '', phone: '', area: '', address: '', notes: '' })
  const [targetNumber, setTargetNumber] = useState(
    settings.whatsappNumbers.find((entry) => entry.isDefault)?.number ??
      settings.whatsappNumbers[0]?.number ??
      ''
  )
  const [sending, setSending] = useState(false)

  const update =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }))

  /** إتمام الطلب: تسجيله في قاعدة البيانات ثم فتح الواتساب برسالة جاهزة */
  const checkout = async () => {
    if (lines.length === 0) {
      toast.error('السلة فاضية — اختار أصنافك الأول 🙂')
      return
    }
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('اكتب اسمك ورقم هاتفك لإتمام الطلب')
      return
    }

    setSending(true)

    const payload = {
      customerName: form.name.trim(),
      customerPhone: form.phone.trim(),
      area: form.area.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      items: lines.map((line) => ({ id: line.id, quantity: line.quantity })),
      targetNumber: targetNumber || undefined,
    }

    const result = await submitOrder(payload)

    if (result.ok && result.whatsappUrl) {
      window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer')
      toast.success('تم تسجيل طلبك ✅', {
        description: result.orderId
          ? `رقم الطلب #${result.orderId} — كمّل الإرسال على الواتساب.`
          : undefined,
      })
      clear()
      setForm({ name: '', phone: '', area: '', address: '', notes: '' })
      closeCart()
      setSending(false)
      return
    }

    // تعذّر الاتصال بالـ API: نبني الرسالة محليًا ونفتح الواتساب مباشرة
    const fallbackNumber = toInternationalNumber(targetNumber || '201159353495')
    const message = buildLocalMessage({
      brandName: settings.brandName,
      currency: settings.currency,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      area: payload.area,
      address: payload.address,
      notes: payload.notes,
      lines: lines.map((line) => ({
        nameAr: line.nameAr,
        quantity: line.quantity,
        unitAr: line.unitAr,
        price: line.price,
      })),
      total,
    })

    window.open(`https://wa.me/${fallbackNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    toast.warning('فتحنا الواتساب مباشرة', {
      description: result.error ?? 'تعذّر الاتصال بالخادم — الطلب اتفتح على الواتساب.',
    })
    setSending(false)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
      onClick={closeCart}
      aria-modal="true"
      role="dialog"
      aria-label="سلة الطلبات"
    >
      <aside
        className="absolute inset-y-0 end-0 flex w-full max-w-lg flex-col bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* ====== رأس السلة ====== */}
        <header className="flex items-center justify-between border-b border-border bg-gradient-to-l from-primary/8 via-transparent to-transparent px-5 py-4">
          <span className="flex items-center gap-2.5 font-black text-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-primary/15">
              <ShoppingBag className="size-5 text-primary" />
            </span>
            <span>
              سلة الطلبات
              {count > 0 ? (
                <span className="ms-2 inline-flex size-6 items-center justify-center rounded-full bg-brand-red text-[11px] font-black text-white">
                  {count}
                </span>
              ) : null}
            </span>
          </span>
          <button
            type="button"
            onClick={closeCart}
            aria-label="إغلاق السلة"
            className="grid size-9 place-items-center rounded-full border border-border transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* ====== محتوى السلة (قابل للتمرير) ====== */}
        <div className="flex-1 overflow-y-auto">
          {/* قائمة الأصناف */}
          {lines.length === 0 ? (
            <div className="grid place-items-center gap-4 py-24 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-secondary">
                <ShoppingBag className="size-9 text-muted-foreground/40" />
              </span>
              <div>
                <p className="font-black text-foreground/80">السلة فاضية</p>
                <p className="mt-1 text-sm text-muted-foreground">اختار أصنافك من المنيو وضيفها هنا.</p>
              </div>
              <Button type="button" variant="outline" onClick={closeCart}>
                تصفّح المنيو
              </Button>
            </div>
          ) : (
            <div className="px-5 py-4">
              {/* ─── الأصناف ─── */}
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  الأصناف ({lines.length})
                </p>
                <button
                  type="button"
                  onClick={clear}
                  className="text-[11px] font-bold text-destructive hover:underline"
                >
                  مسح الكل
                </button>
              </div>

              <ul className="mt-3 space-y-2.5">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm"
                  >
                    {/* صورة / حرف */}
                    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary text-lg font-black text-primary">
                      {line.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={resolveAssetUrl(line.imageUrl)}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        line.nameAr.slice(0, 1)
                      )}
                    </span>

                    {/* الاسم والسعر */}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground">{line.nameAr}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {line.price} {settings.currency}
                        {line.unitAr ? ` / ${line.unitAr}` : ''}
                      </span>
                      <span className="block text-[11px] font-bold text-brand-red mt-0.5">
                        الإجمالي: {line.price * line.quantity} {settings.currency}
                      </span>
                    </span>

                    {/* أزرار الكمية */}
                    <span className="flex items-center gap-1 rounded-full border-2 border-border bg-secondary/40 px-1">
                      <button
                        type="button"
                        onClick={() => increment(line.id)}
                        aria-label="زيادة"
                        className="grid size-7 place-items-center rounded-full hover:bg-primary/20 text-primary transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-black text-foreground">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => decrement(line.id)}
                        aria-label="تقليل"
                        className="grid size-7 place-items-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Minus className="size-3.5" />
                      </button>
                    </span>

                    {/* حذف */}
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      aria-label="حذف الصنف"
                      className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* ─── ملخص الأسعار ─── */}
              <div className="mt-4 rounded-2xl border border-border bg-white/80 p-4 space-y-2">
                {lines.map((line) => (
                  <div key={line.id} className="flex items-center justify-between text-[12px] text-muted-foreground">
                    <span className="truncate max-w-[60%]">
                      {line.nameAr} × {line.quantity}
                    </span>
                    <span className="font-bold text-foreground/80">
                      {line.price * line.quantity} {settings.currency}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="text-sm font-black text-foreground">الإجمالي</span>
                  <span className="text-xl font-black text-brand-red">
                    {total} {settings.currency}
                  </span>
                </div>
                {settings.minOrder ? (
                  <p className="text-[11px] text-muted-foreground">{settings.minOrder}</p>
                ) : null}
                {settings.deliveryNote ? (
                  <p className="text-[11px] text-muted-foreground">🚴 {settings.deliveryNote}</p>
                ) : null}
              </div>
            </div>
          )}

          {/* ─── نموذج بيانات العميل ─── */}
          {lines.length > 0 ? (
            <div className="border-t border-border bg-secondary/20 px-5 py-5">
              <p className="mb-4 flex items-center gap-2 text-sm font-black text-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                بيانات التوصيل
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* الاسم */}
                <div className="space-y-1.5">
                  <Label htmlFor="cart-name" className="text-xs font-bold flex items-center gap-1">
                    <User className="size-3 text-primary" />
                    الاسم *
                  </Label>
                  <Input
                    id="cart-name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="اسمك الكريم"
                    className="bg-white"
                  />
                </div>

                {/* الهاتف */}
                <div className="space-y-1.5">
                  <Label htmlFor="cart-phone" className="text-xs font-bold flex items-center gap-1">
                    <Phone className="size-3 text-primary" />
                    الهاتف *
                  </Label>
                  <Input
                    id="cart-phone"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="01xxxxxxxxx"
                    inputMode="tel"
                    dir="ltr"
                    className="bg-white"
                  />
                </div>

                {/* المنطقة */}
                <div className="space-y-1.5">
                  <Label htmlFor="cart-area" className="text-xs font-bold flex items-center gap-1">
                    <MapPin className="size-3 text-primary" />
                    المنطقة
                  </Label>
                  <Input
                    id="cart-area"
                    value={form.area}
                    onChange={update('area')}
                    placeholder="مثال: الصداقة"
                    className="bg-white"
                  />
                </div>

                {/* العنوان */}
                <div className="space-y-1.5">
                  <Label htmlFor="cart-address" className="text-xs font-bold">
                    العنوان التفصيلي
                  </Label>
                  <Input
                    id="cart-address"
                    value={form.address}
                    onChange={update('address')}
                    placeholder="شارع / علامة مميزة"
                    className="bg-white"
                  />
                </div>

                {/* اختيار رقم الواتساب */}
                {settings.whatsappNumbers.length > 1 ? (
                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="cart-number" className="text-xs font-bold">
                      إرسال على رقم
                    </Label>
                    <Select
                      id="cart-number"
                      value={targetNumber}
                      onChange={(event) => setTargetNumber(event.target.value)}
                      className="bg-white"
                    >
                      {settings.whatsappNumbers.map((entry) => (
                        <option key={entry.number} value={entry.number}>
                          {entry.label} — {entry.number}
                        </option>
                      ))}
                    </Select>
                  </div>
                ) : null}

                {/* الملاحظات */}
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="cart-notes" className="text-xs font-bold">
                    ملاحظات إضافية
                  </Label>
                  <Textarea
                    id="cart-notes"
                    value={form.notes}
                    onChange={update('notes')}
                    placeholder="مثال: السجق حار شوية، والتوصيل بعد المغرب."
                    className="min-h-[72px] bg-white"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* ====== تذييل: زر إتمام الطلب ====== */}
        {lines.length > 0 ? (
          <div className="border-t border-border bg-white px-5 py-4 shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.12)]">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-bold text-muted-foreground">{count} صنف</span>
              <span className="text-lg font-black text-brand-red">
                {total} {settings.currency}
              </span>
            </div>

            <Button
              type="button"
              variant="whatsapp"
              className="w-full h-12 text-base font-black gap-2 shadow-lg hover:shadow-xl transition-shadow"
              onClick={checkout}
              disabled={sending || lines.length === 0}
            >
              {sending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              )}
              {sending ? 'جاري الإرسال...' : `إتمام الطلب على الواتساب — ${total} ${settings.currency}`}
            </Button>

            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              سيُفتح الواتساب برسالة جاهزة — راجعها وابعتها 📲
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  )
}

