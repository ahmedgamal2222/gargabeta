/**
 * أنواع البيانات المشتركة مع الـ API (HonoJS + Cloudflare D1).
 * مطابقة تمامًا لملف backend/src/types.ts.
 */

export type MenuSection = 'restaurant' | 'products' | 'manufactured'

export interface Category {
  id: number
  slug: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  section: MenuSection
  imageUrl: string | null
  icon: string
  sortOrder: number
  isActive: number
  itemsCount?: number
}

export interface MenuItem {
  id: number
  categoryId: number
  categoryNameAr?: string
  categorySection?: MenuSection
  nameAr: string
  nameEn: string
  descriptionAr: string
  price: number
  unitAr: string
  imageUrl: string | null
  isFeatured: number
  isAvailable: number
  tagsAr: string
  sortOrder: number
}

export interface MediaItem {
  id: number
  type: 'photo' | 'video'
  titleAr: string
  descriptionAr: string
  url: string
  thumbnailUrl: string | null
  categoryId: number | null
  isFeatured: number
  sortOrder: number
  createdAt: string
}

export interface WhatsappNumber {
  label: string
  number: string
  isDefault: boolean
}

export interface SiteSettings {
  brandName: string
  brandTagline: string
  logoUrl: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  aboutTitle: string
  aboutText: string
  address: string
  mapUrl: string
  hours: string
  phone: string
  whatsappNumbers: WhatsappNumber[]
  currency: string
  deliveryNote: string
  minOrder: string
  instagram: string
  facebook: string
  tiktok: string
}

export interface SiteBundle {
  settings: SiteSettings
  categories: Category[]
  items: MenuItem[]
  media: MediaItem[]
}

export interface OrderItemInput {
  id: number
  name: string
  price: number
  quantity: number
  unit?: string
}

export interface OrderRow {
  id: number
  customerName: string
  customerPhone: string
  area: string
  address: string
  notes: string
  items: OrderItemInput[]
  total: number
  channel: string
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
}

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

export interface AdminOverview {
  counts: {
    categories?: number
    items?: number
    media?: number
    orders?: number
    newOrders?: number
    ordersTotal?: number
  }
  recent: Array<{
    id: number
    customerName: string
    customerPhone: string
    total: number
    status: OrderRow['status']
    createdAt: string
  }>
}

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  meta?: Record<string, unknown>
  error?: { code: string; message: string; details?: unknown }
}
