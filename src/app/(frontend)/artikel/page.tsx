import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  Search,
  Sparkles,
} from 'lucide-react'

import { ArticleImage } from '@/components/articles/ArticleImage'
import {
  ARTICLE_PAGE_SIZE,
  formatArticleDate,
  getArticleArchive,
  getAuthors,
  getCategory,
  type ArticleSort,
} from '@/lib/articles'
import type { Post } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Artikel & Opini | guskikin.id',
  description:
    'Khazanah artikel, opini, fiqih peradaban, kemandirian pesantren, dan refleksi kebangsaan dari guskikin.id.',
}

type SearchParams = Promise<{
  kategori?: string | string[]
  page?: string | string[]
  q?: string | string[]
  urut?: string | string[]
}>

const firstValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value

const validSort = (value?: string): ArticleSort =>
  value === 'terlama' || value === 'judul' ? value : 'terbaru'

const buildArchiveURL = ({
  category,
  page,
  query,
  sort,
}: {
  category?: string
  page?: number
  query?: string
  sort?: ArticleSort
}) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (category) params.set('kategori', category)
  if (sort && sort !== 'terbaru') params.set('urut', sort)
  if (page && page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/artikel?${search}` : '/artikel'
}

const ArticleMeta = ({ post }: { post: Post }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label-sm text-label-sm text-text-body">
    <span className="inline-flex items-center gap-1.5 font-semibold text-secondary">
      <CalendarDays aria-hidden="true" className="size-3.5" />
      {formatArticleDate(post.publishedAt)}
    </span>
    <span className="inline-flex items-center gap-1.5">
      <Clock3 aria-hidden="true" className="size-3.5" />
      {post.readingTime || 5} menit baca
    </span>
  </div>
)

const FeaturedArticle = ({ post }: { post: Post }) => {
  const category = getCategory(post)
  const author = getAuthors(post)[0]

  return (
    <article className="grid overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_40px_rgba(15,81,50,0.07)] lg:grid-cols-[1.32fr_0.95fr]">
      <div className="relative min-h-[19rem] overflow-hidden bg-primary lg:min-h-[31rem]">
        <ArticleImage
          fallback
          image={post.featuredImage}
          priority
          sizes="(max-width: 1024px) 100vw, 56vw"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f4b000] px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wide text-[#3c2900]">
            Pilihan Redaksi
          </span>
          {category ? (
            <span className="rounded-full bg-primary px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wide text-white">
              {category.title}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <ArticleMeta post={post} />
        <h2 className="mt-5 font-editorial text-[2rem] font-bold leading-[1.16] tracking-tight text-text-headline lg:text-[2.45rem]">
          <Link className="transition-colors hover:text-primary" href={`/artikel/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="mt-4 line-clamp-4 font-body-md text-body-md leading-7 text-text-body">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="font-label-sm text-label-sm font-bold text-primary">
              {author?.name || 'Tim Redaksi Guskikin'}
            </p>
            <p className="mt-0.5 font-caption text-caption text-text-body">
              Kanal publikasi resmi guskikin.id
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-label-md text-label-md font-bold text-white transition-colors hover:bg-emerald-deep"
            href={`/artikel/${post.slug}`}
          >
            Baca selengkapnya <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

const ArticleCard = ({ index, post }: { index: number; post: Post }) => {
  const category = getCategory(post)
  const hasImage = Boolean(post.featuredImage && typeof post.featuredImage === 'object')

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_34px_rgba(15,81,50,0.08)]">
      {hasImage ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-container-low">
          <ArticleImage
            className="transition-transform duration-500 group-hover:scale-[1.025]"
            image={post.featuredImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 31vw"
          />
          {category ? (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-label-sm text-label-sm font-bold text-primary shadow-sm">
              {category.title}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="relative flex min-h-32 items-end overflow-hidden border-b border-primary/10 bg-[#f2f7f3] p-5">
          <span className="absolute right-5 top-1 font-editorial text-8xl font-bold text-primary/[0.055]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="relative inline-flex rounded-full bg-primary/10 px-3 py-1 font-label-sm text-label-sm font-bold text-primary">
            {category?.title || 'Khazanah Pemikiran'}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ArticleMeta post={post} />
        <h3 className="mt-4 font-editorial text-headline-md font-bold leading-tight text-text-headline">
          <Link className="transition-colors hover:text-primary" href={`/artikel/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 font-body-sm text-body-sm leading-6 text-text-body">
            {post.excerpt}
          </p>
        ) : null}
        <Link
          className="mt-6 inline-flex items-center gap-1.5 border-t border-border pt-4 font-label-sm text-label-sm font-bold text-primary"
          href={`/artikel/${post.slug}`}
        >
          Baca artikel <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

export default async function ArticleArchivePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const query = firstValue(params.q)?.trim() || ''
  const categorySlug = firstValue(params.kategori) || ''
  const sort = validSort(firstValue(params.urut))
  const requestedPage = Number.parseInt(firstValue(params.page) || '1', 10)
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1
  const archive = await getArticleArchive({ categorySlug, page, query, sort })
  const activeCategory = archive.categories.find((category) => category.slug === categorySlug)
  const start = archive.totalDocs ? (archive.page - 1) * ARTICLE_PAGE_SIZE + 1 : 0
  const end = Math.min(start + archive.posts.length - 1, archive.totalDocs)

  return (
    <div className="bg-[#f7f9fc]">
      <div className="border-b border-border bg-surface-container-low"><div className="mx-auto flex max-w-container-max flex-wrap items-center justify-between gap-3 px-gutter-mobile py-4 font-label-sm text-label-sm sm:px-gutter-tablet lg:px-gutter-desktop"><nav className="flex items-center gap-2 text-text-body" aria-label="Breadcrumb"><Link className="hover:text-primary" href="/">Beranda</Link><span aria-hidden="true">/</span><span className="font-bold text-primary">Artikel &amp; Opini</span></nav></div></div>

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-container-max px-gutter-mobile py-12 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wide text-primary ring-1 ring-emerald-100">
            <Sparkles aria-hidden="true" className="size-3.5" /> Khazanah intelektual pesantren
          </span>
          <h1 className="mt-5 max-w-4xl font-editorial text-headline-xl-mobile font-bold leading-[1.06] tracking-tight text-primary lg:text-headline-xl">
            Khazanah Artikel, Opini &amp; Refleksi Kebangsaan
          </h1>
          <p className="mt-5 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">
            Koleksi kajian fiqih peradaban kontemporer, dawuh keagamaan berhaluan wasathiyah, transformasi tata kelola pesantren, dan catatan pemikiran K.H. Abdul Hakim Mahfudz.
          </p>

          <form action="/artikel" className="mt-9 grid gap-3 rounded-2xl border border-border bg-surface-muted p-3 md:grid-cols-[1fr_auto_auto]" method="get">
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <Search aria-hidden="true" className="size-4 text-text-body" />
              <span className="sr-only">Cari artikel</span>
              <input
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-text-body/70"
                defaultValue={query}
                name="q"
                placeholder="Cari risalah, tema kajian, atau kata kunci..."
                type="search"
              />
            </label>
            {categorySlug ? <input name="kategori" type="hidden" value={categorySlug} /> : null}
            <label className="flex min-h-12 items-center gap-2 rounded-xl border border-border bg-white px-4 font-label-sm text-label-sm text-text-body">
              Urutkan
              <select className="bg-transparent font-bold text-on-surface outline-none" defaultValue={sort} name="urut">
                <option value="terbaru">Terbitan terbaru</option>
                <option value="terlama">Terbitan terlama</option>
                <option value="judul">Judul A–Z</option>
              </select>
            </label>
            <button className="min-h-12 rounded-xl bg-primary px-5 font-label-sm text-label-sm font-bold text-white hover:bg-emerald-deep" type="submit">
              Temukan artikel
            </button>
          </form>

          <nav aria-label="Filter rubrik" className="mt-4 flex flex-wrap gap-2">
            <Link
              className={`rounded-full border px-4 py-2 font-label-sm text-label-sm font-bold transition-colors ${!activeCategory ? 'border-primary bg-primary text-white' : 'border-border bg-white text-text-body hover:border-primary/30 hover:text-primary'}`}
              href={buildArchiveURL({ query, sort })}
            >
              Semua Rubrik
            </Link>
            {archive.categories.map((category) => (
              <Link
                className={`rounded-full border px-4 py-2 font-label-sm text-label-sm font-semibold transition-colors ${activeCategory?.id === category.id ? 'border-primary bg-primary text-white' : 'border-border bg-white text-text-body hover:border-primary/30 hover:text-primary'}`}
                href={buildArchiveURL({ category: category.slug, query, sort })}
                key={category.id}
              >
                {category.title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-12">
        {archive.error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <h2 className="font-editorial text-headline-md font-bold">Arsip belum dapat dimuat</h2>
            <p className="mt-2 font-body-md text-body-md">Koneksi ke basis data sedang tidak tersedia. Silakan muat ulang halaman beberapa saat lagi.</p>
          </div>
        ) : null}

        {archive.featured ? <FeaturedArticle post={archive.featured} /> : null}

        <div className={`grid gap-8 ${archive.featured ? 'mt-10' : ''} lg:grid-cols-[minmax(0,1fr)_19rem]`}>
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <div>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">Arsip Editorial</span>
                <h2 className="mt-1 font-editorial text-headline-md font-bold text-text-headline">
                  {activeCategory ? activeCategory.title : query ? `Hasil pencarian “${query}”` : 'Artikel & Esai Terbaru'}
                </h2>
              </div>
              <p className="font-caption text-caption text-text-body">
                {archive.totalDocs ? `Menampilkan ${start}–${end} dari ${archive.totalDocs} artikel` : 'Belum ada artikel'}
              </p>
            </div>

            {archive.posts.length ? (
              <div className="grid items-stretch gap-5 md:grid-cols-2">
                {archive.posts.map((post, index) => (
                  <ArticleCard index={index + (archive.page - 1) * ARTICLE_PAGE_SIZE} key={post.id} post={post} />
                ))}
              </div>
            ) : !archive.error ? (
              <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-14 text-center">
                <BookOpen aria-hidden="true" className="mx-auto size-8 text-primary/50" />
                <h3 className="mt-4 font-editorial text-headline-md font-bold text-text-headline">Belum ada artikel yang cocok</h3>
                <p className="mx-auto mt-2 max-w-md font-body-sm text-body-sm leading-6 text-text-body">Coba gunakan kata kunci lain atau kembali ke semua rubrik.</p>
                <Link className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 font-label-sm text-label-sm font-bold text-white" href="/artikel">Lihat semua artikel</Link>
              </div>
            ) : null}

            {archive.totalPages > 1 ? (
              <nav aria-label="Navigasi halaman artikel" className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-white p-3">
                <p className="hidden font-caption text-caption text-text-body sm:block">Halaman {archive.page} dari {archive.totalPages}</p>
                <div className="ml-auto flex items-center gap-2">
                  {archive.page > 1 ? (
                    <Link aria-label="Halaman sebelumnya" className="grid size-10 place-items-center rounded-xl border border-border hover:border-primary/30 hover:text-primary" href={buildArchiveURL({ category: categorySlug, page: archive.page - 1, query, sort })}>
                      <ChevronLeft aria-hidden="true" className="size-4" />
                    </Link>
                  ) : null}
                  {Array.from({ length: archive.totalPages }, (_, index) => index + 1)
                    .filter((number) => number === 1 || number === archive.totalPages || Math.abs(number - archive.page) <= 1)
                    .map((number, index, visiblePages) => (
                      <span className="contents" key={number}>
                        {index > 0 && number - visiblePages[index - 1] > 1 ? <span className="px-1 text-text-body">…</span> : null}
                        <Link
                          aria-current={number === archive.page ? 'page' : undefined}
                          className={`grid size-10 place-items-center rounded-xl border font-label-sm text-label-sm font-bold ${number === archive.page ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary/30 hover:text-primary'}`}
                          href={buildArchiveURL({ category: categorySlug, page: number, query, sort })}
                        >
                          {number}
                        </Link>
                      </span>
                    ))}
                  {archive.page < archive.totalPages ? (
                    <Link aria-label="Halaman berikutnya" className="grid size-10 place-items-center rounded-xl border border-border hover:border-primary/30 hover:text-primary" href={buildArchiveURL({ category: categorySlug, page: archive.page + 1, query, sort })}>
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </Link>
                  ) : null}
                </div>
              </nav>
            ) : null}
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-border bg-white p-5">
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">Jelajah Khazanah</span>
              <h2 className="mt-1 font-editorial text-headline-sm font-bold text-text-headline">Topik Pilihan</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {archive.tags.length ? archive.tags.map((tag) => (
                  <span className="rounded-full border border-border bg-surface-muted px-3 py-1.5 font-caption text-caption font-semibold text-text-body" key={tag.id}>#{tag.title.replaceAll(' ', '')}</span>
                )) : (
                  <p className="font-body-sm text-body-sm leading-6 text-text-body">Tag dari Payload akan tampil otomatis di sini.</p>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl bg-emerald-deep p-6 text-white shadow-[0_12px_28px_rgba(6,78,59,0.16)]">
              <div className="grid size-10 place-items-center rounded-xl bg-[#f4a000] text-[#422600]"><BookOpen aria-hidden="true" className="size-5" /></div>
              <h2 className="mt-5 font-editorial text-headline-md font-bold">Pustaka Risalah Digital</h2>
              <p className="mt-3 font-body-sm text-body-sm leading-6 text-white/75">Temukan transkrip khutbah, risalah bahtsul masail, dan arsip keilmuan dalam satu pustaka.</p>
              <Link className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4a000] px-4 py-3 font-label-sm text-label-sm font-bold text-[#422600] hover:bg-[#ffb020]" href="/khazanah">
                Jelajahi pustaka <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <Mail aria-hidden="true" className="size-5 text-primary" />
              <h2 className="mt-3 font-editorial text-headline-sm font-bold text-text-headline">Buletin Khazanah Mingguan</h2>
              <p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">Dapatkan pilihan artikel, dawuh Jumat, dan agenda safari secara berkala.</p>
              <Link className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-primary px-4 py-3 font-label-sm text-label-sm font-bold text-primary hover:bg-primary hover:text-white" href="/tentang">
                Daftar buletin gratis
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
