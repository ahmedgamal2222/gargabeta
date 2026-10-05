'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import UploadField from '@/components/admin/upload-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label, Select } from '@/components/ui/field'
import { adminApi } from '@/lib/api'
import type { Category, MenuItem } from '@/lib/types'

const EMPTY_FORM = {
  id: 0,
  categoryId: 0,
  nameAr: '',
  nameEn: '',
  descriptionAr: '',
  price: 0,
  unitAr: 'كيلو',
  imageUrl: '',
  isFeatured: false,
  isAvailable: true,
  tagsAr: '',
  sortOrder: 99,
}

const UNITS = ['كيلو', 'نصف كيلو', 'ربع كيلو', 'طبق', 'ساندوتش', 'وجبة', 'حبة', 'صينية', 'طاجن', 'كوب', 'زجاجة', 'طبق صغير']

export default function ItemsPanel() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [sectionFilter, setSectionFilter] = useState<'all' | 'restaurant' | 'products' | 'manufactured'>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [itemsList, categoriesList] = await Promise.all([
        adminApi.listItems(),
        adminApi.listCategories(),
      ])
      setItems(itemsList)
      setCategories(categoriesList)
      setForm((current) => (current.categoryId ? current : { ...current, categoryId: categoriesList[0]?.id ?? 0 }))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر تحميل الأصناف')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return items.filter((item) => {
      if (sectionFilter !== 'all' && item.categorySection !== sectionFilter) return false
      if (!needle) return true
      return item.nameAr.toLowerCase().includes(needle) || item.tagsAr.toLowerCase().includes(needle)
    })
  }, [items, search, sectionFilter])

  const reset = () => setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? 0 })

  const save = async () => {
    if (!form.nameAr.trim()) {
      toast.error('اكتب اسم الصنف')
      return
    }
    if (!form.categoryId) {
      toast.error('اختار القسم التابع له الصنف')
      return
    }

    setSaving(true)
    const payload = {
      categoryId: form.categoryId,
      nameAr: form.nameAr,
      nameEn: form.nameEn,
      descriptionAr: form.descriptionAr,
      price: Number(form.price) || 0,
      unitAr: form.unitAr,
      imageUrl: form.imageUrl,
      isFeatured: form.isFeatured,
      isAvailable: form.isAvailable,
      tagsAr: form.tagsAr,
      sortOrder: Number(form.sortOrder) || 99,
    }

    try {
      if (form.id) {
        await adminApi.updateItem(form.id, payload)
        toast.success('تم تحديث الصنف')
      } else {
        await adminApi.createItem(payload)
        toast.success('تم إضافة الصنف')
      }
      reset()
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: MenuItem) => {
    if (!window.confirm(`حذف «${item.nameAr}»؟`)) return
    try {
      await adminApi.deleteItem(item.id)
      toast.success('تم حذف الصنف')
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحذف')
    }
  }

  const startEdit = (item: MenuItem) => {
    setForm({
      id: item.id,
      categoryId: item.categoryId,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      descriptionAr: item.descriptionAr,
      price: item.price,
      unitAr: item.unitAr,
      imageUrl: item.imageUrl ?? '',
      isFeatured: item.isFeatured === 1,
      isAvailable: item.isAvailable === 1,
      tagsAr: item.tagsAr,
      sortOrder: item.sortOrder,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      {/* القائمة */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-black text-foreground">الأصناف ({filtered.length})</p>
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              <Plus className="size-3.5" />
              صنف جديد
            </Button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1.4fr_1fr]">
            <div className="relative">
              <Search className="absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث باسم الصنف…"
                className="ps-10"
              />
            </div>
            <Select
              value={sectionFilter}
              onChange={(event) =>
                setSectionFilter(event.target.value as 'all' | 'restaurant' | 'products' | 'manufactured')
              }
            >
              <option value="all">كل الأقسام</option>
              <option value="restaurant">الساندوتشات والمشويات</option>
              <option value="products">البوكسات والإضافات</option>
              <option value="manufactured">المصنّعات البلدي</option>
            </Select>
          </div>

          {loading ? (
            <div className="grid place-items-center py-12">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary text-sm font-black text-primary">
                      {item.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.imageUrl} alt="" className="size-full object-cover" />
                      ) : (
                        item.nameAr.slice(0, 1)
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-black text-foreground">
                        {item.nameAr}
                        {item.isFeatured === 1 ? <Badge variant="orange">مميز</Badge> : null}
                        {item.isAvailable === 0 ? <Badge variant="red">غير متاح</Badge> : null}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {item.categoryNameAr} • {item.price} ج.م
                        {item.unitAr ? ` / ${item.unitAr}` : ''} • {item.tagsAr || 'بدون وسم'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  لا توجد أصناف مطابقة.
                </li>
              ) : null}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* النموذج */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-black text-foreground">
            {form.id ? `تعديل الصنف #${form.id}` : 'إضافة صنف جديد'}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>اسم الصنف *</Label>
              <Input
                value={form.nameAr}
                onChange={(event) => setForm({ ...form, nameAr: event.target.value })}
                placeholder="مثال: كفتة بلدي"
              />
            </div>
            <div className="space-y-1.5">
              <Label>القسم *</Label>
              <Select
                value={String(form.categoryId)}
                onChange={(event) => setForm({ ...form, categoryId: Number(event.target.value) })}
              >
                <option value="0">— اختر —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.section === 'manufactured'
                      ? 'المصنّعات'
                      : category.section === 'products'
                        ? 'البوكسات'
                        : 'المطعم'}{' '}
                    — {category.nameAr}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>الوصف</Label>
            <Input
              value={form.descriptionAr}
              onChange={(event) => setForm({ ...form, descriptionAr: event.target.value })}
              placeholder="كفتة لحم مفروم طازج بالبقدونس والبصل"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>السعر (ج.م)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>الوحدة</Label>
              <Select
                value={UNITS.includes(form.unitAr) ? form.unitAr : 'other'}
                onChange={(event) =>
                  setForm({
                    ...form,
                    unitAr: event.target.value === 'other' ? form.unitAr : event.target.value,
                  })
                }
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
                <option value="other">أخرى (اكتبها تحت)</option>
              </Select>
              <Input
                value={form.unitAr}
                onChange={(event) => setForm({ ...form, unitAr: event.target.value })}
                placeholder="مثال: كيلو"
                className="mt-1"
              />
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

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>وسم (اختياري)</Label>
              <Input
                value={form.tagsAr}
                onChange={(event) => setForm({ ...form, tagsAr: event.target.value })}
                placeholder="الأكثر طلبًا / جديد / مميز"
              />
            </div>
            <div className="space-y-1.5">
              <Label>مميز في الرئيسية؟</Label>
              <Select
                value={form.isFeatured ? '1' : '0'}
                onChange={(event) => setForm({ ...form, isFeatured: event.target.value === '1' })}
              >
                <option value="0">لا</option>
                <option value="1">نعم</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>متاح للطلب؟</Label>
              <Select
                value={form.isAvailable ? '1' : '0'}
                onChange={(event) => setForm({ ...form, isAvailable: event.target.value === '1' })}
              >
                <option value="1">متاح</option>
                <option value="0">غير متاح</option>
              </Select>
            </div>
          </div>

          <UploadField
            label="صورة الصنف"
            value={form.imageUrl}
            onChange={(value) => setForm({ ...form, imageUrl: value })}
            accept="image"
            hint="ارفع صورة الطبق من جهازك — ولو مفيش صورة هيظهر بديل أنيق بالحرف الأول."
          />

          <div className="flex gap-2">
            <Button type="button" onClick={save} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {form.id ? 'حفظ التعديلات' : 'إضافة الصنف'}
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
