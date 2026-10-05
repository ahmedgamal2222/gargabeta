/**
 * صور حقيقية 100% لمطعم جرجبيتا (مسحوبة فعليًا من موقع gargabeta.com عبر
 * Cloudinary) — تُستخدم كبيانات احتياطية حتى يرفع صاحب المطعم صوره الخاصة من
 * لوحة التحكم. كل عنصر هنا مطابق لاسم وصورة حقيقيين من المنيو الأصلي.
 */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dw7senbmg/image/upload'

/**
 * يبني رابط Cloudinary مع تحويلات قصّ ذكية (g_auto) بدل القص المركزي الذي كان
 * يقطع من أطراف الصور، مع جودة وصيغة تلقائية (q_auto, f_auto) لتحميل أسرع.
 */
function cld(publicPath: string, width: number, height: number): string {
  return `${CLOUDINARY_BASE}/c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/${publicPath}`
}

/** مسارات الصور الأصلية كما هي على الموقع الحقيقي */
const RAW = {
  logo: 'v1788251132/almenu/rdp5h7kdz0y86g0vqlgh.png',
  iconSandwiches: 'v1789215230/almenu/lumnweodsjagw0tcjcqv.png',
  iconBoxes: 'v1789213805/almenu/kokopzcccaplhsazwo6q.png',
  iconExtras: 'v1789214543/almenu/irm9kstlpsbfdj8httof.png',
  koftaHati: 'v1789477399/almenu/mjjv4pzzplbb66kz22at.jpg',
  koftaDouble: 'v1789477427/almenu/i39q3vd10arnzzhmeehj.jpg',
  kebabFillet: 'v1789478027/almenu/a9x0raa7hg0znmxvavk4.jpg',
  tarb: 'v1789477474/almenu/aql8z9srgrbensicsnto.jpg',
  sausage: 'v1789477514/almenu/itkdd5ppsinf4htresro.jpg',
  koftaChicken: 'v1789477532/almenu/mrrl6anqihinsct3efzj.jpg',
  shishTawook: 'v1789480216/almenu/mwwrl3na0ukumhkpfenp.png',
  shishTawookCheddar: 'v1789480318/almenu/efqzpz7wtgpk2pcduy8t.png',
  shishTawookRanch: 'v1789480423/almenu/fjpqx6z3l9irjixl1pfn.png',
  shishTikkaSpicy: 'v1789477638/almenu/dmncawxqlkpwidooxu45.jpg',
  shishTikkaCheddar: 'v1789479478/almenu/mjuwhixf64cppcxso9nq.png',
  shishTikkaRanch: 'v1789479437/almenu/odezu38eztsgsvxmud2d.png',
  liverGrilled: 'v1789480078/almenu/nqw4qo2oac9tcdxfpydr.png',
  crispy: 'v1789477690/almenu/pmx1jhs1zqy6ptrao4bf.jpg',
  crispyZinger: 'v1789479843/almenu/zkum8wejx4yxyhbmlenl.png',
  liverBreaded: 'v1789479923/almenu/prrqjlitsemlavczuidp.jpg',
  steak: 'v1789477355/almenu/c8phcnzgh3yjec4acoo9.jpg',
  boxMood: 'v1789214051/almenu/lq7ljf2kzksptl6bnaws.png',
  boxWadAmi: 'v1789214000/almenu/x47rxpynbyv9ecqxwhct.png',
  boxParty: 'v1789213931/almenu/bilyppkxvp0gz3lgmm8p.png',
  tahina: 'v1789226660/almenu/ihhyvkhuulpacgwzkiqr.png',
  tomato: 'v1789226694/almenu/n8iklthcmw4oxokhr7yg.png',
  pickles: 'v1789226245/almenu/brsdecxaq2jolndgnrr8.png',
  saladWater: 'v1789226283/almenu/e3owfugqjjsasqaflnaa.png',
  mozzarella: 'v1789226321/almenu/hxxtaqkklwfjl9q5q3ow.png',
  basturma: 'v1789226346/almenu/xyp2okncwyoebxlmbxb4.png',
  cheddar: 'v1789226387/almenu/due1xlkslzkrq4lghyml.png',
  rice: 'v1789226462/almenu/yqrrmo86qm6tzqur269f.png',
  fries: 'v1789226488/almenu/pvhftpufamaezjpvykta.png',
  friesCheddar: 'v1789226728/almenu/mso6uloruw3zkw1pladd.png',
  sauceRanch: 'v1789226826/almenu/vndyvllnz7hdoaexhkwj.png',
  sauceCheddar: 'v1789226609/almenu/nlj1kqbd1xcmrqqackjx.png',
  sauceBigTasty: 'v1789226580/almenu/nztx2p1bcecu9akcaei3.png',
  friesRanch: 'v1789226795/almenu/rtodyfib3tbmv0wv7cxe.png',
} as const

