import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Map,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {
  EVENT_PAGE_SIZE,
  formatEventDate,
  formatEventDay,
  formatEventTime,
  getCalendarURL,
  getEventArchive,
  getEventImageURL,
  getEventStatusLabel,
  getEventTypeLabel,
  getMapURL,
  isEventMedia,
  type EventType,
} from '@/lib/events'
import type { Event } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Safari Dakwah & Agenda | guskikin.id',
  description: 'Jadwal pengajian, silaturahmi pesantren, halaqah, dan agenda kebangsaan Gus Kikin.',
}

type SearchParams = Promise<{
  jenis?: string | string[]
  page?: string | string[]
  q?: string | string[]
  wilayah?: string | string[]
}>

const firstValue = (value?: string | string[]) => Array.isArray(value) ? value[0] : value
const eventTypes: Exclude<EventType, 'all'>[] = ['halaqah', 'pengajian-rutin', 'tabligh-akbar', 'silaturahmi', 'lainnya']
const validEventType = (value?: string): EventType => eventTypes.includes(value as Exclude<EventType, 'all'>) ? value as EventType : 'all'

const buildAgendaURL = ({ city, eventType, page, query }: { city?: string; eventType?: EventType; page?: number; query?: string }) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (city) params.set('wilayah', city)
  if (eventType && eventType !== 'all') params.set('jenis', eventType)
  if (page && page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/agenda?${search}` : '/agenda'
}

const ExternalAction = ({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) => (
  <a className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 font-label-sm text-label-sm font-bold transition-colors ${primary ? 'border-primary bg-primary text-white hover:bg-emerald-deep' : 'border-border bg-white text-on-surface hover:border-primary/25 hover:text-primary'}`} href={href} rel="noreferrer" target="_blank">{children}</a>
)

const FeaturedEvent = ({ event }: { event: Event }) => {
  const mapURL = getMapURL(event)
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_rgba(15,81,50,0.07)] before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-primary">
      <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:p-12">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wide text-white">Agenda terdekat</span>
            <span className="rounded-full bg-primary px-3 py-1 font-label-sm text-label-sm font-bold text-white">{getEventStatusLabel(event.status)}</span>
            {event.city ? <span className="rounded-full bg-surface-container-low px-3 py-1 font-label-sm text-label-sm font-bold text-primary">{event.city}</span> : null}
          </div>
          <h2 className="mt-5 max-w-4xl font-editorial text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.14] tracking-tight text-primary">{event.title}</h2>
          {event.description ? <p className="mt-4 max-w-4xl font-body-md text-body-md leading-7 text-text-body">{event.description}</p> : null}

          <dl className="mt-7 grid gap-5 rounded-2xl border border-border bg-surface-muted p-5 sm:grid-cols-3">
            <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><CalendarDays aria-hidden="true" className="size-4" /> Tanggal &amp; waktu</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{formatEventDay(event.startDate)}, {formatEventDate(event.startDate)}<br /><span className="text-primary">{event.scheduleLabel || formatEventTime(event.startDate, event.endDate)}</span></dd></div>
            <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><MapPin aria-hidden="true" className="size-4" /> Lokasi</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{event.venue || 'Lokasi menyusul'}<br /><span className="font-normal text-text-body">{[event.address, event.city].filter(Boolean).join(', ')}</span></dd></div>
            <div><dt className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-secondary"><UsersRound aria-hidden="true" className="size-4" /> Penyelenggara</dt><dd className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{event.organizer || 'Redaksi guskikin.id'}<br /><span className="font-normal text-text-body">{event.audience || 'Informasi peserta menyusul'}</span></dd></div>
          </dl>
        </div>
        <div className="flex flex-col gap-2">
          <ExternalAction href={getCalendarURL(event)} primary><CalendarDays aria-hidden="true" className="size-4" /> Simpan ke kalender</ExternalAction>
          {mapURL ? <ExternalAction href={mapURL}><Map aria-hidden="true" className="size-4 text-secondary" /> Buka peta</ExternalAction> : null}
          {event.registrationUrl ? <ExternalAction href={event.registrationUrl}><UsersRound aria-hidden="true" className="size-4" /> Daftar acara</ExternalAction> : null}
          {event.livestreamUrl ? <ExternalAction href={event.livestreamUrl} primary><Radio aria-hidden="true" className="size-4" /> Tonton live</ExternalAction> : null}
        </div>
      </div>
    </article>
  )
}

