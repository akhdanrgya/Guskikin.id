'use client'

import { Check, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function QuoteActions({ quote }: { quote: string }) {
  const [copied, setCopied] = useState(false)
  const shareURL = `https://wa.me/?text=${encodeURIComponent(`“${quote}”\n\nBaca khazanah lainnya di guskikin.id/dawuh`)}`

  const copyQuote = async () => {
    await navigator.clipboard.writeText(`“${quote}”`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row lg:w-52 lg:flex-col">
      <Button className="h-11 justify-center border-border bg-white px-4 text-on-surface hover:bg-surface-muted" onClick={copyQuote} variant="outline">
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? 'Kutipan tersalin' : 'Salin kutipan'}
      </Button>
      <Button className="h-11 justify-center bg-primary px-4 text-white hover:bg-emerald-deep" nativeButton={false} render={<a href={shareURL} rel="noreferrer" target="_blank" />}>
        <Share2 aria-hidden="true" /> Bagikan ke WhatsApp
      </Button>
    </div>
  )
}