/** الشعار الحقيقي لجرجبيتا */
export const REAL_LOGO_URL = `${CLOUDINARY_BASE}/${RAW.logo}`

/**
 * صور سلايدر الهيرو — أشهى أصناف جرجبيتا الحقيقية. أبعاد عمودية 4:5 بقصّ ذكي
 * (g_auto) تطابق شكل بطاقة الهيرو تمامًا فلا يحصل أي اقتصاص إضافي بالمتصفح.
 */
export const HERO_SLIDES: Array<{ src: string; alt: string }> = [
  { src: cld(RAW.steak, 1000, 1250), alt: 'استيك جرجبيتا على الفحم' },
  { src: cld(RAW.kebabFillet, 1000, 1250), alt: 'كباب فلتو مشوي' },
  { src: cld(RAW.koftaDouble, 1000, 1250), alt: 'كفتة دوبل جرجبيتا' },
  { src: cld(RAW.boxParty, 1000, 1250), alt: 'بوكس العزومة المشكّل' },
  { src: cld(RAW.shishTawook, 1000, 1250), alt: 'شيش طاووق مشوي' },
  { src: cld(RAW.sausage, 1000, 1250), alt: 'سجق بلدي جرجبيتا' },
]

/**
 * عناصر الشريط الأخضر المتحرك (Marquee) — صور مربّعة صغيرة بقصّ ذكي لتحميل سريع.
 * القيم الافتراضية هنا تظهر فورًا، ويمكن لصاحب المطعم لاحقًا استبدالها من اللوحة.
 */
export const MARQUEE_TAGS: Array<{ label: string; image: string }> = [
  { label: 'سجق بلدي', image: cld(RAW.koftaDouble, 160, 160) },
  { label: 'كفتة دوبل', image: cld(RAW.kebabFillet, 160, 160) },
  { label: 'مشويات على الفحم', image: cld(RAW.shishTawook, 160, 160) },
  { label: 'شيش طاووق', image: cld(RAW.boxParty, 160, 160) },
  { label: 'بوكس', image: cld(RAW.boxMood, 160, 160) },
]

/** صور معرض حقيقية — أبعاد 4:3 بقصّ ذكي */
export const REAL_GALLERY_PHOTOS: Array<{ titleAr: string; descriptionAr: string; url: string }> = [
  { titleAr: 'استيك على الفحم', descriptionAr: 'قطع استيك مشوية على الفحم مباشرة.', url: cld(RAW.steak, 1000, 750) },
  { titleAr: 'كباب فلتو', descriptionAr: 'كباب لحم بلدي مفروم ومشوي على الفحم.', url: cld(RAW.kebabFillet, 1000, 750) },
  { titleAr: 'كفتة دوبل', descriptionAr: 'كفتة لحم بلدي طازجة بمقادير مظبوطة.', url: cld(RAW.koftaDouble, 1000, 750) },
  { titleAr: 'بوكس العزومة', descriptionAr: 'تشكيلة مشكّلة تكفي عزومة كاملة.', url: cld(RAW.boxParty, 1000, 750) },
  { titleAr: 'شيش طاووق', descriptionAr: 'صدور فراخ متبلة ومشوية على الفحم.', url: cld(RAW.shishTawook, 1000, 750) },
  { titleAr: 'سجق بلدي', descriptionAr: 'سجق بلدي بتوابل جرجبيتا الخاصة.', url: cld(RAW.sausage, 1000, 750) },
  { titleAr: 'كرسبي مقرمش', descriptionAr: 'كرسبي فراخ مقرمش طازج.', url: cld(RAW.crispy, 1000, 750) },
  { titleAr: 'بوكس واد عمي', descriptionAr: 'كفتة وشيش وحواوشي في بوكس واحد.', url: cld(RAW.boxWadAmi, 1000, 750) },
]

/** صنف واحد حقيقي — يُستخدم لبناء بيانات المنيو الاحتياطية بالكامل من صور حقيقية */
export interface RealMenuItem {
  nameAr: string
  price: number
  unitAr: string
  descriptionAr: string
  image: string
  isFeatured: number
  tagsAr: string
}

