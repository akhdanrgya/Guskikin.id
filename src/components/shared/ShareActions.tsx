'use client'

import {
  Check,
  Link2,
  MessageCircle,
  Send,
} from 'lucide-react'
import { useState } from 'react'

type ShareActionsProps = {
  excerpt?: string | null
  path: string
  title: string
}

type ShareChannel = 'facebook' | 'telegram' | 'whatsapp' | 'x'

const openShareWindow = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer,width=720,height=640')
}

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export function ShareActions({ excerpt, path, title }: ShareActionsProps) {
  const [notice, setNotice] = useState<string | null>(null)
  const getURL = () => new URL(path, window.location.origin).toString()
  const shareText = excerpt ? `${title}\n\n${excerpt}` : title

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 3200)
  }

  const shareTo = (channel: ShareChannel) => {
    const url = getURL()
    const destinations: Record<ShareChannel, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    }
    openShareWindow(destinations[channel])
  }

  const copyLink = async (message = 'Tautan berhasil disalin.') => {
    try {
      await copyText(getURL())
      showNotice(message)
    } catch {
      showNotice('Tautan tidak dapat disalin. Silakan salin dari kolom alamat browser.')
    }
  }

  const shareInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title, url: getURL() })
        showNotice('Konten siap dibagikan.')
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }
    await copyLink('Tautan disalin. Tempelkan tautan ini di Instagram Story, bio, atau pesan.')
  }

  const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-3.5 font-label-sm text-label-sm font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

  return (
    <section aria-labelledby={`share-${path.replaceAll('/', '-')}`} className="rounded-2xl border border-primary/15 bg-surface-container-low p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">Bagikan konten</p>
          <h2 className="mt-1 font-editorial text-headline-sm font-bold text-primary" id={`share-${path.replaceAll('/', '-')}`}>Sebarkan manfaatnya</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button aria-label="Bagikan ke WhatsApp" className={buttonClass} onClick={() => shareTo('whatsapp')} type="button"><MessageCircle aria-hidden="true" className="size-4 text-[#25D366]" /> WhatsApp</button>
          <button aria-label="Bagikan ke Instagram" className={buttonClass} onClick={shareInstagram} type="button"><span aria-hidden="true" className="text-lg font-bold leading-none text-[#C13584]">◎</span> Instagram</button>
          <button aria-label="Bagikan ke X" className={buttonClass} onClick={() => shareTo('x')} type="button"><span aria-hidden="true" className="text-base leading-none">𝕏</span> X</button>
          <button aria-label="Bagikan ke Telegram" className={buttonClass} onClick={() => shareTo('telegram')} type="button"><Send aria-hidden="true" className="size-4 text-[#229ED9]" /> Telegram</button>
          <button aria-label="Bagikan ke Facebook" className={buttonClass} onClick={() => shareTo('facebook')} type="button"><span aria-hidden="true" className="text-base font-black leading-none text-[#1877F2]">f</span> Facebook</button>
          <button aria-label="Salin tautan" className={buttonClass} onClick={() => copyLink()} type="button"><Link2 aria-hidden="true" className="size-4" /> Salin</button>
        </div>
      </div>
      <p aria-live="polite" className={`mt-3 flex min-h-5 items-center gap-1.5 font-caption text-caption font-semibold text-primary ${notice ? 'visible' : 'invisible'}`} role="status">
        <Check aria-hidden="true" className="size-3.5" /> {notice || 'Tautan siap dibagikan.'}
      </p>
    </section>
  )
}
