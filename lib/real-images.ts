/**
 * صور حقيقية لمطعم جرجبيتا (مأخوذة من موقع gargabeta.com الحالي عبر Cloudinary)
 * تُستخدم كبيانات احتياطية جاهزة بصريًا حتى يرفع صاحب المطعم صوره الخاصة من
 * لوحة التحكم — بدلًا من الرسومات التوضيحية المؤقتة ph-*.svg.
 */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dw7senbmg/image/upload'

/** الشعار الحقيقي لجرجبيتا */
export const REAL_LOGO_URL = `${CLOUDINARY_BASE}/v1788251132/almenu/rdp5h7kdz0y86g0vqlgh.png`

/** صور سلايدر الهيرو — أشهى تشكيلة من المشويات والبرجر والبوكسات */
export const HERO_SLIDES: Array<{ src: string; alt: string }> = [
  { src: `${CLOUDINARY_BASE}/v1789477355/almenu/c8phcnzgh3yjec4acoo9.jpg`, alt: 'استيك جرجبيتا على الفحم' },
  { src: `${CLOUDINARY_BASE}/v1789478027/almenu/a9x0raa7hg0znmxvavk4.jpg`, alt: 'كباب فلتو مشوي' },
  { src: `${CLOUDINARY_BASE}/v1789477427/almenu/i39q3vd10arnzzhmeehj.jpg`, alt: 'كفتة دوبل جرجبيتا' },
  { src: `${CLOUDINARY_BASE}/v1789213931/almenu/bilyppkxvp0gz3lgmm8p.png`, alt: 'بوكس العزومة المشكّل' },
  { src: `${CLOUDINARY_BASE}/v1789480216/almenu/mwwrl3na0ukumhkpfenp.png`, alt: 'شيش طاووق مشوي' },
  { src: `${CLOUDINARY_BASE}/v1789477514/almenu/itkdd5ppsinf4htresro.jpg`, alt: 'سجق بلدي جرجبيتا' },
]

/** صور معرض حقيقية (بدل الرسومات المؤقتة) */
export const REAL_GALLERY_PHOTOS: Array<{ titleAr: string; descriptionAr: string; url: string }> = [
  {
    titleAr: 'استيك على الفحم',
    descriptionAr: 'قطع استيك مشوية على الفحم مباشرة.',
    url: `${CLOUDINARY_BASE}/v1789477355/almenu/c8phcnzgh3yjec4acoo9.jpg`,
  },
  {
    titleAr: 'كباب فلتو',
    descriptionAr: 'كباب لحم بلدي مفروم ومشوي على الفحم.',
    url: `${CLOUDINARY_BASE}/v1789478027/almenu/a9x0raa7hg0znmxvavk4.jpg`,
  },
  {
    titleAr: 'كفتة دوبل',
    descriptionAr: 'كفتة لحم بلدي طازجة بمقادير مظبوطة.',
    url: `${CLOUDINARY_BASE}/v1789477427/almenu/i39q3vd10arnzzhmeehj.jpg`,
  },
  {
    titleAr: 'بوكس العزومة',
    descriptionAr: 'تشكيلة مشكّلة تكفي عزومة كاملة.',
    url: `${CLOUDINARY_BASE}/v1789213931/almenu/bilyppkxvp0gz3lgmm8p.png`,
  },
  {
    titleAr: 'شيش طاووق',
    descriptionAr: 'صدور فراخ متبلة ومشوية على الفحم.',
    url: `${CLOUDINARY_BASE}/v1789480216/almenu/mwwrl3na0ukumhkpfenp.png`,
  },
  {
    titleAr: 'سجق بلدي',
    descriptionAr: 'سجق بلدي بتوابل جرجبيتا الخاصة.',
    url: `${CLOUDINARY_BASE}/v1789477514/almenu/itkdd5ppsinf4htresro.jpg`,
  },
  {
    titleAr: 'كرسبي مقرمش',
    descriptionAr: 'كرسبي فراخ مقرمش طازج.',
    url: `${CLOUDINARY_BASE}/v1789477690/almenu/pmx1jhs1zqy6ptrao4bf.jpg`,
  },
]

/** صور حقيقية لأقسام المنيو (بدل رسومات ph-*.svg) — تُطابق فكرة كل قسم */
export const REAL_CATEGORY_PHOTOS: Record<number, string> = {
  1: `${CLOUDINARY_BASE}/v1789477514/almenu/itkdd5ppsinf4htresro.jpg`, // مصنعات اللحوم — سجق بلدي
  2: `${CLOUDINARY_BASE}/v1789480216/almenu/mwwrl3na0ukumhkpfenp.png`, // مصنعات الفراخ — شيش طاووق
  3: `${CLOUDINARY_BASE}/v1789477355/almenu/c8phcnzgh3yjec4acoo9.jpg`, // لانشون وبسطرمة — استيك
  4: `${CLOUDINARY_BASE}/v1789208477/almenu/qpepwijj4ktsc4edabgp.png`, // جاهز للتسوية — حواوشي
  5: `${CLOUDINARY_BASE}/v1789478027/almenu/a9x0raa7hg0znmxvavk4.jpg`, // المشويات — كباب فلتو
  6: `${CLOUDINARY_BASE}/v1789213931/almenu/bilyppkxvp0gz3lgmm8p.png`, // طواجن وفتة — بوكس العزومة
  7: `${CLOUDINARY_BASE}/v1789477399/almenu/mjjv4pzzplbb66kz22at.jpg`, // الساندوتشات — كفتة حاتي
  8: `${CLOUDINARY_BASE}/v1789214543/almenu/irm9kstlpsbfdj8httof.png`, // العيش والإضافات
  9: `${CLOUDINARY_BASE}/v1789477474/almenu/aql8z9srgrbensicsnto.jpg`, // المشروبات (صورة تشكيلة بديلة)
}

export interface BranchInfo {
  id: string
  name: string
  address: string
  phones: string[]
  mapUrl: string
  image: string
}

/** فروع جرجبيتا الحقيقية في أسوان */
export const BRANCHES: BranchInfo[] = [
  {
    id: 'alakkad',
    name: 'فرع العقاد',
    address: 'أمام الاستاد — مول سوان',
    phones: ['01080221777', '01080224777'],
    mapUrl: 'https://maps.google.com/?q=Gargabeta+Aswan+Stadium',
    image: `${CLOUDINARY_BASE}/v1789478027/almenu/a9x0raa7hg0znmxvavk4.jpg`,
  },
  {
    id: 'atlas',
    name: 'فرع أطلس',
    address: 'أمام نيو أبو سمبل',
    phones: ['01010120241', '01159353495'],
    mapUrl: 'https://maps.google.com/?q=Gargabeta+Aswan+New+Abu+Simbel',
    image: `${CLOUDINARY_BASE}/v1789477355/almenu/c8phcnzgh3yjec4acoo9.jpg`,
  },
]
