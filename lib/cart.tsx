'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'

import type { MenuItem } from './types'

export interface CartLine {
  id: number
  nameAr: string
  price: number
  unitAr: string
  quantity: number
  imageUrl: string | null
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  total: number
  /** هل سلة الطلبات مفتوحة؟ */
  isOpen: boolean
  add: (item: MenuItem, quantity?: number) => void
  increment: (id: number) => void
  decrement: (id: number) => void
  remove: (id: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'gargabeta-cart-v1'

/** سلة الطلبات: تُحفظ في المتصفح ويعاد بناء الطلب منها على الواتساب */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // استرجاع السلة المحفوظة
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[]
        if (Array.isArray(parsed)) setLines(parsed.filter((line) => line && line.id && line.quantity > 0))
      }
    } catch {
      // تجاهل أي بيانات تالفة
    }
    setHydrated(true)
  }, [])

  // حفظ السلة عند كل تغيير
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // مساحة التخزين ممتلئة — نتجاهل
    }
  }, [lines, hydrated])

  const add = useCallback((item: MenuItem, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === item.id)
      if (existing) {
        return current.map((line) =>
          line.id === item.id ? { ...line, quantity: Math.min(99, line.quantity + quantity) } : line
        )
      }
      return [
        ...current,
        {
          id: item.id,
          nameAr: item.nameAr,
          price: item.price,
          unitAr: item.unitAr,
          quantity: Math.min(99, Math.max(1, quantity)),
          imageUrl: item.imageUrl,
        },
      ]
    })
    toast.success('تمت الإضافة للسلة', { description: item.nameAr })
  }, [])

  const increment = useCallback((id: number) => {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, quantity: Math.min(99, line.quantity + 1) } : line))
    )
  }, [])

  const decrement = useCallback((id: number) => {
    setLines((current) =>
      current
        .map((line) => (line.id === id ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0)
    )
  }, [])

  const remove = useCallback((id: number) => {
    setLines((current) => current.filter((line) => line.id !== id))
  }, [])

  const clear = useCallback(() => setLines([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0)
    const total = lines.reduce((sum, line) => sum + line.quantity * line.price, 0)
    return {
      lines,
      count,
      total: Number(total.toFixed(2)),
      isOpen,
      add,
      increment,
      decrement,
      remove,
      clear,
      openCart,
      closeCart,
    }
  }, [lines, isOpen, add, increment, decrement, remove, clear, openCart, closeCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
