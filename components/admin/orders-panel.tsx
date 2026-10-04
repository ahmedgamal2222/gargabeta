'use client'

import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/field'
import { adminApi, toInternationalNumber } from '@/lib/api'
import type { OrderRow } from '@/lib/types'

const STATUS_LABELS: Record<OrderRow['status'], string> = {
  new: 'جديد',
  confirmed: 'تم التأكيد',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

const STATUS_VARIANT: Record<OrderRow['status'], 'orange' | 'success' | 'default' | 'red'> = {
  new: 'orange',
  confirmed: 'success',
  delivered: 'default',
  cancelled: 'red',
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | OrderRow['status']>('all')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setOrders(await adminApi.listOrders())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر تحميل الطلبات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const changeStatus = async (order: OrderRow, status: OrderRow['status']) => {
    try {
      await adminApi.updateOrderStatus(order.id, status)
      setOrders((current) =>
        current.map((entry) => (entry.id === order.id ? { ...entry, status } : entry))
      )
      toast.success('تم تحديث حالة الطلب')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر التحديث')
    }
  }

  const remove = async (order: OrderRow) => {
    if (!window.confirm(`حذف الطلب #${order.id}؟`)) return
    try {
      await adminApi.deleteOrder(order.id)
      setOrders((current) => current.filter((entry) => entry.id !== order.id))
      toast.success('تم حذف الطلب')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر الحذف')
    }
  }

  const visible =
    statusFilter === 'all' ? orders : orders.filter((entry) => entry.status === statusFilter)
  const totalValue = visible.reduce((sum, entry) => sum + entry.total, 0)

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-foreground">الطلبات ({visible.length})</p>
            <p className="text-[11px] text-muted-foreground">
              إجمالي قيمة الطلبات المعروضة: {totalValue.toLocaleString('ar-EG')} ج.م
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | OrderRow['status'])}
              className="h-9 w-40 text-xs"
            >
              <option value="all">كل الحالات</option>
              <option value="new">جديد</option>
              <option value="confirmed">تم التأكيد</option>
              <option value="delivered">تم التسليم</option>
              <option value="cancelled">ملغي</option>
            </Select>
            <Button type="button" variant="outline" size="sm" onClick={load} disabled={loading}>
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              تحديث
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {visible.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-black text-foreground">
                    #{order.id} — {order.customerName || 'بدون اسم'}
                    <Badge variant={STATUS_VARIANT[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    <span dir="ltr">{order.customerPhone}</span>
                    {order.area ? ` • ${order.area}` : ''}
                    {order.address ? ` • ${order.address}` : ''}
                    {order.createdAt ? ` • ${order.createdAt}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-brand-red">{order.total} ج.م</span>

                  {order.customerPhone ? (
                    <Button asChild variant="ghost" size="sm">
                      <a
                        href={`https://wa.me/${toInternationalNumber(order.customerPhone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-3.5" />
                        واتساب العميل
                      </a>
                    </Button>
                  ) : null}

                  <Select
                    value={order.status}
                    onChange={(event) =>
                      changeStatus(order, event.target.value as OrderRow['status'])
                    }
                    className="h-9 w-36 text-xs"
                  >
                    <option value="new">جديد</option>
                    <option value="confirmed">تم التأكيد</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغي</option>
                  </Select>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => remove(order)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              {order.items?.length ? (
                <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-secondary/30">
                  {order.items.map((item, index) => (
                    <li
                      key={`${order.id}-${index}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 text-[12px]"
                    >
                      <span className="font-bold text-foreground/90">
                        {item.name} × {item.quantity}
                        {item.unit ? ` ${item.unit}` : ''}
                      </span>
                      <span className="text-muted-foreground">{item.price * item.quantity} ج.م</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {order.notes ? (
                <p className="mt-2 rounded-xl bg-brand-yellow/15 px-3 py-2 text-[11px] text-foreground/80">
                  ملاحظات: {order.notes}
                </p>
              ) : null}
            </div>
          ))}

          {!loading && visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-xs text-muted-foreground">
              لا توجد طلبات في هذه الحالة.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