/** قسم حقيقي بصوره وأصنافه الفعلية من gargabeta.com */
export interface RealCategory {
  slug: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  icon: string
  image: string
  /** تبويب العرض في الواجهة: المشويات والساندوتشات، أو البوكسات، أو المصنّعات */
  section: 'restaurant' | 'products' | 'manufactured'
  items: RealMenuItem[]
}

const img = (path: string) => cld(path, 800, 600)

/** الساندوتشات والمشويات — كلها صور حقيقية فعلية من منيو gargabeta.com */
const SANDWICHES_GRILLS: RealCategory = {
  slug: 'sandwiches-grills',
  nameAr: 'الساندوتشات والمشويات',
  nameEn: 'Sandwiches & Grills',
  descriptionAr: 'كفتة وكباب وشيش طاووق وشيش تكا — تُشوى على الفحم وتُقدَّم ساخنة فورًا.',
  icon: 'flame',
  section: 'restaurant',
  image: img(RAW.iconSandwiches),
  items: [
    { nameAr: 'كفتة حاتي', price: 70, unitAr: 'ساندوتش', descriptionAr: 'كفتة بلدي مشوية على الفحم في عيش ساخن.', image: img(RAW.koftaHati), isFeatured: 1, tagsAr: 'الأكثر طلبًا' },
    { nameAr: 'كفتة دوبل', price: 110, unitAr: 'ساندوتش', descriptionAr: 'ضعف كمية الكفتة لشهية مفتوحة.', image: img(RAW.koftaDouble), isFeatured: 1, tagsAr: '' },
    { nameAr: 'كباب فلتو', price: 95, unitAr: 'ساندوتش', descriptionAr: 'كباب لحم بلدي مفروم ومشوي على الفحم.', image: img(RAW.kebabFillet), isFeatured: 1, tagsAr: '' },
    { nameAr: 'طرب وايت شوكليت', price: 85, unitAr: 'ساندوتش', descriptionAr: 'طرب بلدي محشي — نكهة مميزة.', image: img(RAW.tarb), isFeatured: 0, tagsAr: '' },
    { nameAr: 'سجق بلدي', price: 70, unitAr: 'ساندوتش', descriptionAr: 'سجق بلدي مشوي بتوابل جرجبيتا الخاصة.', image: img(RAW.sausage), isFeatured: 1, tagsAr: '' },
    { nameAr: 'كفتة فراخ', price: 65, unitAr: 'ساندوتش', descriptionAr: 'كفتة فراخ طرية بالأعشاب.', image: img(RAW.koftaChicken), isFeatured: 0, tagsAr: '' },
    { nameAr: 'شيش طاووق', price: 70, unitAr: 'ساندوتش', descriptionAr: 'صدور فراخ متبلة ومشوية على الفحم.', image: img(RAW.shishTawook), isFeatured: 1, tagsAr: '' },
    { nameAr: 'شيش طاووق شيدر', price: 80, unitAr: 'ساندوتش', descriptionAr: 'شيش طاووق مغطى بجبنة الشيدر الذائبة.', image: img(RAW.shishTawookCheddar), isFeatured: 0, tagsAr: '' },
    { nameAr: 'شيش طاووق رانش', price: 80, unitAr: 'ساندوتش', descriptionAr: 'شيش طاووق بصوص الرانش الكريمي.', image: img(RAW.shishTawookRanch), isFeatured: 0, tagsAr: '' },
    { nameAr: 'شيش تكا حار', price: 70, unitAr: 'ساندوتش', descriptionAr: 'شيش تكا متبل بالفلفل الحار.', image: img(RAW.shishTikkaSpicy), isFeatured: 0, tagsAr: '' },
    { nameAr: 'شيش تكا شيدر', price: 80, unitAr: 'ساندوتش', descriptionAr: 'شيش تكا مع جبنة شيدر ذائبة.', image: img(RAW.shishTikkaCheddar), isFeatured: 0, tagsAr: '' },
    { nameAr: 'شيش تكا رانش', price: 80, unitAr: 'ساندوتش', descriptionAr: 'شيش تكا مع صوص الرانش.', image: img(RAW.shishTikkaRanch), isFeatured: 0, tagsAr: '' },
    { nameAr: 'كبدة مشوية دارك شوكليت', price: 70, unitAr: 'ساندوتش', descriptionAr: 'كبدة بلدي مشوية بنكهة مميزة.', image: img(RAW.liverGrilled), isFeatured: 0, tagsAr: '' },
    { nameAr: 'كرسبي', price: 90, unitAr: 'ساندوتش', descriptionAr: 'فيليه فراخ كرسبي مقرمش.', image: img(RAW.crispy), isFeatured: 1, tagsAr: '' },
    { nameAr: 'كرسبي زنجر جار', price: 100, unitAr: 'ساندوتش', descriptionAr: 'كرسبي مع صوص الزنجر الحار المميز.', image: img(RAW.crispyZinger), isFeatured: 0, tagsAr: 'جديد' },
    { nameAr: 'كبدة بانيه', price: 65, unitAr: 'ساندوتش', descriptionAr: 'كبدة بانيه مقرمشة من الخارج طرية من الداخل.', image: img(RAW.liverBreaded), isFeatured: 0, tagsAr: '' },
    { nameAr: 'استيك', price: 90, unitAr: 'ساندوتش', descriptionAr: 'قطع استيك مشوية على الفحم مباشرة.', image: img(RAW.steak), isFeatured: 1, tagsAr: 'مميز' },
  ],
}

