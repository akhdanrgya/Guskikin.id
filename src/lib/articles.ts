import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Author, Category, Media, Post, Tag } from '@/payload-types'

export const ARTICLE_PAGE_SIZE = 6

export type ArticleSort = 'terbaru' | 'terlama' | 'judul'

export type ArticleArchive = {
  categories: Category[]
  error: boolean
  featured: Post | null
  page: number
  posts: Post[]
  tags: Tag[]
  totalDocs: number
  totalPages: number
}

const publishedWhere: Where = {
  _status: { equals: 'published' },
}

export const isCategory = (value: Post['category']): value is Category =>
  Boolean(value && typeof value === 'object' && 'title' in value)

export const isTag = (value: NonNullable<Post['tags']>[number]): value is Tag =>
  Boolean(value && typeof value === 'object' && 'title' in value)

export const isAuthor = (value: NonNullable<Post['authors']>[number]): value is Author =>
  Boolean(value && typeof value === 'object' && 'name' in value)

export const isMedia = (value: Post['featuredImage'] | Author['avatar']): value is Media =>
  Boolean(value && typeof value === 'object' && 'alt' in value)

export const getCategory = (post: Post) =>
  isCategory(post.category) ? post.category : null

export const getAuthors = (post: Post) => post.authors?.filter(isAuthor) ?? []

export const getTags = (post: Post) => post.tags?.filter(isTag) ?? []

export const getMediaURL = (
  media: Post['featuredImage'],
  size: 'card' | 'feature' = 'card',
) => {
  if (!isMedia(media)) return null
  return media.sizes?.[size]?.url || media.url || null
}

export const formatArticleDate = (date?: string | null) => {
  if (!date) return 'Belum dijadwalkan'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date))
}

export const getArticleArchive = async ({
  categorySlug,
  page = 1,
  query,
  sort = 'terbaru',
}: {
  categorySlug?: string
  page?: number
  query?: string
  sort?: ArticleSort
}): Promise<ArticleArchive> => {
  try {
    const payload = await getPayload({ config })
    const [categoriesResult, tagsResult] = await Promise.all([
      payload.find({
        collection: 'categories',
        limit: 100,
        overrideAccess: false,
        pagination: false,
        sort: 'title',
      }),
      payload.find({
        collection: 'tags',
        limit: 12,
        overrideAccess: false,
        pagination: false,
        sort: 'title',
      }),
    ])

    const selectedCategory = categoriesResult.docs.find(
      (category) => category.slug === categorySlug,
    )
    const filters: Where[] = [publishedWhere]

    if (query?.trim()) {
      filters.push({
        or: [
          { title: { contains: query.trim() } },
          { excerpt: { contains: query.trim() } },
        ],
      })
    }

    if (selectedCategory) {
      filters.push({ category: { equals: selectedCategory.id } })
    }

    const hasActiveFilter = Boolean(query?.trim() || selectedCategory)
    const normalizedPage = Math.max(1, page)
    let featured: Post | null = null

    if (normalizedPage === 1 && !hasActiveFilter) {
      const featuredResult = await payload.find({
        collection: 'posts',
        depth: 2,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        sort: '-publishedAt',
        where: {
          and: [publishedWhere, { isFeatured: { equals: true } }],
        },
      })
      featured = featuredResult.docs[0] ?? null
    }

    if (featured) {
      filters.push({ id: { not_equals: featured.id } })
    }

    const sortValue =
      sort === 'terlama' ? 'publishedAt' : sort === 'judul' ? 'title' : '-publishedAt'
    const postsResult = await payload.find({
      collection: 'posts',
      depth: 2,
      limit: ARTICLE_PAGE_SIZE,
      overrideAccess: false,
      page: normalizedPage,
      sort: sortValue,
      where: { and: filters },
    })

    if (!featured && normalizedPage === 1 && !hasActiveFilter && postsResult.docs.length) {
      featured = postsResult.docs[0]
      postsResult.docs = postsResult.docs.slice(1)
    }

    return {
      categories: categoriesResult.docs,
      error: false,
      featured,
      page: postsResult.page ?? normalizedPage,
      posts: postsResult.docs,
      tags: tagsResult.docs,
      totalDocs: postsResult.totalDocs,
      totalPages: postsResult.totalPages,
    }
  } catch (error) {
    console.error('Unable to load article archive', error)
    return {
      categories: [],
      error: true,
      featured: null,
      page: 1,
      posts: [],
      tags: [],
      totalDocs: 0,
      totalPages: 0,
    }
  }
}

export const getArticleBySlug = async (slug: string) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'posts',
      depth: 2,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: {
        and: [publishedWhere, { slug: { equals: slug } }],
      },
    })

    return result.docs[0] ?? null
  } catch (error) {
    console.error(`Unable to load article ${slug}`, error)
    return null
  }
}
