'use client'

import { useState } from 'react'
import { Loader2, LockKeyhole, Mail } from 'lucide-react'
import { toast } from 'sonner'

import BrandLogo from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/field'
import { adminApi } from '@/lib/api'
import type { AdminUser } from '@/lib/types'

export default function AdminLogin({
  onSuccess,
}: {
  onSuccess: (token: string, admin: AdminUser) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    try {
      const result = await adminApi.login(email.trim(), password)
      toast.success('أهلاً بيك 👋', { description: 'تم تسجيل الدخول بنجاح' })
      onSuccess(result.token, result.admin)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر تسجيل الدخول')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-7">
          <div className="flex flex-col items-center gap-3 text-center">
            <BrandLogo src="/images/logo.jpeg" name="جرجبيتا" size="lg" />
            <div>
              <h1 className="text-xl font-black text-foreground">لوحة تحكم جرجبيتا</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                دخول الأدمن لإدارة المنيو والصور والفيديوهات والطلبات.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="owner@gargabeta.com"
                  className="ps-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password">كلمة المرور</Label>
              <div className="relative">
                <LockKeyhole className="absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  dir="ltr"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="ps-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              تسجيل الدخول
            </Button>
          </form>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            البيانات الافتراضية: <span dir="ltr">owner@gargabeta.com</span> /{' '}
            <span dir="ltr">gargabeta123</span>
            <br />
            غيّرها من تبويب «الإعدادات» بعد أول دخول.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
