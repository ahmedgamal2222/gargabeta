/**
 * صور حقيقية لمطعم جرجبيتا (مأخوذة من موقع gargabeta.com الحالي عبر Cloudinary)
 * تُستخدم كبيانات احتياطية جاهزة بصريًا حتى يرفع صاحب المطعم صوره الخاصة من
 * لوحة التحكم — بدلًا من الرسومات التوضيحية المؤقتة ph-*.svg.
 */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dw7senbmg/image/upload'

/**
 * يبني رابط Cloudinary مع تحويلات تقصّ ذكية (g_auto) بدل القص المركزي الافتراضي
 * الذي كان يقطع من أطراف الصور — فيعطي صورة واضحة وممتلئة بدون "قصّ" سيّئ،
 * مع جودة وصيغة تلقائية (q_auto, f_auto) لتحميل أسرع.
 */
function cld(publicPath: string, width: number, height: number): string {
  return `${CLOUDINARY_BASE}/c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/${publicPath}`
}

/** مسارات الصور الأصلية (بدون تحويلات) — تُستخدم مع cld() بأبعاد مناسبة لكل موضع */
const PATHS = {
  logo: 'v1788251132/almenu/rdp5h7kdz0y86g0vqlgh.png',
  steak: 'v1789477355/almenu/c8phcnzgh3yjec4acoo9.jpg',
  kebabFillet: 'v1789478027/almenu/a9x0raa7hg0znmxvavk4.jpg',
  koftaDouble: 'v1789477427/almenu/i39q3vd10arnzzhmeehj.jpg',
  partyBox: 'v1789213931/almenu/bilyppkxvp0gz3lgmm8p.png',
  shishTawook: 'v1789480216/almenu/mwwrl3na0ukumhkpfenp.png',
  sausage: 'v1789477514/almenu/itkdd5ppsinf4htresro.jpg',
  crispy: 'v1789477690/almenu/pmx1jhs1zqy6ptrao4bf.jpg',
  koftaHati: 'v1789477399/almenu/mjjv4pzzplbb66kz22at.jpg',
  tarb: 'v1789477474/almenu/aql8z9srgrbensicsnto.jpg',
  liverGrilled: 'v1789480078/almenu/nqw4qo2oac9tcdxfpydr.png',
  liverBreaded: 'v1789479923/almenu/prrqjlitsemlavczuidp.jpg',
  shishTikkaSpicy: 'v1789477638/almenu/dmncawxqlkpwidooxu45.jpg',
  hawawshiCategory: 'v1789208477/almenu/qpepwijj4ktsc4edabgp.png',
  extrasCategory: 'v1789214543/almenu/irm9kstlpsbfdj8httof.png',
  tahina: 'v1789226660/almenu/ihhyvkhuulpacgwzkiqr.png',
  pickles: 'v1789226245/almenu/brsdecxaq2jolndgnrr8.png',
  koftaWadeAmi: 'v1789214000/almenu/x47rxpynbyv9ecqxwhct.png',
} as const

/** الشعار الحقيقي لجرجبيتا */
export const REAL_LOGO_URL = `${CLOUDINARY_BASE}/${PATHS.logo}`

/**
 * صور سلايدر الهيرو — أشهى تشكيلة من المشويات والبرجر والبوكسات.
 * أبعاد 4:5 (عمودية) بقصّ ذكي (g_auto) لتطابق شكل بطاقة الهيرو بدون أي اقتصاص
 * إضافي في المتصفح — فتظهر الصورة كاملة وواضحة.
 */
export const HERO_SLIDES: Array<{ src: string; alt: string }> = [
  { src: cld(PATHS.steak, 1000, 1250), alt: 'استيك جرجبيتا على الفحم' },
  { src: cld(PATHS.kebabFillet, 1000, 1250), alt: 'كباب فلتو مشوي' },
  { src: cld(PATHS.koftaDouble, 1000, 1250), alt: 'كفتة دوبل جرجبيتا' },
  { src: cld(PATHS.partyBox, 1000, 1250), alt: 'بوكس العزومة المشكّل' },
  { src: cld(PATHS.shishTawook, 1000, 1250), alt: 'شيش طاووق مشوي' },
  { src: cld(PATHS.sausage, 1000, 1250), alt: 'سجق بلدي جرجبيتا' },
]

