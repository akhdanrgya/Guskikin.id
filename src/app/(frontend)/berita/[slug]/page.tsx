import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, CalendarDays, Clock3, UserRound } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleImage } from '@/components/articles/ArticleImage'
import {
  formatArticleDate,
  getArticleBySlug,
  getAuthors,
  getCategory,
  getMediaURL,
  getTags,
} from '@/lib/articles'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getArticleBySlug(slug)

  if (!post) return { title: 'Artikel tidak ditemukan | guskikin.id' }

  return {
    title: `${post.title} | guskikin.id`,
    description: post.excerpt || undefined,
    openGraph: {
      description: post.excerpt || undefined,
      images: getMediaURL(post.featuredImage, 'feature')
        ? [{ url: getMediaURL(post.featuredImage, 'feature')! }]
        : undefined,
      title: post.title,
      type: 'article',
    },
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getArticleBySlug(slug)
  if (!post) notFound()

  const category = getCategory(post)
  const authors = getAuthors(post)
  const tags = getTags(post)
  const hasImage = Boolean(getMediaURL(post.featuredImage, 'feature'))

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    author: authors.map((author) => ({ '@type': 'Person', name: author.name })),
    dateModified: post.updatedAt,
    datePublished: post.publishedAt || post.createdAt,
    description: post.excerpt || undefined,
    headline: post.title,
    image: getMediaURL(post.featuredImage, 'feature') || undefined,
  }

  return (
    <article className="bg-[#f7f9fc]">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        type="application/ld+json"
      />

      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-16">
          <nav className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-text-body" aria-label="Breadcrumb">
            <Link className="hover:text-primary" href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link className="hover:text-primary" href="/berita">Artikel &amp; Opini</Link>
            {category ? <><span aria-hidden="true">/</span><span className="font-bold text-primary">{category.title}</span></> : null}
          </nav>

          {category ? (
            <Link className="mt-10 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wide text-primary ring-1 ring-emerald-100" href={`/berita?kategori=${category.slug}`}>
              {category.title}
            </Link>
          ) : null}
          <h1 className="mt-5 max-w-4xl font-editorial text-[2.55rem] font-bold leading-[1.08] tracking-tight text-text-headline sm:text-[3.5rem]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-6 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">{post.excerpt}</p>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 font-label-sm text-label-sm text-text-body">
            <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-secondary" /> {formatArticleDate(post.publishedAt)}</span>
            <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" className="size-4 text-secondary" /> {post.readingTime || 5} menit baca</span>
            <span className="inline-flex items-center gap-2"><UserRound aria-hidden="true" className="size-4 text-secondary" /> {authors.map((author) => author.name).join(', ') || 'Tim Redaksi Guskikin'}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
        {hasImage ? (
          <figure className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-primary shadow-[0_18px_50px_rgba(15,81,50,0.12)]">
            <ArticleImage image={post.featuredImage} priority sizes="(max-width: 1024px) 100vw, 960px" />
          </figure>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,46rem)_12rem] lg:items-start lg:justify-between">
          <RichText
            className="article-prose rounded-2xl border border-border bg-white px-6 py-8 shadow-[0_10px_35px_rgba(15,81,50,0.045)] sm:px-10 sm:py-11"
            data={post.content}
          />

          <aside className="rounded-2xl border border-border bg-white p-5 lg:sticky lg:top-36">
            <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">Tentang Tulisan</p>
            <dl className="mt-4 space-y-4 font-body-sm text-body-sm">
              <div><dt className="text-text-body">Rubrik</dt><dd className="mt-1 font-bold text-primary">{category?.title || 'Khazanah Pemikiran'}</dd></div>
              <div><dt className="text-text-body">Penulis</dt><dd className="mt-1 font-bold text-on-surface">{authors.map((author) => author.name).join(', ') || 'Tim Redaksi Guskikin'}</dd></div>
            </dl>
            {tags.length ? (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                {tags.map((tag) => <span className="rounded-full bg-surface-muted px-2.5 py-1 font-caption text-caption text-text-body" key={tag.id}>#{tag.title.replaceAll(' ', '')}</span>)}
              </div>
            ) : null}
          </aside>
        </div>

        <Link className="mt-8 inline-flex items-center gap-2 font-label-sm text-label-sm font-bold text-primary hover:text-emerald-deep" href="/berita">
          <ArrowLeft aria-hidden="true" className="size-4" /> Kembali ke arsip artikel
        </Link>
      </div>
    </article>
  )
}
