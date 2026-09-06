import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Author, Category, Media, News } from '@/payload-types'

export const NEWS_PAGE_SIZE = 9

export type NewsArchive = {
  categories: Category[]
  error: boolean
  featured: News | null
  page: number
  records: News[]
  totalDocs: number
  totalPages: number
}

const publishedWhere: Where = {
  _status: { equals: 'published' },
}

export const isNewsCategory = (value: News['category']): value is Category =>
  Boolean(value && typeof value === 'object' && 'title' in value)

export const isNewsAuthor = (
  value: NonNullable<News['authors']>[number],
): value is Author => Boolean(value && typeof value === 'object' && 'name' in value)

export const isNewsMedia = (value: News['featuredImage']): value is Media =>
  Boolean(value && typeof value === 'object' && 'alt' in value)

export const getNewsCategory = (record: News) =>
  isNewsCategory(record.category) ? record.category : null

export const getNewsAuthors = (record: News) => record.authors?.filter(isNewsAuthor) ?? []

export const getNewsMediaURL = (
  media: News['featuredImage'],
  size: 'card' | 'feature' = 'card',
) => {
  if (!isNewsMedia(media)) return null
  return media.sizes?.[size]?.url || media.url || null
}

export const formatNewsDate = (date?: string | null) => {
  if (!date) return 'Belum dijadwalkan'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date))
}

export const getNewsArchive = async ({
  page = 1,
  query,
}: {
  page?: number
  query?: string
}): Promise<NewsArchive> => {
  try {
    const payload = await getPayload({ config })
    const filters: Where[] = [publishedWhere]

    if (query?.trim()) {
      filters.push({
        or: [
          { title: { contains: query.trim() } },
          { excerpt: { contains: query.trim() } },
        ],
      })
    }

    const normalizedPage = Math.max(1, page)
    const [featuredResult, recordsResult, categoriesResult] = await Promise.all([
      normalizedPage === 1 && !query?.trim()
        ? payload.find({
            collection: 'news',
            depth: 2,
            limit: 1,
            overrideAccess: false,
            pagination: false,
            sort: '-publishedAt',
            where: { and: [publishedWhere, { isFeatured: { equals: true } }] },
          })
        : Promise.resolve({ docs: [] as News[] }),
      payload.find({
        collection: 'news',
        depth: 2,
        limit: NEWS_PAGE_SIZE,
        overrideAccess: false,
        page: normalizedPage,
        sort: '-publishedAt',
        where: { and: filters },
      }),
      payload.find({
        collection: 'categories',
        depth: 0,
        limit: 100,
        overrideAccess: false,
        pagination: false,
        sort: 'title',
      }),
    ])

    const featured = featuredResult.docs[0] ?? null
    const records = recordsResult.docs

    return {
      categories: categoriesResult.docs,
      error: false,
      featured,
      page: recordsResult.page ?? normalizedPage,
      records,
      totalDocs: recordsResult.totalDocs,
      totalPages: recordsResult.totalPages,
    }
  } catch (error) {
    console.error('Unable to load news archive', error)
    return {
      categories: [],
      error: true,
      featured: null,
      page: 1,
      records: [],
      totalDocs: 0,
      totalPages: 0,
    }
  }
}

export const getNewsBySlug = async (slug: string) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'news',
      depth: 2,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: { and: [publishedWhere, { slug: { equals: slug } }] },
    })

    return result.docs[0] ?? null
  } catch (error) {
    console.error(`Unable to load news: ${slug}`, error)
    return null
  }
}

export const getLatestNews = async () => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'news',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      where: publishedWhere,
    })

    return result.docs[0] ?? null
  } catch (error) {
    console.error('Unable to load latest news', error)
    return null
  }
}