/** البوكسات — تشكيلات مشكّلة تكفي أكثر من فرد */
const BOXES: RealCategory = {
  slug: 'boxes',
  nameAr: 'البوكسات',
  nameEn: 'Boxes',
  descriptionAr: 'تشكيلات مشكّلة من أشهى الأصناف — مثالية للعزومات والتجمعات.',
  icon: 'package',
  section: 'products',
  image: img(RAW.iconBoxes),
  items: [
    { nameAr: 'بوكس المزاج', price: 295, unitAr: 'بوكس', descriptionAr: '2 حواوشي + 1 كفتة + 1 سجق + 1 شيش تكا.', image: img(RAW.boxMood), isFeatured: 1, tagsAr: 'الأكثر طلبًا' },
    { nameAr: 'بوكس واد عمي', price: 370, unitAr: 'بوكس', descriptionAr: '2 كفتة + 2 شيش + 2 حواوشي.', image: img(RAW.boxWadAmi), isFeatured: 1, tagsAr: '' },
    { nameAr: 'بوكس العزومة', price: 450, unitAr: 'بوكس', descriptionAr: '2 سجق + 1 طرب + 1 كبدة + 1 كفتة + 1 شيش + 1 حواوشي.', image: img(RAW.boxParty), isFeatured: 1, tagsAr: 'مثالي للعزومات' },
  ],
}

/** الإضافات — صوصات وأطباق جانبية */
const EXTRAS: RealCategory = {
  slug: 'extras',
  nameAr: 'الإضافات',
  nameEn: 'Extras',
  descriptionAr: 'صوصات وأطباق جانبية تكمّل طلبك — طحينة، بطاطس، جبنة وصوصات متنوعة.',
  icon: 'salad',
  section: 'products',
  image: img(RAW.iconExtras),
  items: [
    { nameAr: 'طحينة', price: 15, unitAr: 'طبق', descriptionAr: 'طحينة بالليمون والثوم.', image: img(RAW.tahina), isFeatured: 0, tagsAr: '' },
    { nameAr: 'طماطم متبلة', price: 15, unitAr: 'طبق', descriptionAr: 'طماطم متبلة طازجة.', image: img(RAW.tomato), isFeatured: 0, tagsAr: '' },
    { nameAr: 'مخلل', price: 10, unitAr: 'طبق', descriptionAr: 'مخلل بلدي مشكّل.', image: img(RAW.pickles), isFeatured: 0, tagsAr: '' },
    { nameAr: 'ماء سلطة', price: 10, unitAr: 'طبق', descriptionAr: 'سلطة خضار طازجة.', image: img(RAW.saladWater), isFeatured: 0, tagsAr: '' },
    { nameAr: 'موتزاريلا', price: 20, unitAr: 'إضافة', descriptionAr: 'جبنة موتزاريلا إضافية ذائبة.', image: img(RAW.mozzarella), isFeatured: 0, tagsAr: '' },
    { nameAr: 'بسطرمة', price: 20, unitAr: 'إضافة', descriptionAr: 'بسطرمة بلدي إضافية.', image: img(RAW.basturma), isFeatured: 1, tagsAr: 'مميز' },
    { nameAr: 'جبنة شيدر', price: 20, unitAr: 'إضافة', descriptionAr: 'شرائح جبنة شيدر إضافية.', image: img(RAW.cheddar), isFeatured: 0, tagsAr: '' },
    { nameAr: 'علبة ارز', price: 40, unitAr: 'علبة', descriptionAr: 'أرز بالخلطة البلدي.', image: img(RAW.rice), isFeatured: 0, tagsAr: '' },
    { nameAr: 'باكت بطاطس', price: 30, unitAr: 'باكت', descriptionAr: 'بطاطس مقرمشة طازجة.', image: img(RAW.fries), isFeatured: 1, tagsAr: '' },
    { nameAr: 'باكت بطاطس شيدر', price: 50, unitAr: 'باكت', descriptionAr: 'بطاطس مغطاة بجبنة الشيدر الذائبة.', image: img(RAW.friesCheddar), isFeatured: 0, tagsAr: '' },
    { nameAr: 'باكت بطاطس رانش', price: 50, unitAr: 'باكت', descriptionAr: 'بطاطس مع صوص الرانش الكريمي.', image: img(RAW.friesRanch), isFeatured: 0, tagsAr: '' },
    { nameAr: 'كاب صوص رانش', price: 25, unitAr: 'كوب', descriptionAr: 'صوص رانش كريمي.', image: img(RAW.sauceRanch), isFeatured: 0, tagsAr: '' },
    { nameAr: 'كاب صوص شيدر', price: 25, unitAr: 'كوب', descriptionAr: 'صوص شيدر غني.', image: img(RAW.sauceCheddar), isFeatured: 0, tagsAr: '' },
    { nameAr: 'كاب صوص بيج تيستي', price: 25, unitAr: 'كوب', descriptionAr: 'صوص بيج تيستي الخاص بجرجبيتا.', image: img(RAW.sauceBigTasty), isFeatured: 0, tagsAr: 'توقيع جرجبيتا' },
  ],
}

