/**
 * بيانات احتياطية تُستخدم إذا لم يكن الـ API (HonoJS + D1) متصلًا — فيعمل
 * الموقع كاملًا دون باك-إند. كل الأقسام والأصناف هنا مبنية من REAL_MENU في
 * lib/real-images.ts، وهي مطابقة فعليًا (الاسم + السعر + الصورة) لمنيو
 * gargabeta.com الحقيقي — وليست بيانات أو صور افتراضية.
 */
import { BRANCHES, REAL_GALLERY_PHOTOS, REAL_LOGO_URL, REAL_MENU } from './real-images'
import type { Category, MediaItem, MenuItem, SiteBundle, SiteSettings } from './types'

export const fallbackSettings: SiteSettings = {
  brandName: 'جرجبيتا',
  brandTagline: 'Gargabeta — Aswan',
  logoUrl: REAL_LOGO_URL,
  heroTitle: 'جميل سيدنا النبي 🤍',
  heroSubtitle:
    'تشكيلة متنوعة من أشهى الأصناف — مشويات على الفحم، ساندوتشات، بوكسات وإضافات. اطلب من الواتساب في دقيقة.',
  heroImage: '/images/hero-meat.svg',
  aboutTitle: 'ليه جرجبيتا؟',
  aboutText:
    'جرجبيتا مش مجرد محل — إحنا بصمة طعم في أسوان. مشويات تُحضَّر على الفحم بعد الطلب، وساندوتشات وبوكسات مشكّلة بمقادير مظبوطة وبدون أي إضافات صناعية.',
  address: `${BRANCHES[0].name} — ${BRANCHES[0].address} | ${BRANCHES[1].name} — ${BRANCHES[1].address}`,
  mapUrl: BRANCHES[0].mapUrl,
  hours: 'يوميًا — تحقق من مواعيد كل فرع',
  phone: BRANCHES[1].phones[1],
  whatsappNumbers: [
    { label: 'الطلبات — الخط الأساسي', number: '201159353495', isDefault: true },
    { label: 'فرع العقاد', number: '201080221777', isDefault: false },
  ],
  currency: 'ج.م',
  deliveryNote: 'التوصيل من أقرب فرع — رسوم التوصيل حسب المنطقة',
  minOrder: '',
  instagram: '',
  facebook: 'https://www.facebook.com/share/19Qv8tZm8K/',
  tiktok: 'https://www.tiktok.com/@gargabeta',
}

/** الأقسام مبنية مباشرة من REAL_MENU — صورة وأيقونة كل قسم حقيقية 100% */
export const fallbackCategories: Category[] = REAL_MENU.map((category, index) => ({
  id: index + 1,
  slug: category.slug,
  nameAr: category.nameAr,
  nameEn: category.nameEn,
  descriptionAr: category.descriptionAr,
  section: category.section,
  imageUrl: category.image,
  icon: category.icon,
  sortOrder: index + 1,
  isActive: 1,
}))

/** الأصناف مبنية من REAL_MENU — كل صنف بصورته الحقيقية الفعلية من المنيو */
export const fallbackItems: MenuItem[] = REAL_MENU.flatMap((category, categoryIndex) => {
  const fallbackCategory = fallbackCategories[categoryIndex]
  return category.items.map((item, itemIndex) => ({
    id: categoryIndex * 100 + itemIndex + 1,
    categoryId: fallbackCategory.id,
    categoryNameAr: fallbackCategory.nameAr,
    categorySection: fallbackCategory.section,
    nameAr: item.nameAr,
    nameEn: '',
    descriptionAr: item.descriptionAr,
    price: item.price,
    unitAr: item.unitAr,
    imageUrl: item.image,
    isFeatured: item.isFeatured,
    isAvailable: 1,
    tagsAr: item.tagsAr,
    sortOrder: itemIndex + 1,
  }))
})

export const fallbackMedia: MediaItem[] = REAL_GALLERY_PHOTOS.map((photo, index) => ({
  id: index + 1,
  type: 'photo' as const,
  titleAr: photo.titleAr,
  descriptionAr: photo.descriptionAr,
  url: photo.url,
  thumbnailUrl: photo.url,
  categoryId: null,
  isFeatured: index < 3 ? 1 : 0,
  sortOrder: index + 1,
  createdAt: '',
}))

/** الحزمة الكاملة للاستخدام عند عدم توفر الـ API. */
export const fallbackBundle: SiteBundle = {
  settings: fallbackSettings,
  categories: fallbackCategories,
  items: fallbackItems,
  media: fallbackMedia,
}
