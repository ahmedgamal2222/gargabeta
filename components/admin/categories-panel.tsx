'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import UploadField from '@/components/admin/upload-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label, Select } from '@/components/ui/field'
import { adminApi } from '@/lib/api'
import type { Category, MenuSection } from '@/lib/types'

const EMPTY_FORM = {
  id: 0,
  nameAr: '',
  nameEn: '',
  descriptionAr: '',
  section: 'restaurant' as MenuSection,
  imageUrl: '',
  icon: 'utensils',
  sortOrder: 99,
  isActive: true,
}

export default function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCategories(await adminApi.listCategories())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر تحميل الأقسام')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const reset = () => setForm(EMPTY_FORM)

  const save = async () => {
    if (!form.nameAr.trim()) {
      toast.error('اكتب اسم القسم')
      return
    }

    setSaving(true)
    const payload = {
      nameAr: form.nameAr,
      nameEn: form.nameEn,
      descriptionAr: form.descriptionAr,
      section: form.section,
      imageUrl: form.imageUrl,
      icon: form.icon,
      sortOrder: Number(form.sortOrder) || 99,
      isActive: form.isActive,
    }

    try {
      if (form.id) {
        await adminApi.updateCategory(form.id, payload)
        toast.success('تم تحديث القسم')
      } else {
        await adminApi.createCategory(payload)
        toast.success('تم إضافة القسم')
      }
      reset()
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (category: Category) => {
    if (!window.confirm(`حذف قسم «${category.nameAr}» وكل أصنافه؟`)) return
    try {
      await adminApi.deleteCategory(category.id)
      toast.success('تم حذف القسم')
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحذف')
    }
  }

  const startEdit = (category: Category) =>
    setForm({
      id: category.id,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      descriptionAr: category.descriptionAr,
      section: category.section,
      imageUrl: category.imageUrl ?? '',
      icon: category.icon,
      sortOrder: category.sortOrder,
      isActive: category.isActive === 1,
    })

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      {/* القائمة */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-foreground">أقسام المنيو ({categories.length})</p>
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              <Plus className="size-3.5" />
              قسم جديد
            </Button>
          </div>

          {loading ? (
            <div className="grid place-items-center py-12">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-black text-foreground">
                      {category.nameAr}
                      <Badge variant={category.section === 'products' ? 'success' : 'orange'}>
                        {category.section === 'products' ? 'مصنعات' : 'المطعم'}
                      </Badge>
                      {category.isActive === 0 ? <Badge variant="red">مخفي</Badge> : null}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {category.descriptionAr}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(category)}>
                      <Pencil className="size-3.5" />
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => remove(category)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
              {categories.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  لا توجد أقسام — أضف أول قسم من النموذج المجاور.
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
            {form.id ? `تعديل القسم #${form.id}` : 'إضافة قسم جديد'}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>الاسم بالعربية *</Label>
              <Input
                value={form.nameAr}
                onChange={(event) => setForm({ ...form, nameAr: event.target.value })}
                placeholder="مثال: المشويات"
              />
            </div>
            <div className="space-y-1.5">
              <Label>الاسم بالإنجليزية</Label>
              <Input
                dir="ltr"
                value={form.nameEn}
                onChange={(event) => setForm({ ...form, nameEn: event.target.value })}
                placeholder="Grills"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>وصف مختصر</Label>
            <Input
              value={form.descriptionAr}
              onChange={(event) => setForm({ ...form, descriptionAr: event.target.value })}
              placeholder="كباب وكفتة وفراخ على الفحم"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>القسم</Label>
              <Select
                value={form.section}
                onChange={(event) => setForm({ ...form, section: event.target.value as MenuSection })}
              >
                <option value="restaurant">منيو المطعم</option>
                <option value="products">منيو المصنعات</option>
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
            <div className="space-y-1.5">
              <Label>الحالة</Label>
              <Select
                value={form.isActive ? '1' : '0'}
                onChange={(event) => setForm({ ...form, isActive: event.target.value === '1' })}
              >
                <option value="1">ظاهر في الموقع</option>
                <option value="0">مخفي</option>
              </Select>
            </div>
          </div>

          <UploadField
            label="صورة القسم (اختياري)"
            value={form.imageUrl}
            onChange={(value) => setForm({ ...form, imageUrl: value })}
            accept="image"
            hint="تقدر ترفع صورة من جهازك أو تلزق رابط صورة."
          />

          <div className="flex gap-2">
            <Button type="button" onClick={save} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {form.id ? 'حفظ التعديلات' : 'إضافة القسم'}
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
