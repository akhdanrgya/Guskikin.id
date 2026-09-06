import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, CalendarDays, Clock3, UserRound } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { ArticleImage } from '@/components/articles/ArticleImage'
import { getArticleBySlug } from '@/lib/articles'
import {
  formatNewsDate,
  getNewsAuthors,
  getNewsBySlug,
  getNewsCategory,
  getNewsMediaURL,
} from '@/lib/news'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const record = await getNewsBySlug(slug)

  if (!record) return { title: 'Berita tidak ditemukan | guskikin.id' }

  return {
    title: `${record.title} | guskikin.id`,
    description: record.excerpt || undefined,
    openGraph: {
      description: record.excerpt || undefined,
      images: getNewsMediaURL(record.featuredImage, 'feature')
        ? [{ url: getNewsMediaURL(record.featuredImage, 'feature')! }]
        : undefined,
      title: record.title,
      type: 'article',
    },
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const record = await getNewsBySlug(slug)
  if (!record) {
    const legacyArticle = await getArticleBySlug(slug)
    if (legacyArticle) permanentRedirect(`/artikel/${slug}`)
    notFound()
  }

  const category = getNewsCategory(record)
  const authors = getNewsAuthors(record)
  const hasImage = Boolean(getNewsMediaURL(record.featuredImage, 'feature'))

  return (
    <article className="bg-[#f7f9fc]">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-text-body">
            <Link className="hover:text-primary" href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link className="hover:text-primary" href="/berita">Berita</Link>
            {category ? <><span aria-hidden="true">/</span><span className="font-bold text-primary">{category.title}</span></> : null}
          </nav>

          <span className="mt-10 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wide text-primary ring-1 ring-emerald-100">
            {category?.title || 'Kabar Guskikin'}
          </span>
          <h1 className="mt-5 max-w-4xl font-editorial text-[2.55rem] font-bold leading-[1.08] tracking-tight text-text-headline sm:text-[3.5rem]">
            {record.title}
          </h1>
          {record.excerpt ? <p className="mt-6 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">{record.excerpt}</p> : null}
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 font-label-sm text-label-sm text-text-body">
            <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-secondary" /> {formatNewsDate(record.publishedAt || record.createdAt)}</span>
            <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" className="size-4 text-secondary" /> {record.readingTime || 3} menit baca</span>
            <span className="inline-flex items-center gap-2"><UserRound aria-hidden="true" className="size-4 text-secondary" /> {authors.map((author) => author.name).join(', ') || 'Tim Redaksi Guskikin'}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
        {hasImage ? (
          <figure className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-primary shadow-[0_18px_50px_rgba(15,81,50,0.12)]">
            <ArticleImage image={record.featuredImage} priority sizes="(max-width: 1024px) 100vw, 960px" />
          </figure>
        ) : null}
        <RichText
          className="article-prose mx-auto max-w-3xl rounded-2xl border border-border bg-white px-6 py-8 shadow-[0_10px_35px_rgba(15,81,50,0.045)] sm:px-10 sm:py-11"
          data={record.content}
        />
        <Link className="mt-8 inline-flex items-center gap-2 font-label-sm text-label-sm font-bold text-primary hover:text-emerald-deep" href="/berita">
          <ArrowLeft aria-hidden="true" className="size-4" /> Kembali ke daftar berita
        </Link>
      </div>
    </article>
  )
}
