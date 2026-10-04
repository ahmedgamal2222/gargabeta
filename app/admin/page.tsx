'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import AdminDashboard from '@/components/admin/admin-dashboard'
import AdminLogin from '@/components/admin/admin-login'
import { adminApi, clearAdminToken, getAdminToken, setAdminToken } from '@/lib/api'
import type { AdminUser } from '@/lib/types'

export default function AdminPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)

  // التحقق من الجلسة المحفوظة
  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      setChecking(false)
      return
    }

    adminApi
      .me()
      .then((user) => setAdmin(user))
      .catch(() => clearAdminToken())
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </main>
    )
  }

  if (!admin) {
    return (
      <AdminLogin
        onSuccess={(token, user) => {
          setAdminToken(token)
          setAdmin(user)
        }}
      />
    )
  }

  return (
    <AdminDashboard
      admin={admin}
      onLogout={() => {
        void adminApi.logout().catch(() => undefined)
        clearAdminToken()
        setAdmin(null)
      }}
    />
  )
}
