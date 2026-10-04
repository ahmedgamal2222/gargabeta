'use client'

import { useRef, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/field'
import { adminApi, resolveAssetUrl } from '@/lib/api'

/**
 * حقل وسائط موحّد: لصق رابط (صورة/فيديو/يوتيوب) أو رفع ملف من الجهاز.
 * يُستخدم في الأصناف والوسائط والإعدادات.
 */
export default function UploadField({
  label,
  value,
  onChange,
  accept = 'both',
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  accept?: 'image' | 'video' | 'both'
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const acceptAttr =
    accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*'

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      const result = await adminApi.upload(file)
      onChange(result.url)
      toast.success('تم رفع الملف', { description: file.name })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذّر رفع الملف')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const isVideo = /\.(mp4|webm|mov)$/i.test(value) || value.startsWith('data:video')

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://… أو /api/uploads/…"
          dir="ltr"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="shrink-0"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          رفع
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}

      {value ? (
        <div className="overflow-hidden rounded-xl border border-border bg-secondary/40 p-2">
          {isVideo ? (
            <video src={resolveAssetUrl(value)} controls className="max-h-40 w-full rounded-lg" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={resolveAssetUrl(value)}
              alt=""
              className="max-h-40 w-full rounded-lg object-contain"
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
