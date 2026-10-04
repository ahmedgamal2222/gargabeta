/**
 * طبقة الاتصال بالـ API (HonoJS على Cloudflare Workers + D1).
 * - تجلب حزمة الموقع كاملة، ومع تعذّر الاتصال تعود للبيانات الاحتياطية المحلية.
 * - تدير الطلبات على الواتساب ودخول لوحة التحكم (توكن محفوظ في المتصفح).
 */
import { fallbackBundle } from './fallback-data'
import type {
  AdminOverview,
  AdminUser,
  ApiEnvelope,
  Category,
  MediaItem,
  MenuItem,
  OrderRow,
  SiteBundle,
  SiteSettings,
} from './types'

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  'http://localhost:8787'
).replace(/\/$/, '')

export type DataSource = 'api' | 'fallback'

/** يحوّل مسار ملف نسبي إلى رابط كامل (ملفات الرفع تُخدَم من الـ API) */
export function resolveAssetUrl(url?: string | null): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  if (url.startsWith('/api/')) return `${API_BASE_URL}${url}`
  return url
}

async function fetchJson<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
    })
    if (!response.ok) return null

    const payload = (await response.json()) as ApiEnvelope<T>
    if (!payload || payload.success !== true) return null
    return payload.data
  } catch {
    return null
  }
}

/** حزمة الموقع كاملة (أو الاحتياطية عند تعذّر الاتصال) */
export async function getSiteBundle(): Promise<{ bundle: SiteBundle; source: DataSource }> {
  const bundle = await fetchJson<SiteBundle>('/api/site', 60)
  if (bundle?.settings && Array.isArray(bundle.categories) && bundle.categories.length > 0) {
    return { bundle, source: 'api' }
  }
  return { bundle: fallbackBundle, source: 'fallback' }
}

// ---------------------------------------------------------------------------
// الطلبات (واتساب)
// ---------------------------------------------------------------------------
export interface OrderPayload {
  customerName: string
  customerPhone: string
  area?: string
  address?: string
  notes?: string
  items: Array<{ id: number; quantity: number }>
  targetNumber?: string
}

export interface OrderResult {
  ok: boolean
  whatsappUrl?: string
  total?: number
  currency?: string
  orderId?: number
  error?: string
}

/** يسجّل الطلب في قاعدة البيانات ويرجع رابط واتساب جاهزًا */
export async function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = (await response.json()) as ApiEnvelope<{
      orderId: number
      total: number
      currency: string
      whatsappUrl: string
    }>

    if (response.ok && result.success === true) {
      return {
        ok: true,
        whatsappUrl: result.data.whatsappUrl,
        total: result.data.total,
        currency: result.data.currency,
        orderId: result.data.orderId,
      }
    }

    return { ok: false, error: result.error?.message ?? 'تعذّر إرسال الطلب' }
  } catch {
    return { ok: false, error: 'تعذّر الاتصال بالخادم — تقدر تكمل الطلب على الواتساب مباشرة.' }
  }
}

/** يحوّل رقمًا محليًا (01...) إلى صيغة دولية للواتساب */
export function toInternationalNumber(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  return digits.startsWith('0') ? `2${digits}` : digits
}

/** رابط واتساب سريع لصنف واحد (زر «اطلب على الواتساب» داخل كارت الصنف) */
export function quickWhatsappUrl(
  settings: SiteSettings,
  item: Pick<MenuItem, 'nameAr' | 'price' | 'unitAr'>,
  number?: string
): string {
  const target =
    number ??
    settings.whatsappNumbers.find((entry) => entry.isDefault)?.number ??
    settings.whatsappNumbers[0]?.number ??
    '201159353495'
  const international = toInternationalNumber(target)
  const text = `مرحبًا ${settings.brandName} 👋\nعايز أطلب: ${item.nameAr} (${item.price} ${settings.currency}${
    item.unitAr ? ` / ${item.unitAr}` : ''
  })`
  return `https://wa.me/${international}?text=${encodeURIComponent(text)}`
}

