import {
  ArrowRight,
  BookOpenCheck,
  BookOpenText,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { QuoteActions } from '@/components/dawuh/QuoteActions'
import {
  DAWUH_PAGE_SIZE,
  formatDawuhDate,
  getDawuhArchive,
  getDawuhImageURL,
  isDawuhEvent,
  isDawuhMedia,
  isDawuhTopic,
} from '@/lib/dawuh'
import type { Dawuh } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dawuh & Khazanah | guskikin.id',
  description:
    'Arsip petuah, mutiara hikmah, dan risalah keilmuan yang dikelola melalui kanal editorial guskikin.id.',
}

type SearchParams = Promise<{
  page?: string | string[]
  q?: string | string[]
  topik?: string | string[]
}>

const firstValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value

const buildDawuhURL = ({
  page,
  query,
  topic,
}: {
  page?: number
  query?: string
  topic?: string
}) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (topic) params.set('topik', topic)
  if (page && page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/dawuh?${search}` : '/dawuh'
}

const DawuhCard = ({ record }: { record: Dawuh }) => {
  const topic = isDawuhTopic(record.topic) ? record.topic : null
  const event = isDawuhEvent(record.event) ? record.event : null
  const imageURL = getDawuhImageURL(record.portrait)
  const media = isDawuhMedia(record.portrait) ? record.portrait : null

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_14px_32px_rgba(15,81,50,0.08)]">
      {imageURL ? (
        <div className="relative aspect-[16/8.5] overflow-hidden bg-surface-container-low">
          <Image
            alt={media?.alt || 'Dokumentasi kegiatan pengajian'}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            src={imageURL}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex rounded-full bg-surface-container-low px-3 py-1 font-label-sm text-label-sm font-bold text-primary">
            {topic?.title || 'Mutiara Hikmah'}
          </span>
          <BookOpenCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-text-body" />
        </div>
        <h2 className="mt-4 font-editorial text-headline-md font-bold leading-tight text-primary">
          <Link className="transition-colors hover:text-emerald-deep" href={`/dawuh/${record.slug}`}>
            {record.context || 'Catatan Dawuh & Mutiara Hikmah'}
          </Link>
        </h2>
        <blockquote className="mt-4 border-l-2 border-secondary/45 pl-4 font-editorial text-[1.05rem] italic leading-7 text-on-surface-variant">
          “{record.quote}”
        </blockquote>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
          <p className="inline-flex max-w-[70%] items-start gap-1.5 font-caption text-caption leading-5 text-text-body">
            <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-secondary" />
            {record.source || event?.title || 'Arsip editorial guskikin.id'}
          </p>
          <Link className="inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary" href={`/dawuh/${record.slug}`}>
            Selengkapnya <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

const FeaturedDawuh = ({ record }: { record: Dawuh }) => {
  const date = formatDawuhDate(record.date)
  const event = isDawuhEvent(record.event) ? record.event : null

  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_rgba(15,81,50,0.07)] before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-secondary">
      <div className="grid gap-7 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:p-12">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wide text-white">
              Dawuh terpilih
            </span>
            {date ? <span className="font-label-sm text-label-sm font-semibold text-secondary">{date}</span> : null}
          </div>
          <span aria-hidden="true" className="mt-2 block font-editorial text-7xl leading-none text-secondary/20">“</span>
          <blockquote className="-mt-7 max-w-4xl pl-5 font-editorial text-[clamp(1.75rem,3.2vw,2.8rem)] font-semibold italic leading-[1.42] text-primary">
            {record.quote}
          </blockquote>
          <p className="mt-7 flex max-w-3xl items-start gap-2 font-body-sm text-body-sm leading-6 text-text-body">
            <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-secondary" />
            {record.source || event?.title || record.context || 'Arsip editorial guskikin.id'}
          </p>
        </div>
        <QuoteActions quote={record.quote} />
      </div>
    </article>
  )
}

export default async function DawuhPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = firstValue(params.q)?.trim() || ''
  const topicSlug = firstValue(params.topik) || ''
  const requestedPage = Number.parseInt(firstValue(params.page) || '1', 10)
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1
  const archive = await getDawuhArchive({ page, query, topicSlug })
  const activeTopic = archive.topics.find((topic) => topic.slug === topicSlug)
  const totalAvailable = archive.totalDocs + (archive.featured ? 1 : 0)
  const start = archive.totalDocs ? (archive.page - 1) * DAWUH_PAGE_SIZE + 1 : 0
  const end = archive.records.length ? start + archive.records.length - 1 : 0

  return (
    <div className="bg-cream-bg">
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto flex max-w-container-max flex-wrap items-center justify-between gap-3 px-gutter-mobile py-4 font-label-sm text-label-sm sm:px-gutter-tablet lg:px-gutter-desktop">
          <nav className="flex items-center gap-2 text-text-body" aria-label="Breadcrumb">
            <Link className="hover:text-primary" href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-primary">Dawuh &amp; Khazanah</span>
            <span aria-hidden="true">•</span>
            <span className="font-semibold text-secondary">Kanal Khazanah Mutiara Petuah</span>
          </nav>
          <span className="inline-flex items-center gap-2 text-text-body"><span className="size-2 rounded-full bg-secondary" /> Arsip diperbarui oleh redaksi</span>
        </div>
      </div>

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-container-max px-gutter-mobile py-12 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-primary">
            <BookOpenText aria-hidden="true" className="size-4 text-secondary" /> Khazanah petuah &amp; mutiara hikmah
          </span>
          <h1 className="mt-5 max-w-4xl font-editorial text-headline-xl-mobile font-bold leading-[1.08] tracking-tight text-primary lg:text-headline-xl">
            Dawuh, Petuah Hikmah &amp; Risalah Keilmuan Gus Kikin
          </h1>
          <p className="mt-5 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">
            Dokumentasi nasihat, kalam kearifan, dan petuah pengajian untuk santri, nahdliyin, serta masyarakat umum—disajikan bersama konteks dan sumber editorialnya.
          </p>

          <form action="/dawuh" className="mt-9 rounded-2xl border border-border bg-surface-muted p-4" method="get">
            <div className="flex flex-col gap-3 md:flex-row">
              <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <Search aria-hidden="true" className="size-4 text-text-body" />
                <span className="sr-only">Cari dawuh</span>
                <input className="w-full bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-text-body/70" defaultValue={query} name="q" placeholder="Cari kata kunci dawuh, tema, atau sumber majelis..." type="search" />
              </label>
              {topicSlug ? <input name="topik" type="hidden" value={topicSlug} /> : null}
              <button className="min-h-12 rounded-xl bg-primary px-6 font-label-sm text-label-sm font-bold text-white hover:bg-emerald-deep" type="submit">Cari arsip</button>
              <div className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 font-label-sm text-label-sm font-bold text-primary">
                <ShieldCheck aria-hidden="true" className="size-4" /> {totalAvailable} catatan tersedia
              </div>
            </div>
            <nav aria-label="Filter topik dawuh" className="mt-4 flex flex-wrap gap-2">
              <Link className={`rounded-full px-4 py-2 font-label-sm text-label-sm font-bold ${!activeTopic ? 'bg-primary text-white' : 'bg-surface-container-low text-text-body hover:text-primary'}`} href={buildDawuhURL({ query })}>Semua Dawuh ({totalAvailable})</Link>
              {archive.topics.map((topic) => (
                <Link className={`rounded-full px-4 py-2 font-label-sm text-label-sm font-semibold ${activeTopic?.id === topic.id ? 'bg-primary text-white' : 'bg-surface-container-low text-text-body hover:text-primary'}`} href={buildDawuhURL({ query, topic: topic.slug })} key={topic.id}>{topic.title} ({topic.count})</Link>
              ))}
            </nav>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-12">
        {archive.error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h2 className="font-editorial text-headline-md font-bold">Arsip belum dapat dimuat</h2><p className="mt-2 font-body-md text-body-md">Koneksi ke basis data sedang tidak tersedia. Silakan muat ulang halaman beberapa saat lagi.</p></div>
        ) : null}
        {archive.featured ? <FeaturedDawuh record={archive.featured} /> : null}

        <div className={`grid gap-8 ${archive.featured ? 'mt-10' : ''} lg:grid-cols-[minmax(0,1fr)_21rem]`}>
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3"><span className="size-3 rounded-full bg-primary" /><h2 className="font-editorial text-headline-md font-bold text-primary">{activeTopic ? activeTopic.title : query ? `Hasil pencarian “${query}”` : 'Koleksi Mutiara Dawuh'}</h2></div>
              <p className="font-caption text-caption text-text-body">{archive.totalDocs ? `Menampilkan ${start}–${end} dari ${archive.totalDocs} catatan` : 'Belum ada catatan'}</p>
            </div>

            {archive.records.length ? (
              <div className="grid items-stretch gap-5 md:grid-cols-2">{archive.records.map((record) => <DawuhCard key={record.id} record={record} />)}</div>
            ) : !archive.error ? (
              <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-14 text-center"><BookOpenText aria-hidden="true" className="mx-auto size-9 text-primary/45" /><h2 className="mt-4 font-editorial text-headline-md font-bold text-primary">Belum ada dawuh yang cocok</h2><p className="mx-auto mt-2 max-w-md font-body-sm text-body-sm leading-6 text-text-body">Coba kata kunci lain atau kembali ke seluruh koleksi.</p><Link className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 font-label-sm text-label-sm font-bold text-white" href="/dawuh">Lihat semua dawuh</Link></div>
            ) : null}

            {archive.totalPages > 1 ? (
              <nav aria-label="Navigasi halaman dawuh" className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-white p-3">
                <p className="hidden font-caption text-caption text-text-body sm:block">Halaman {archive.page} dari {archive.totalPages}</p>
                <div className="ml-auto flex items-center gap-2">
                  {archive.page > 1 ? <Link aria-label="Halaman sebelumnya" className="grid size-10 place-items-center rounded-xl border border-border hover:text-primary" href={buildDawuhURL({ page: archive.page - 1, query, topic: topicSlug })}><ChevronLeft aria-hidden="true" className="size-4" /></Link> : null}
                  {Array.from({ length: archive.totalPages }, (_, index) => index + 1).filter((number) => number === 1 || number === archive.totalPages || Math.abs(number - archive.page) <= 1).map((number, index, visiblePages) => (
                    <span className="contents" key={number}>{index > 0 && number - visiblePages[index - 1] > 1 ? <span className="px-1 text-text-body">…</span> : null}<Link aria-current={number === archive.page ? 'page' : undefined} className={`grid size-10 place-items-center rounded-xl border font-label-sm text-label-sm font-bold ${number === archive.page ? 'border-primary bg-primary text-white' : 'border-border hover:text-primary'}`} href={buildDawuhURL({ page: number, query, topic: topicSlug })}>{number}</Link></span>
                  ))}
                  {archive.page < archive.totalPages ? <Link aria-label="Halaman berikutnya" className="grid size-10 place-items-center rounded-xl border border-border hover:text-primary" href={buildDawuhURL({ page: archive.page + 1, query, topic: topicSlug })}><ChevronRight aria-hidden="true" className="size-4" /></Link> : null}
                </div>
              </nav>
            ) : null}
          </section>

          <aside className="space-y-5">
            <section className="overflow-hidden rounded-2xl bg-emerald-deep p-6 text-white shadow-[0_14px_32px_rgba(6,78,59,0.14)]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-label-sm text-label-sm font-bold text-white/85"><FileText aria-hidden="true" className="size-4" /> Dokumen resmi</span>
              <h2 className="mt-5 font-editorial text-headline-md font-bold">Pustaka Transkrip Risalah</h2>
              <p className="mt-3 font-body-sm text-body-sm leading-6 text-white/75">Baca naskah khutbah, risalah pengajian, dan arsip keilmuan yang dikelola redaksi.</p>
              <Link className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 font-label-sm text-label-sm font-bold text-white hover:bg-accent-gold-dark" href="/khazanah">Buka pustaka digital <ArrowRight aria-hidden="true" className="size-4" /></Link>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-2"><Sparkles aria-hidden="true" className="size-4 text-secondary" /><h2 className="font-editorial text-headline-sm font-bold text-primary">Topik Kalam</h2></div>
              <div className="mt-4 flex flex-wrap gap-2">{archive.topics.length ? archive.topics.map((topic) => <Link className="rounded-full bg-surface-container-low px-3 py-1.5 font-caption text-caption font-semibold text-text-body hover:text-primary" href={buildDawuhURL({ topic: topic.slug })} key={topic.id}>#{topic.title.replaceAll(' ', '')} ({topic.count})</Link>) : <p className="font-body-sm text-body-sm leading-6 text-text-body">Topik akan muncul otomatis dari data Payload.</p>}</div>
            </section>

            {archive.upcomingEvents.length ? (
              <section className="rounded-2xl border border-border bg-white p-5">
                <div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-secondary" /><h2 className="font-editorial text-headline-sm font-bold text-primary">Agenda Pengajian</h2></div>
                <div className="mt-4 space-y-3">{archive.upcomingEvents.map((event) => <article className="rounded-xl bg-surface-muted p-4" key={event.id}><p className="font-label-sm text-label-sm font-bold text-secondary">{formatDawuhDate(event.startDate)}</p><h3 className="mt-1 font-editorial text-[1rem] font-bold text-on-surface">{event.title}</h3><p className="mt-1 font-caption text-caption text-text-body">{event.venue || event.city || 'Lokasi menyusul'}</p></article>)}</div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-border bg-surface-container-low p-5">
              <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
              <h2 className="mt-3 font-editorial text-headline-sm font-bold text-primary">Konteks &amp; Sumber</h2>
              <p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">Setiap catatan menampilkan konteks atau sumber yang diisikan redaksi melalui Payload.</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
