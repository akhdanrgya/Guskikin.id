import { ArrowLeft, CalendarDays, Clock3, Map, MapPin, Radio, UsersRound } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  formatEventDate,
  formatEventDay,
  formatEventTime,
  getCalendarURL,
  getEventBySlug,
  getEventImageURL,
  getEventStatusLabel,
  getEventTypeLabel,
  getMapURL,
  isEventMedia,
} from '@/lib/events'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Agenda tidak ditemukan | guskikin.id' }
  return { title: `${event.title} | guskikin.id`, description: event.description || undefined }
}

const Action = ({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) => (
  <a className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 font-label-sm text-label-sm font-bold transition-colors ${primary ? 'border-primary bg-primary text-white hover:bg-emerald-deep' : 'border-border bg-white text-on-surface hover:border-primary/30 hover:text-primary'}`} href={href} rel="noreferrer" target="_blank">{children}</a>
)

export default async function AgendaDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const mapURL = getMapURL(event)
  const imageURL = getEventImageURL(event.poster)
  const media = isEventMedia(event.poster) ? event.poster : null
  const location = [event.venue, event.address, event.city].filter(Boolean).join(', ')
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    description: event.description || undefined,
    endDate: event.endDate || undefined,
    eventStatus: event.status === 'completed' ? 'https://schema.org/EventCompleted' : 'https://schema.org/EventScheduled',
    image: imageURL || undefined,
    location: location ? { '@type': 'Place', address: event.address || event.city, name: event.venue || event.city } : undefined,
    name: event.title,
    organizer: event.organizer ? { '@type': 'Organization', name: event.organizer } : undefined,
    startDate: event.startDate,
  }

  return (
    <article className="bg-cream-bg">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} type="application/ld+json" />
      <header className="border-b border-border bg-white"><div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14"><nav className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-text-body" aria-label="Breadcrumb"><Link className="hover:text-primary" href="/">Beranda</Link><span aria-hidden="true">/</span><Link className="hover:text-primary" href="/agenda">Safari Dakwah</Link><span aria-hidden="true">/</span><span className="font-bold text-primary">{getEventTypeLabel(event.eventType)}</span></nav></div></header>

      <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_rgba(15,81,50,0.07)]">
          {imageURL ? <div className="relative aspect-[16/7] overflow-hidden bg-surface-container-low"><Image alt={media?.alt || 'Poster agenda safari dakwah'} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 960px" src={imageURL} /></div> : null}
          <div className="border-l-[6px] border-primary p-7 sm:p-10 lg:p-12">
            <div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#fff0df] px-3 py-1 font-label-sm text-label-sm font-bold text-[#9a5000]">{getEventTypeLabel(event.eventType)}</span><span className="rounded-full bg-surface-container-low px-3 py-1 font-label-sm text-label-sm font-bold text-primary">{getEventStatusLabel(event.status)}</span>{event.city ? <span className="rounded-full bg-surface-muted px-3 py-1 font-label-sm text-label-sm font-bold text-text-body">{event.city}</span> : null}</div>
            <h1 className="mt-6 max-w-4xl font-editorial text-headline-xl-mobile font-bold leading-[1.08] tracking-tight text-primary sm:text-headline-xl">{event.title}</h1>
            {event.description ? <p className="mt-5 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">{event.description}</p> : null}

            <dl className="mt-8 grid gap-4 rounded-2xl border border-border bg-surface-muted p-5 sm:grid-cols-2 lg:grid-cols-3">
              <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><CalendarDays aria-hidden="true" className="size-4" /> Tanggal</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{formatEventDay(event.startDate)}, {formatEventDate(event.startDate)}</dd></div>
              <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><Clock3 aria-hidden="true" className="size-4" /> Waktu</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{event.scheduleLabel || formatEventTime(event.startDate, event.endDate)}</dd></div>
              <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><MapPin aria-hidden="true" className="size-4" /> Lokasi</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{event.venue || 'Lokasi menyusul'}{event.city ? <><br /><span className="font-normal text-text-body">{event.city}</span></> : null}</dd></div>
              {event.organizer ? <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><UsersRound aria-hidden="true" className="size-4" /> Penyelenggara</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{event.organizer}</dd></div> : null}
              {event.audience ? <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><UsersRound aria-hidden="true" className="size-4" /> Peserta</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{event.audience}</dd></div> : null}
              {event.address ? <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><Map aria-hidden="true" className="size-4" /> Alamat</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{event.address}</dd></div> : null}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3"><Action href={getCalendarURL(event)} primary><CalendarDays aria-hidden="true" className="size-4" /> Simpan ke kalender</Action>{mapURL ? <Action href={mapURL}><Map aria-hidden="true" className="size-4 text-secondary" /> Buka Google Maps</Action> : null}{event.registrationUrl ? <Action href={event.registrationUrl}><UsersRound aria-hidden="true" className="size-4" /> Daftar acara</Action> : null}{event.livestreamUrl ? <Action href={event.livestreamUrl} primary><Radio aria-hidden="true" className="size-4" /> Tonton siaran</Action> : null}</div>
          </div>
        </section>

        {event.contact && (event.contact.phone || event.contact.email) ? <aside className="mt-6 rounded-2xl border border-primary/15 bg-surface-container-low p-6"><h2 className="font-editorial text-headline-sm font-bold text-primary">Kontak Penyelenggara</h2><div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-body-sm text-body-sm text-text-body">{event.contact.name ? <strong className="text-on-surface">{event.contact.name}</strong> : null}{event.contact.phone ? <a className="font-bold text-primary" href={`tel:${event.contact.phone}`}>{event.contact.phone}</a> : null}{event.contact.email ? <a className="font-bold text-primary" href={`mailto:${event.contact.email}`}>{event.contact.email}</a> : null}</div></aside> : null}
        <Link className="mt-8 inline-flex items-center gap-2 font-label-sm text-label-sm font-bold text-primary hover:text-emerald-deep" href="/agenda"><ArrowLeft aria-hidden="true" className="size-4" /> Kembali ke semua agenda</Link>
      </div>
    </article>
  )
}