/** رابط واتساب عام (بدون صنف) — مع إمكانية اختيار رقم محدد من قائمة الأرقام */
export function generalWhatsappUrl(settings: SiteSettings, message?: string, number?: string): string {
  const target =
    number ??
    settings.whatsappNumbers.find((entry) => entry.isDefault)?.number ??
    settings.whatsappNumbers[0]?.number ??
    '201159353495'
  const international = toInternationalNumber(target)
  const text = message ?? `مرحبًا ${settings.brandName} 👋 عايز أستفسر عن الطلبات.`
  return `https://wa.me/${international}?text=${encodeURIComponent(text)}`
}

// ---------------------------------------------------------------------------
// لوحة التحكم (الأدمن)
// ---------------------------------------------------------------------------
const TOKEN_KEY = 'gargabeta-admin-token'

export function getAdminToken(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

async function adminRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): Promise<T> {
  const token = options.token ?? getAdminToken()
  const response = await fetch(`${API_BASE_URL}/api/admin${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !payload || payload.success !== true) {
    const error = new Error(payload?.error?.message ?? 'حدث خطأ غير متوقع') as Error & { status?: number }
    error.status = response.status
    throw error
  }

  return payload.data
}

export const adminApi = {
  login: (email: string, password: string) =>
    adminRequest<{ token: string; admin: AdminUser }>('/login', {
      method: 'POST',
      body: { email, password },
      token: 'none',
    }),
  me: () => adminRequest<AdminUser>('/me'),
  logout: () => adminRequest<{ loggedOut: boolean }>('/logout', { method: 'POST' }),
  changePassword: (currentPassword: string, newPassword: string) =>
    adminRequest<{ token: string; updated: boolean }>('/password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    }),
  overview: () => adminRequest<AdminOverview>('/overview'),

  listCategories: () => adminRequest<Category[]>('/categories'),
  createCategory: (body: Record<string, unknown>) =>
    adminRequest<{ id: number }>('/categories', { method: 'POST', body }),
  updateCategory: (id: number, body: Record<string, unknown>) =>
    adminRequest<{ id: number }>(`/categories/${id}`, { method: 'PATCH', body }),
  deleteCategory: (id: number) => adminRequest<{ id: number }>(`/categories/${id}`, { method: 'DELETE' }),

  listItems: () => adminRequest<MenuItem[]>('/items'),
  createItem: (body: Record<string, unknown>) =>
    adminRequest<{ id: number }>('/items', { method: 'POST', body }),
  updateItem: (id: number, body: Record<string, unknown>) =>
    adminRequest<{ id: number }>(`/items/${id}`, { method: 'PATCH', body }),
  deleteItem: (id: number) => adminRequest<{ id: number }>(`/items/${id}`, { method: 'DELETE' }),

  listMedia: () => adminRequest<MediaItem[]>('/media'),
  createMedia: (body: Record<string, unknown>) =>
    adminRequest<{ id: number }>('/media', { method: 'POST', body }),
  updateMedia: (id: number, body: Record<string, unknown>) =>
    adminRequest<{ id: number }>(`/media/${id}`, { method: 'PATCH', body }),
  deleteMedia: (id: number) => adminRequest<{ id: number }>(`/media/${id}`, { method: 'DELETE' }),

  getSettings: () => adminRequest<SiteSettings>('/settings'),
  updateSettings: (body: Record<string, unknown>) =>
    adminRequest<SiteSettings>('/settings', { method: 'PATCH', body }),

  listOrders: (status?: string) => adminRequest<OrderRow[]>(`/orders${status ? `?status=${status}` : ''}`),
  updateOrderStatus: (id: number, status: string) =>
    adminRequest<{ id: number }>(`/orders/${id}`, { method: 'PATCH', body: { status } }),
  deleteOrder: (id: number) => adminRequest<{ id: number }>(`/orders/${id}`, { method: 'DELETE' }),

  /** رفع صورة أو فيديو من جهاز الأدمن */
  upload: async (file: File): Promise<{ id: string; url: string; kind: 'photo' | 'video' }> => {
    const form = new FormData()
    form.append('file', file)
    const response = await fetch(`${API_BASE_URL}/api/admin/uploads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAdminToken()}` },
      body: form,
    })

    const payload = (await response.json().catch(() => null)) as ApiEnvelope<{
      id: string
      url: string
      kind: 'photo' | 'video'
    }> | null

    if (!response.ok || !payload || payload.success !== true) {
      throw new Error(payload?.error?.message ?? 'تعذّر رفع الملف')
    }

    return payload.data
  },
}