/** صور معرض حقيقية (بدل الرسومات المؤقتة) — أبعاد 4:3 بقصّ ذكي */
export const REAL_GALLERY_PHOTOS: Array<{ titleAr: string; descriptionAr: string; url: string }> = [
  {
    titleAr: 'استيك على الفحم',
    descriptionAr: 'قطع استيك مشوية على الفحم مباشرة.',
    url: cld(PATHS.steak, 1000, 750),
  },
  {
    titleAr: 'كباب فلتو',
    descriptionAr: 'كباب لحم بلدي مفروم ومشوي على الفحم.',
    url: cld(PATHS.kebabFillet, 1000, 750),
  },
  {
    titleAr: 'كفتة دوبل',
    descriptionAr: 'كفتة لحم بلدي طازجة بمقادير مظبوطة.',
    url: cld(PATHS.koftaDouble, 1000, 750),
  },
  {
    titleAr: 'بوكس العزومة',
    descriptionAr: 'تشكيلة مشكّلة تكفي عزومة كاملة.',
    url: cld(PATHS.partyBox, 1000, 750),
  },
  {
    titleAr: 'شيش طاووق',
    descriptionAr: 'صدور فراخ متبلة ومشوية على الفحم.',
    url: cld(PATHS.shishTawook, 1000, 750),
  },
  {
    titleAr: 'سجق بلدي',
    descriptionAr: 'سجق بلدي بتوابل جرجبيتا الخاصة.',
    url: cld(PATHS.sausage, 1000, 750),
  },
  {
    titleAr: 'كرسبي مقرمش',
    descriptionAr: 'كرسبي فراخ مقرمش طازج.',
    url: cld(PATHS.crispy, 1000, 750),
  },
]

/** صور حقيقية لأقسام المنيو (بدل رسومات ph-*.svg) — تُطابق فكرة كل قسم، بقصّ ذكي 4:3 */
export const REAL_CATEGORY_PHOTOS: Record<number, string> = {
  1: cld(PATHS.sausage, 800, 600), // مصنعات اللحوم — سجق بلدي
  2: cld(PATHS.shishTawook, 800, 600), // مصنعات الفراخ — شيش طاووق
  3: cld(PATHS.steak, 800, 600), // لانشون وبسطرمة — استيك
  4: cld(PATHS.hawawshiCategory, 800, 600), // جاهز للتسوية — حواوشي
  5: cld(PATHS.kebabFillet, 800, 600), // المشويات — كباب فلتو
  6: cld(PATHS.partyBox, 800, 600), // طواجن وفتة — بوكس العزومة
  7: cld(PATHS.koftaHati, 800, 600), // الساندوتشات — كفتة حاتي
  8: cld(PATHS.extrasCategory, 800, 600), // العيش والإضافات
  9: cld(PATHS.tarb, 800, 600), // المشروبات (صورة تشكيلة بديلة)
}

/**
 * صور حقيقية لأشهر الأصناف بالاسم — تُستخدم في البيانات الاحتياطية لمطابقة
 * كل صنف بصورته الفعلية من منيو gargabeta.com بدل وراثة صورة القسم فقط.
 */
export const REAL_ITEM_PHOTOS: Record<string, string> = {
  'سجق بلدي حريف': cld(PATHS.sausage, 800, 600),
  'سجق بلدي وسط': cld(PATHS.sausage, 800, 600),
  'كفتة بلدي': cld(PATHS.koftaDouble, 800, 600),
  'كبدة إسكندراني': cld(PATHS.liverGrilled, 800, 600),
  'مشكل مشويات جرجبيتا': cld(PATHS.kebabFillet, 800, 600),
  'كباب بلدي': cld(PATHS.kebabFillet, 800, 600),
  'كفتة مشوية': cld(PATHS.koftaDouble, 800, 600),
  'شيش طاووق': cld(PATHS.shishTawook, 800, 600),
  'حواوشي مجهز': cld(PATHS.hawawshiCategory, 800, 600),
  'طرب محشي': cld(PATHS.tarb, 800, 600),
  'ساندوتش كباب': cld(PATHS.koftaHati, 800, 600),
  'ساندوتش كفتة': cld(PATHS.koftaDouble, 800, 600),
  'ساندوتش سجق': cld(PATHS.sausage, 800, 600),
  'ساندوتش كبدة': cld(PATHS.liverBreaded, 800, 600),
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
    image: cld(PATHS.kebabFillet, 900, 560),
  },
  {
    id: 'atlas',
    name: 'فرع أطلس',
    address: 'أمام نيو أبو سمبل',
    phones: ['01010120241', '01159353495'],
    mapUrl: 'https://maps.google.com/?q=Gargabeta+Aswan+New+Abu+Simbel',
    image: cld(PATHS.steak, 900, 560),
  },
]