const EventCard = ({ event }: { event: Event }) => {
  const mapURL = getMapURL(event)
  return (
    <article className={`relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-[0_7px_24px_rgba(15,81,50,0.04)] before:absolute before:inset-y-0 before:left-0 before:w-1 ${event.status === 'completed' ? 'before:bg-text-body/40' : event.status === 'live' ? 'before:bg-secondary' : 'before:bg-primary'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#fff0df] px-3 py-1 font-label-sm text-label-sm font-bold text-[#9a5000]">{getEventTypeLabel(event.eventType)}</span><span className="rounded-full bg-surface-container-low px-3 py-1 font-label-sm text-label-sm font-bold text-primary">{getEventStatusLabel(event.status)}</span></div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 font-label-sm text-label-sm font-bold text-secondary"><Clock3 aria-hidden="true" className="size-3.5" /> {event.scheduleLabel || `${formatEventDate(event.startDate)} • ${formatEventTime(event.startDate, event.endDate)}`}</span>
      </div>
      <h2 className="mt-4 font-editorial text-headline-md font-bold leading-tight text-primary"><Link className="hover:text-emerald-deep" href={`/agenda/${event.slug}`}>{event.title}</Link></h2>
      {event.description ? <p className="mt-3 line-clamp-2 font-body-sm text-body-sm leading-6 text-text-body">{event.description}</p> : null}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-caption text-caption text-text-body"><span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-3.5 text-secondary" /> {event.venue || event.city || 'Lokasi menyusul'}</span>{event.audience ? <span className="inline-flex items-center gap-1.5"><UsersRound aria-hidden="true" className="size-3.5 text-primary" /> {event.audience}</span> : null}</div>
        <Link className="inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary" href={`/agenda/${event.slug}`}>{mapURL ? 'Detail & lokasi' : 'Lihat detail'} <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
      </div>
    </article>
  )
}

export default async function AgendaPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = firstValue(params.q)?.trim() || ''
  const city = firstValue(params.wilayah) || ''
  const eventType = validEventType(firstValue(params.jenis))
  const requestedPage = Number.parseInt(firstValue(params.page) || '1', 10)
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1
  const archive = await getEventArchive({ city, eventType, page, query })
  const totalAvailable = archive.totalDocs + (archive.featured ? 1 : 0)
  const start = archive.totalDocs ? (archive.page - 1) * EVENT_PAGE_SIZE + 1 : 0
  const end = archive.records.length ? start + archive.records.length - 1 : 0
  const liveEvent = [archive.featured, ...archive.records].find((event) => event?.livestreamUrl)
  const contactEvent = [archive.featured, ...archive.records].find((event) => event?.contact?.phone || event?.contact?.email)

  return (
    <div className="bg-cream-bg">
      <div className="border-b border-border bg-surface-container-low"><div className="mx-auto flex max-w-container-max flex-wrap items-center justify-between gap-3 px-gutter-mobile py-4 font-label-sm text-label-sm sm:px-gutter-tablet lg:px-gutter-desktop"><nav className="flex items-center gap-2 text-text-body" aria-label="Breadcrumb"><Link className="hover:text-primary" href="/">Beranda</Link><span aria-hidden="true">/</span><span className="font-bold text-primary">Safari Dakwah</span><span aria-hidden="true">•</span><span className="font-semibold text-secondary">Agenda &amp; Silaturahmi Nasional</span></nav><span className="inline-flex items-center gap-2 text-text-body"><span className="size-2 rounded-full bg-secondary" /> Dikelola melalui Payload Event</span></div></div>

      <section className="border-b border-border bg-white"><div className="mx-auto max-w-container-max px-gutter-mobile py-12 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-primary"><MapPin aria-hidden="true" className="size-4 text-secondary" /> Jejak silaturahmi &amp; dakwah keumatan</span>
        <h1 className="mt-5 max-w-4xl font-editorial text-headline-xl-mobile font-bold leading-[1.08] tracking-tight text-primary lg:text-headline-xl">Safari Dakwah, Pengajian &amp; Agenda Kebangsaan Gus Kikin</h1>
        <p className="mt-5 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">Jadwal tabligh akbar, pengajian, silaturahmi pesantren, serta forum kebangsaan—lengkap dengan waktu, lokasi, dan kanal siaran yang tersedia.</p>
        <form action="/agenda" className="mt-9 rounded-2xl border border-border bg-surface-muted p-4" method="get"><div className="grid gap-3 md:grid-cols-[1fr_13rem_auto_auto]">
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"><Search aria-hidden="true" className="size-4 text-text-body" /><span className="sr-only">Cari agenda</span><input className="w-full bg-transparent font-body-sm text-body-sm outline-none placeholder:text-text-body/70" defaultValue={query} name="q" placeholder="Cari agenda, kota, atau nama majelis..." type="search" /></label>
          <select aria-label="Pilih wilayah" className="min-h-12 rounded-xl border border-border bg-surface-container-low px-4 font-label-sm text-label-sm font-bold text-on-surface outline-none" defaultValue={city} name="wilayah"><option value="">Semua wilayah</option>{archive.regions.map((region) => <option key={region.city} value={region.city}>{region.city}</option>)}</select>
          {eventType !== 'all' ? <input name="jenis" type="hidden" value={eventType} /> : null}
          <button className="min-h-12 rounded-xl bg-primary px-5 font-label-sm text-label-sm font-bold text-white hover:bg-emerald-deep" type="submit">Cari agenda</button>
          <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 font-label-sm text-label-sm font-bold text-primary"><CalendarDays aria-hidden="true" className="size-4" /> {totalAvailable} agenda</span>
        </div><nav aria-label="Filter jenis agenda" className="mt-4 flex flex-wrap gap-2"><Link className={`rounded-full px-4 py-2 font-label-sm text-label-sm font-bold ${eventType === 'all' ? 'bg-primary text-white' : 'bg-surface-container-low text-text-body hover:text-primary'}`} href={buildAgendaURL({ city, query })}>Semua Agenda ({totalAvailable})</Link>{eventTypes.map((type) => <Link className={`rounded-full px-4 py-2 font-label-sm text-label-sm font-semibold ${eventType === type ? 'bg-primary text-white' : 'bg-surface-container-low text-text-body hover:text-primary'}`} href={buildAgendaURL({ city, eventType: type, query })} key={type}>{getEventTypeLabel(type)} ({archive.typeCounts[type]})</Link>)}</nav></form>
      </div></section>

      <div className="mx-auto max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-12">
        {archive.error ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h2 className="font-editorial text-headline-md font-bold">Agenda belum dapat dimuat</h2><p className="mt-2 font-body-md text-body-md">Koneksi basis data sedang tidak tersedia. Silakan muat ulang beberapa saat lagi.</p></div> : null}
        {archive.featured ? <FeaturedEvent event={archive.featured} /> : null}

        <div className={`grid gap-8 ${archive.featured ? 'mt-10' : ''} lg:grid-cols-[minmax(0,1fr)_21rem]`}><section><div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4"><div className="flex items-center gap-3"><span className="size-3 rounded-full bg-primary" /><h2 className="font-editorial text-headline-md font-bold text-primary">{eventType !== 'all' ? getEventTypeLabel(eventType) : query ? `Hasil pencarian “${query}”` : 'Jadwal Safari Dakwah'}</h2></div><p className="font-caption text-caption text-text-body">{archive.totalDocs ? `Menampilkan ${start}–${end} dari ${archive.totalDocs} agenda` : 'Belum ada agenda'}</p></div>
          {archive.records.length ? <div className="space-y-4">{archive.records.map((event) => <EventCard event={event} key={event.id} />)}</div> : !archive.error ? <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-14 text-center"><CalendarDays aria-hidden="true" className="mx-auto size-9 text-primary/45" /><h2 className="mt-4 font-editorial text-headline-md font-bold text-primary">Belum ada agenda yang cocok</h2><p className="mx-auto mt-2 max-w-md font-body-sm text-body-sm leading-6 text-text-body">Coba wilayah atau kata kunci lain.</p><Link className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 font-label-sm text-label-sm font-bold text-white" href="/agenda">Lihat semua agenda</Link></div> : null}
          {archive.totalPages > 1 ? <nav aria-label="Navigasi halaman agenda" className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-white p-3"><p className="hidden font-caption text-caption text-text-body sm:block">Halaman {archive.page} dari {archive.totalPages}</p><div className="ml-auto flex items-center gap-2">{archive.page > 1 ? <Link aria-label="Halaman sebelumnya" className="grid size-10 place-items-center rounded-xl border border-border hover:text-primary" href={buildAgendaURL({ city, eventType, page: archive.page - 1, query })}><ChevronLeft aria-hidden="true" className="size-4" /></Link> : null}{Array.from({ length: archive.totalPages }, (_, index) => index + 1).filter((number) => number === 1 || number === archive.totalPages || Math.abs(number - archive.page) <= 1).map((number) => <Link aria-current={number === archive.page ? 'page' : undefined} className={`grid size-10 place-items-center rounded-xl border font-label-sm text-label-sm font-bold ${number === archive.page ? 'border-primary bg-primary text-white' : 'border-border hover:text-primary'}`} href={buildAgendaURL({ city, eventType, page: number, query })} key={number}>{number}</Link>)}{archive.page < archive.totalPages ? <Link aria-label="Halaman berikutnya" className="grid size-10 place-items-center rounded-xl border border-border hover:text-primary" href={buildAgendaURL({ city, eventType, page: archive.page + 1, query })}><ChevronRight aria-hidden="true" className="size-4" /></Link> : null}</div></nav> : null}

          {archive.completedEvents.length ? <section className="mt-12"><div className="mb-5 flex items-end justify-between gap-4"><div className="flex items-center gap-3"><span className="size-3 rounded-full bg-secondary" /><h2 className="font-editorial text-headline-md font-bold text-primary">Dokumentasi Safari Terkini</h2></div></div><div className="grid gap-5 md:grid-cols-3">{archive.completedEvents.map((event) => { const imageURL = getEventImageURL(event.poster); const media = isEventMedia(event.poster) ? event.poster : null; return <article className="overflow-hidden rounded-2xl border border-border bg-white" key={event.id}>{imageURL ? <div className="relative aspect-[4/3] bg-surface-container-low"><Image alt={media?.alt || 'Dokumentasi safari dakwah'} className="object-cover" fill sizes="(max-width: 768px) 100vw, 30vw" src={imageURL} /></div> : null}<div className="p-5"><p className="font-label-sm text-label-sm font-bold text-secondary">{event.city || 'Safari Dakwah'} • {formatEventDate(event.startDate)}</p><h3 className="mt-2 font-editorial text-[1.05rem] font-bold leading-snug text-primary"><Link href={`/agenda/${event.slug}`}>{event.title}</Link></h3><Link className="mt-4 inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary" href={`/agenda/${event.slug}`}>Baca catatan <ArrowRight aria-hidden="true" className="size-3.5" /></Link></div></article> })}</div></section> : null}
        </section>

        <aside className="space-y-5"><section className="rounded-2xl border border-border bg-white p-5"><div className="flex items-center gap-2"><Map aria-hidden="true" className="size-5 text-secondary" /><h2 className="font-editorial text-headline-sm font-bold text-primary">Peta Persebaran Safari</h2></div><p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">Sebaran agenda berdasarkan kota yang tersimpan di Payload.</p><div className="mt-5 space-y-3">{archive.regions.length ? archive.regions.slice(0, 5).map((region) => <div className="rounded-xl bg-surface-container-low p-3" key={region.city}><div className="flex justify-between gap-3 font-label-sm text-label-sm font-bold"><span className="text-primary">{region.city}</span><span className="text-secondary">{region.percentage}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-primary" style={{ width: `${region.percentage}%` }} /></div><p className="mt-1 font-caption text-caption text-text-body">{region.count} agenda</p></div>) : <p className="font-body-sm text-body-sm text-text-body">Wilayah akan muncul setelah event ditambahkan.</p>}</div></section>
          {contactEvent?.contact ? <section className="rounded-2xl border border-primary/10 bg-surface-container-low p-5"><UsersRound aria-hidden="true" className="size-5 text-secondary" /><h2 className="mt-3 font-editorial text-headline-sm font-bold text-primary">Konfirmasi Kehadiran</h2><p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">Hubungi kontak yang dicantumkan penyelenggara agenda.</p><div className="mt-4 space-y-2 font-body-sm text-body-sm"><p className="rounded-xl bg-white p-3"><strong>{contactEvent.contact.name || 'Kontak acara'}</strong>{contactEvent.contact.phone ? <><br /><a className="text-primary" href={`tel:${contactEvent.contact.phone}`}>{contactEvent.contact.phone}</a></> : null}</p>{contactEvent.contact.email ? <p className="rounded-xl bg-white p-3"><a className="text-primary" href={`mailto:${contactEvent.contact.email}`}>{contactEvent.contact.email}</a></p> : null}</div></section> : null}
          {liveEvent?.livestreamUrl ? <section className="rounded-2xl bg-emerald-deep p-6 text-white shadow-[0_14px_32px_rgba(6,78,59,0.14)]"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-label-sm text-label-sm font-bold text-white/85"><Radio aria-hidden="true" className="size-4" /> Siaran langsung resmi</span><h2 className="mt-5 font-editorial text-headline-md font-bold">Kanal Siaran Langsung</h2><p className="mt-3 font-body-sm text-body-sm leading-6 text-white/75">Saksikan agenda yang menyediakan kanal streaming resmi.</p><a className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 font-label-sm text-label-sm font-bold text-white hover:bg-accent-gold-dark" href={liveEvent.livestreamUrl} rel="noreferrer" target="_blank">Buka kanal live <ArrowRight aria-hidden="true" className="size-4" /></a></section> : null}
          <section className="rounded-2xl border border-border bg-white p-5"><ShieldCheck aria-hidden="true" className="size-5 text-primary" /><h2 className="mt-3 font-editorial text-headline-sm font-bold text-primary">Informasi Jadwal</h2><p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">Tanggal, lokasi, dan kontak mengikuti data Event yang dikelola redaksi.</p><Link className="mt-4 inline-flex font-label-sm text-label-sm font-bold text-primary" href="/tentang">Hubungi redaksi <ArrowRight aria-hidden="true" className="size-3.5" /></Link></section>
        </aside></div>
      </div>
    </div>
  )
}
