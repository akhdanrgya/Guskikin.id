import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Newspaper, Search } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ArticleImage } from '@/components/articles/ArticleImage'
import {
  formatNewsDate,
  getNewsArchive,
  getNewsCategory,
  NEWS_PAGE_SIZE,
} from '@/lib/news'
import type { News } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Berita | guskikin.id',
  description: 'Kabar terbaru, kegiatan, dan informasi resmi dari Gus Kikin dan guskikin.id.',
}

type SearchParams = Promise<{
  page?: string | string[]
  q?: string | string[]
}>

const firstValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)

const buildNewsURL = ({ page, query }: { page?: number; query?: string }) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (page && page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/berita?${search}` : '/berita'
}

function NewsCard({ record }: { record: News }) {
  const category = getNewsCategory(record)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_34px_rgba(15,81,50,0.08)]">
      <Link
        aria-label={`Baca berita: ${record.title}`}
        className="relative block aspect-[16/9] overflow-hidden bg-surface-container-low"
        href={`/berita/${record.slug}`}
      >
        <ArticleImage
          className="transition-transform duration-500 group-hover:scale-[1.025]"
          fallback
          image={record.featuredImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 31vw"
        />
        {record.isBreaking ? (
          <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wide text-white shadow-sm">
            Terkini
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 font-label-sm text-label-sm">
          <span className="font-bold text-secondary">{category?.title || 'Kabar Guskikin'}</span>
          <span className="inline-flex items-center gap-1.5 text-text-body">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {formatNewsDate(record.publishedAt || record.createdAt)}
          </span>
        </div>
        <h2 className="mt-4 font-editorial text-headline-md font-bold leading-tight text-text-headline">
          <Link className="transition-colors hover:text-primary" href={`/berita/${record.slug}`}>
            {record.title}
          </Link>
        </h2>
        {record.excerpt ? (
          <p className="mt-3 line-clamp-3 font-body-sm text-body-sm leading-6 text-text-body">
            {record.excerpt}
          </p>
        ) : null}
        <Link
          className="mt-auto inline-flex items-center gap-1.5 border-t border-border pt-5 font-label-sm text-label-sm font-bold text-primary"
          href={`/berita/${record.slug}`}
        >
          Baca berita
          <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

export default async function NewsArchivePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = firstValue(params.q)?.trim() || ''
  const requestedPage = Number.parseInt(firstValue(params.page) || '1', 10)
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1
  const archive = await getNewsArchive({ page, query })
  const start = archive.totalDocs ? (archive.page - 1) * NEWS_PAGE_SIZE + 1 : 0
  const end = Math.min(start + archive.records.length - 1, archive.totalDocs)

  return (
    <div className="min-h-[70vh] bg-[#f7f9fc]">
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-container-max px-gutter-mobile py-4 font-label-sm text-label-sm sm:px-gutter-tablet lg:px-gutter-desktop">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-text-body">
            <Link className="hover:text-primary" href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-primary">Berita</span>
          </nav>
        </div>
      </div>

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-container-max px-gutter-mobile py-12 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wide text-primary ring-1 ring-emerald-100">
            <Newspaper aria-hidden="true" className="size-4" /> Kabar resmi
          </span>
          <h1 className="mt-5 max-w-4xl font-editorial text-headline-xl-mobile font-bold leading-[1.06] tracking-tight text-primary lg:text-headline-xl">
            Berita &amp; Kegiatan Terkini
          </h1>
          <p className="mt-5 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">
            Informasi terbaru seputar kegiatan, silaturahmi, pesantren, dan agenda resmi Gus Kikin.
          </p>
          <form action="/berita" className="mt-9 flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-surface-muted p-3 sm:flex-row" method="get">
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <Search aria-hidden="true" className="size-4 text-text-body" />
              <span className="sr-only">Cari berita</span>
              <input className="w-full bg-transparent font-body-sm text-body-sm outline-none" defaultValue={query} name="q" placeholder="Cari berita atau kegiatan..." type="search" />
            </label>
            <button className="min-h-12 rounded-xl bg-primary px-6 font-label-sm text-label-sm font-bold text-white hover:bg-emerald-deep" type="submit">
              Cari berita
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-12">
        {archive.error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <h2 className="font-editorial text-headline-md font-bold">Berita belum dapat dimuat</h2>
            <p className="mt-2 font-body-sm text-body-sm">Silakan coba kembali beberapa saat lagi.</p>
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">Ruang Kabar</span>
            <h2 className="mt-1 font-editorial text-headline-md font-bold text-text-headline">
              {query ? `Hasil pencarian “${query}”` : 'Berita Terbaru'}
            </h2>
          </div>
          <p className="font-caption text-caption text-text-body">
            {archive.totalDocs ? `Menampilkan ${start}–${end} dari ${archive.totalDocs} berita` : 'Belum ada berita'}
          </p>
        </div>

        {archive.records.length ? (
          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {archive.records.map((record) => <NewsCard key={record.id} record={record} />)}
          </div>
        ) : !archive.error ? (
          <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-16 text-center">
            <Newspaper aria-hidden="true" className="mx-auto size-10 text-primary/40" />
            <h2 className="mt-4 font-editorial text-headline-md font-bold text-primary">Berita sedang dipersiapkan</h2>
            <p className="mx-auto mt-2 max-w-md font-body-sm text-body-sm leading-6 text-text-body">
              Tim redaksi sedang menyiapkan kabar terbaru untuk ditampilkan di sini.
            </p>
          </div>
        ) : null}

        {archive.totalPages > 1 ? (
          <nav aria-label="Navigasi halaman berita" className="mt-8 flex items-center justify-end gap-2">
            {archive.page > 1 ? (
              <Link aria-label="Halaman sebelumnya" className="grid size-10 place-items-center rounded-xl border border-border bg-white" href={buildNewsURL({ page: archive.page - 1, query })}>
                <ChevronLeft aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
            <span className="px-3 font-label-sm text-label-sm font-bold text-primary">{archive.page} / {archive.totalPages}</span>
            {archive.page < archive.totalPages ? (
              <Link aria-label="Halaman berikutnya" className="grid size-10 place-items-center rounded-xl border border-border bg-white" href={buildNewsURL({ page: archive.page + 1, query })}>
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  )
}
