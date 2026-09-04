import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Search, SearchX } from 'lucide-react'

import { searchSite, type GlobalSearchResult } from '@/lib/search'

export const metadata: Metadata = {
  title: 'Pencarian | guskikin.id',
  description: 'Cari artikel, dawuh, agenda, dan media dari seluruh arsip guskikin.id.',
}

type SearchParams = Promise<{ q?: string | string[] }>

const firstValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value

const formatResultDate = (date: string | null) => {
  if (!date) return null

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  }).format(new Date(date))
}

const resultColors: Record<GlobalSearchResult['type'], string> = {
  Agenda: 'bg-amber-50 text-amber-800 ring-amber-200',
  Artikel: 'bg-emerald-50 text-primary ring-emerald-200',
  Dawuh: 'bg-sky-50 text-sky-800 ring-sky-200',
  Media: 'bg-violet-50 text-violet-800 ring-violet-200',
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = firstValue(params.q)?.trim() || ''
  const response = await searchSite(query)

  return (
    <div className="min-h-[70vh] bg-[#f7f9fc]">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
          <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">
            Pencarian Global
          </p>
          <h1 className="mt-2 font-editorial text-headline-xl-mobile font-bold text-primary lg:text-headline-xl">
            Temukan dari seluruh khazanah
          </h1>
          <p className="mt-3 max-w-2xl font-body-md text-body-md leading-7 text-text-body">
            Cari sekaligus di artikel, dawuh, agenda safari dakwah, dan galeri multimedia.
          </p>

          <form action="/cari" className="mt-7 flex max-w-3xl flex-col gap-3 sm:flex-row" method="get">
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-border bg-white px-4 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <Search aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <span className="sr-only">Kata kunci pencarian</span>
              <input
                autoFocus
                className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-text-body/65"
                defaultValue={query}
                minLength={2}
                name="q"
                placeholder="Ketik judul, tema, tokoh, atau lokasi..."
                required
                type="search"
              />
            </label>
            <button className="min-h-14 rounded-xl bg-primary px-6 font-label-md text-label-md font-bold text-white transition-colors hover:bg-emerald-deep" type="submit">
              Cari sekarang
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-12">
        {query.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-14 text-center">
            <Search aria-hidden="true" className="mx-auto size-9 text-primary/45" />
            <h2 className="mt-4 font-editorial text-headline-md font-bold text-text-headline">
              Masukkan sedikitnya dua karakter
            </h2>
            <p className="mt-2 font-body-sm text-body-sm text-text-body">
              Contoh: pesantren, fiqih, kebangsaan, atau nama kota.
            </p>
          </div>
        ) : response.error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <h2 className="font-editorial text-headline-md font-bold">Pencarian belum dapat dimuat</h2>
            <p className="mt-2 font-body-sm text-body-sm">Silakan coba kembali beberapa saat lagi.</p>
          </div>
        ) : response.results.length ? (
          <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">
                  Hasil Pencarian
                </p>
                <h2 className="mt-1 font-editorial text-headline-md font-bold text-text-headline">
                  “{query}”
                </h2>
              </div>
              <p className="font-caption text-caption text-text-body">
                {response.results.length} hasil ditemukan
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {response.results.map((result) => {
                const date = formatResultDate(result.date)

                return (
                  <article className="group flex flex-col rounded-2xl border border-border bg-white p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_12px_30px_rgba(15,81,50,0.07)] sm:p-6" key={result.id}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1 font-label-sm text-label-sm font-bold ring-1 ring-inset ${resultColors[result.type]}`}>
                        {result.type}
                      </span>
                      {date ? (
                        <span className="inline-flex items-center gap-1.5 font-caption text-caption text-text-body">
                          <CalendarDays aria-hidden="true" className="size-3.5" /> {date}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 font-editorial text-headline-md font-bold leading-tight text-text-headline">
                      <Link className="transition-colors hover:text-primary" href={result.href}>
                        {result.title}
                      </Link>
                    </h3>
                    {result.excerpt ? (
                      <p className="mt-3 line-clamp-3 font-body-sm text-body-sm leading-6 text-text-body">
                        {result.excerpt}
                      </p>
                    ) : null}
                    <Link className="mt-auto inline-flex items-center gap-1.5 pt-5 font-label-sm text-label-sm font-bold text-primary" href={result.href}>
                      Buka {result.type.toLowerCase()} <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-14 text-center">
            <SearchX aria-hidden="true" className="mx-auto size-9 text-primary/45" />
            <h2 className="mt-4 font-editorial text-headline-md font-bold text-text-headline">
              Tidak ada hasil untuk “{query}”
            </h2>
            <p className="mx-auto mt-2 max-w-md font-body-sm text-body-sm leading-6 text-text-body">
              Coba kata yang lebih singkat, ejaan lain, atau tema yang lebih umum.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
