'use client'

import { useCallback, useEffect, useState } from 'react'
import { KeyRound, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import UploadField from '@/components/admin/upload-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label, Textarea } from '@/components/ui/field'
import { adminApi } from '@/lib/api'
import type { SiteSettings, WhatsappNumber } from '@/lib/types'

type StringSettingKey = Exclude<keyof SiteSettings, 'whatsappNumbers'>

const TEXT_FIELDS: Array<{ key: StringSettingKey; label: string; hint?: string; ltr?: boolean }> = [
  { key: 'brandName', label: 'اسم المطعم' },
  { key: 'brandTagline', label: 'الوصف المختصر (اللوجو)' },
  { key: 'heroTitle', label: 'عنوان الهيرو' },
  { key: 'heroSubtitle', label: 'الوصف تحت العنوان' },
  { key: 'aboutTitle', label: 'عنوان «عن جرجبيتا»' },
  { key: 'address', label: 'العنوان' },
  { key: 'hours', label: 'مواعيد العمل' },
  { key: 'phone', label: 'رقم الهاتف (اتصال)', ltr: true },
  { key: 'currency', label: 'العملة' },
  { key: 'deliveryNote', label: 'ملاحظة التوصيل' },
  { key: 'minOrder', label: 'الحد الأدنى للطلب' },
  { key: 'mapUrl', label: 'رابط الخريطة', ltr: true },
  { key: 'instagram', label: 'رابط إنستغرام', ltr: true },
  { key: 'facebook', label: 'رابط فيسبوك', ltr: true },
  { key: 'tiktok', label: 'رابط تيك توك', ltr: true },
]

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', next: '' })
  const [changing, setChanging] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setSettings(await adminApi.getSettings())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((current) => (current ? { ...current, [key]: value } : current))

  const updateNumber = (index: number, patch: Partial<WhatsappNumber>) =>
    setSettings((current) => {
      if (!current) return current
      const numbers = current.whatsappNumbers.map((entry, position) => {
        if (position !== index) {
          return patch.isDefault ? { ...entry, isDefault: false } : entry
        }
        return { ...entry, ...patch }
      })
      return { ...current, whatsappNumbers: numbers }
    })

  const addNumber = () =>
    setSettings((current) =>
      current
        ? {
            ...current,
            whatsappNumbers: [
              ...current.whatsappNumbers,
              { label: 'رقم إضافي', number: '', isDefault: false },
            ],
          }
        : current
    )

  const removeNumber = (index: number) =>
    setSettings((current) => {
      if (!current) return current
      const numbers = current.whatsappNumbers.filter((_, position) => position !== index)
      if (numbers.length > 0 && !numbers.some((entry) => entry.isDefault)) {
        numbers[0] = { ...numbers[0], isDefault: true }
      }
      return { ...current, whatsappNumbers: numbers }
    })

  const save = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        brandName: settings.brandName,
        brandTagline: settings.brandTagline,
        logoUrl: settings.logoUrl,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroImage: settings.heroImage,
        aboutTitle: settings.aboutTitle,
        aboutText: settings.aboutText,
        address: settings.address,
        mapUrl: settings.mapUrl,
        hours: settings.hours,
        phone: settings.phone,
        currency: settings.currency,
        deliveryNote: settings.deliveryNote,
        minOrder: settings.minOrder,
        instagram: settings.instagram,
        facebook: settings.facebook,
        tiktok: settings.tiktok,
        whatsappNumbers: settings.whatsappNumbers,
      }

      const updated = await adminApi.updateSettings(payload)
      setSettings(updated)
      toast.success('تم حفظ الإعدادات ✅')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (passwords.next.length < 6) {
      toast.error('كلمة المرور الجديدة 6 أحرف على الأقل')
      return
    }
    setChanging(true)
    try {
      const result = await adminApi.changePassword(passwords.current, passwords.next)
      if (result.token) window.localStorage.setItem('gargabeta-admin-token', result.token)
      setPasswords({ current: '', next: '' })
      toast.success('تم تغيير كلمة المرور ✅')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر تغيير كلمة المرور')
    } finally {
      setChanging(false)
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-xs text-muted-foreground">
          تعذّر تحميل الإعدادات — تأكد أن الـ API يعمل ثم أعد المحاولة.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 p-5">
          <div>
            <h2 className="text-base font-black text-foreground">هوية المطعم</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              الاسم، اللوجو، عنوان الهيرو، وبيانات التواصل — كل ما يظهر في الموقع.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TEXT_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`setting-${field.key}`}>{field.label}</Label>
                <Input
                  id={`setting-${field.key}`}
                  dir={field.ltr ? 'ltr' : undefined}
                  value={String(settings[field.key] ?? '')}
                  onChange={(event) => update(field.key, event.target.value)}
                />
                {field.hint ? <p className="text-[11px] text-muted-foreground">{field.hint}</p> : null}
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <UploadField
              label="لوجو المطعم"
              accept="image"
              value={settings.logoUrl}
              onChange={(value) => update('logoUrl', value)}
              hint="يظهر في الهيدر والفوتر وشاشة الدخول."
            />
            <UploadField
              label="صورة/فيديو الهيرو"
              accept="both"
              value={settings.heroImage}
              onChange={(value) => update('heroImage', value)}
              hint="الخلفية في أول الصفحة."
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-5 p-5">
          <div>
            <h2 className="text-base font-black text-foreground">عن جرجبيتا</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              العنوان والنص اللذان يقرأهما الزائر عن المطعم.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="about-title">عنوان القسم</Label>
            <Input
              id="about-title"
              value={settings.aboutTitle}
              onChange={(event) => update('aboutTitle', event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="about-text">نص «عن جرجبيتا»</Label>
            <Textarea
              id="about-text"
              value={settings.aboutText}
              onChange={(event) => update('aboutText', event.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-foreground">أرقام الواتساب</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                الطلبات تُرسل إلى الرقم المحدد «افتراضي»، ويمكنك إضافة أي عدد من الأرقام.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addNumber}>
              <Plus className="size-3.5" />
              إضافة رقم
            </Button>
          </div>

          <div className="space-y-3">
            {settings.whatsappNumbers.map((entry, index) => (
              <div
                key={`${entry.number}-${index}`}
                className="grid items-end gap-3 rounded-2xl border border-border bg-secondary/30 p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
              >
                <div className="space-y-1.5">
                  <Label htmlFor={`wa-label-${index}`}>الوصف</Label>
                  <Input
                    id={`wa-label-${index}`}
                    value={entry.label}
                    placeholder="الطلبات"
                    onChange={(event) => updateNumber(index, { label: event.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`wa-number-${index}`}>الرقم (بصيغة دولية)</Label>
                  <Input
                    id={`wa-number-${index}`}
                    dir="ltr"
                    value={entry.number}
                    placeholder="201159353495"
                    onChange={(event) => updateNumber(index, { number: event.target.value })}
                  />
                </div>
                <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-white px-3 text-xs font-bold text-foreground">
                  <input
                    type="radio"
                    name="default-whatsapp-number"
                    checked={entry.isDefault}
                    onChange={() => updateNumber(index, { isDefault: true })}
                    className="size-4 accent-[var(--brand-green)]"
                  />
                  افتراضي
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="حذف الرقم"
                  disabled={settings.whatsappNumbers.length === 1}
                  onClick={() => removeNumber(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4" />
            <h2 className="text-base font-black text-foreground">تغيير كلمة المرور</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">كلمة المرور الحالية</Label>
              <Input
                id="current-password"
                type="password"
                dir="ltr"
                autoComplete="current-password"
                value={passwords.current}
                onChange={(event) =>
                  setPasswords((current) => ({ ...current, current: event.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="next-password">كلمة المرور الجديدة (6 أحرف فأكثر)</Label>
              <Input
                id="next-password"
                type="password"
                dir="ltr"
                autoComplete="new-password"
                value={passwords.next}
                onChange={(event) =>
                  setPasswords((current) => ({ ...current, next: event.target.value }))
                }
              />
            </div>
          </div>
          <Button type="button" variant="outline" onClick={changePassword} disabled={changing}>
            {changing ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            تحديث كلمة المرور
          </Button>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-30 flex justify-end">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          حفظ كل الإعدادات
        </Button>
      </div>
    </div>
  )
}
