'use client'

import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button, type ButtonProps } from '@/components/ui/button'

/**
 * زر «ارسل المنيو لصديق»: يستخدم Web Share API على الجوال (يفتح واتساب/رسائل
 * مباشرة)، ويسقط تلقائيًا لنسخ الرابط + فتح واتساب على سطح المكتب.
 */
export default function ShareMenuButton({
  title = 'منيو جرجبيتا',
  text = 'شوف منيو جرجبيتا 🍖 لحوم طازجة ومصنعات ومشويات — اطلب من الواتساب مباشرة!',
  variant = 'outline',
  size = 'default',
  className,
}: {
  title?: string
  text?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch {
        // المستخدم أغلق نافذة المشاركة — نتجاهل ونكمل بالبديل
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('تم نسخ رابط المنيو 📋', { description: 'ابعته لصاحبك دلوقتي.' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
      window.open(whatsappShare, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={handleShare}>
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      ارسل المنيو لصديق
    </Button>
  )
}
