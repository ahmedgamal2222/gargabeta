'use client'

import { useCallback, useEffect, useState } from 'react'
import { Image as ImageIcon, Loader2, Pencil, Plus, Trash2, Video } from 'lucide-react'
import { toast } from 'sonner'

import UploadField from '@/components/admin/upload-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label, Select, Textarea } from '@/components/ui/field'
import { adminApi, resolveAssetUrl } from '@/lib/api'
import type { MediaItem } from '@/lib/types'

const EMPTY_FORM = {
  id: 0,
  type: 'photo' as 'photo' | 'video',
  titleAr: '',
  descriptionAr: '',
  url: '',
  thumbnailUrl: '',
  isFeatured: true,
  sortOrder: 99,
}

export default function MediaPanel() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setMedia(await adminApi.listMedia())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر تحميل الوسائط')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const reset = () => setForm(EMPTY_FORM)

  const save = async () => {
    if (!form.url.trim()) {
      toast.error('أضف رابط الملف أو ارفع صورة/فيديو')
      return
    }

    setSaving(true)
    const payload = {
      type: form.type,
      titleAr: form.titleAr || (form.type === 'video' ? 'فيديو' : 'صورة'),
      descriptionAr: form.descriptionAr,
      url: form.url,
      thumbnailUrl: form.thumbnailUrl,
      isFeatured: form.isFeatured,
      sortOrder: Number(form.sortOrder) || 99,
    }

    try {
      if (form.id) {
        await adminApi.updateMedia(form.id, payload)
        toast.success('تم تحديث الوسيط')
      } else {
        await adminApi.createMedia(payload)
        toast.success('تم إضافة الوسيط')
      }
      reset()
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: MediaItem) => {
    if (!window.confirm(`حذف «${item.titleAr}»؟`)) return
    try {
      await adminApi.deleteMedia(item.id)
      toast.success('تم الحذف')
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحذف')
    }
  }

  const startEdit = (item: MediaItem) => {
    setForm({
      id: item.id,
      type: item.type,
      titleAr: item.titleAr,
      descriptionAr: item.descriptionAr,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? '',
      isFeatured: item.isFeatured === 1,
      sortOrder: item.sortOrder,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-foreground">الصور والفيديوهات ({media.length})</p>
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              <Plus className="size-3.5" />
              جديد
            </Button>
          </div>

          {loading ? (
            <div className="grid place-items-center py-12">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {media.map((item) => (
                <li key={item.id} className="overflow-hidden rounded-2xl border border-border">
                  <div className="grid aspect-video place-items-center bg-secondary/60">
                    {item.type === 'photo' && item.url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={resolveAssetUrl(item.thumbnailUrl ?? item.url)}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex flex-col items-center gap-1 text-muted-foreground/70">
                        {item.type === 'video' ? (
                          <Video className="size-6" />
                        ) : (
                          <ImageIcon className="size-6" />
                        )}
                        <span className="text-[10px]">{item.type === 'video' ? 'فيديو' : 'صورة'}</span>
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="flex items-center gap-2 text-xs font-black text-foreground">
                      {item.titleAr}
                      <Badge variant={item.type === 'video' ? 'orange' : 'success'}>
                        {item.type === 'video' ? 'فيديو' : 'صورة'}
                      </Badge>
                    </p>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(item)}>
                        <Pencil className="size-3.5" />
                        تعديل
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => remove(item)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
              {media.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground sm:col-span-2">
                  لا توجد وسائط — أضف صور المطعم وفيديوهاته من النموذج المجاور.
                </li>
              ) : null}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-black text-foreground">
            {form.id ? `تعديل الوسيط #${form.id}` : 'إضافة صورة أو فيديو'}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>النوع</Label>
              <Select
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value as 'photo' | 'video' })
                }
              >
                <option value="photo">صورة</option>
                <option value="video">فيديو</option>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>العنوان</Label>
              <Input
                value={form.titleAr}
                onChange={(event) => setForm({ ...form, titleAr: event.target.value })}
                placeholder="مثال: جولة في المطبخ"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>وصف مختصر</Label>
            <Textarea
              value={form.descriptionAr}
              onChange={(event) => setForm({ ...form, descriptionAr: event.target.value })}
              className="min-h-16"
              placeholder="لقطات من تجهيز المصنعات"
            />
          </div>

          <UploadField
            label={form.type === 'video' ? 'ملف الفيديو أو رابط يوتيوب' : 'ملف الصورة'}
            value={form.url}
            onChange={(value) => setForm({ ...form, url: value })}
            accept={form.type === 'video' ? 'both' : 'image'}
            hint="الفيديوهات: الأفضل رابط يوتيوب (يُشغَّل داخل الموقع) أو ارفع ملفًا صغيرًا."
          />

          {form.type === 'video' ? (
            <UploadField
              label="صورة الغلاف (اختياري)"
              value={form.thumbnailUrl}
              onChange={(value) => setForm({ ...form, thumbnailUrl: value })}
              accept="image"
            />
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>يظهر في المقدمة؟</Label>
              <Select
                value={form.isFeatured ? '1' : '0'}
                onChange={(event) => setForm({ ...form, isFeatured: event.target.value === '1' })}
              >
                <option value="1">نعم</option>
                <option value="0">لا</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>الترتيب</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={save} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {form.id ? 'حفظ التعديلات' : 'إضافة'}
            </Button>
            {form.id ? (
              <Button type="button" variant="outline" onClick={reset}>
                إلغاء
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