/** المصنّعات البلدي — لحوم ومصنّعات طازجة تُجهَّز يوميًا (الصورة مؤقتًا شعار جرجبيتا) */
const MANUFACTURED: RealCategory = {
  slug: 'manufactured',
  nameAr: 'المصنّعات البلدي',
  nameEn: 'Processed Meats',
  descriptionAr: 'لحوم ومصنّعات بلدي طازجة تُحضَّر يوميًا بتوابل جرجبيتا الخاصة — سجق، بسطرمة، كفتة وطرب.',
  icon: 'beef',
  section: 'manufactured',
  image: REAL_LOGO_URL,
  items: [
    { nameAr: 'سجق بلدي', price: 180, unitAr: 'كيلو', descriptionAr: 'سجق بلدي طازج بتوابل جرجبيتا الخاصة.', image: img(RAW.sausage), isFeatured: 1, tagsAr: 'الأكثر طلبًا' },
    { nameAr: 'بسطرمة بلدي', price: 320, unitAr: 'كيلو', descriptionAr: 'بسطرمة بلدي مغطاة بالحلبة على الطريقة الأصلية.', image: img(RAW.basturma), isFeatured: 1, tagsAr: 'مميز' },
    { nameAr: 'كفتة بلدي', price: 260, unitAr: 'كيلو', descriptionAr: 'كفتة لحم بلدي مفرومة طازجة بمقادير مظبوطة.', image: img(RAW.koftaHati), isFeatured: 1, tagsAr: '' },
    { nameAr: 'طرب محشي', price: 240, unitAr: 'كيلو', descriptionAr: 'طرب بلدي محشي جاهز للطهي.', image: img(RAW.tarb), isFeatured: 0, tagsAr: '' },
    { nameAr: 'كبدة بلدي', price: 220, unitAr: 'كيلو', descriptionAr: 'كبدة بلدي طازجة متبّلة.', image: img(RAW.liverGrilled), isFeatured: 0, tagsAr: '' },
  ],
}

/** حزمة المنيو الحقيقية الكاملة — جاهزة للتوليد المباشر في fallback-data.ts */
export const REAL_MENU: RealCategory[] = [SANDWICHES_GRILLS, BOXES, EXTRAS, MANUFACTURED]

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
    mapUrl: 'https://maps.app.goo.gl/gHmA2pZy5SZvx2xg9',
    image: cld(RAW.kebabFillet, 900, 560),
  },
  {
    id: 'atlas',
    name: 'فرع أطلس',
    address: 'أمام نيو أبو سمبل',
    phones: ['01010120241', '01159353495'],
    mapUrl: 'https://maps.app.goo.gl/AhPBcWxTGyhu31aN6',
    image: cld(RAW.steak, 900, 560),
  },
]
