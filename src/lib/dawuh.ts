import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Category, Dawuh, Event, Media } from '@/payload-types'

export const DAWUH_PAGE_SIZE = 6

export type DawuhTopic = Category & { count: number }

export type DawuhArchive = {
  error: boolean
  featured: Dawuh | null
  page: number
  records: Dawuh[]
  topics: DawuhTopic[]
  totalDocs: number
  totalPages: number
  upcomingEvents: Event[]
}

export const isDawuhTopic = (value: Dawuh['topic']): value is Category =>
  Boolean(value && typeof value === 'object' && 'title' in value)

export const isDawuhEvent = (value: Dawuh['event']): value is Event =>
  Boolean(value && typeof value === 'object' && 'title' in value)

export const isDawuhMedia = (value: Dawuh['portrait']): value is Media =>
  Boolean(value && typeof value === 'object' && 'alt' in value)

export const getDawuhImageURL = (portrait: Dawuh['portrait']) => {
  if (!isDawuhMedia(portrait)) return null
  return portrait.sizes?.card?.url || portrait.sizes?.feature?.url || portrait.url || null
}

export const formatDawuhDate = (date?: string | null) => {
  if (!date) return null
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date))
}

export const getDawuhArchive = async ({
  page = 1,
  query,
  topicSlug,
}: {
  page?: number
  query?: string
  topicSlug?: string
}): Promise<DawuhArchive> => {
  try {
    const payload = await getPayload({ config })
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'title',
    })

    const topicsWithCounts = await Promise.all(
      categoriesResult.docs.map(async (topic) => {
        const result = await payload.count({
          collection: 'dawuh',
          overrideAccess: false,
          where: { topic: { equals: topic.id } },
        })
        return { ...topic, count: result.totalDocs }
      }),
    )
    const topics = topicsWithCounts.filter((topic) => topic.count > 0)
    const selectedTopic = topics.find((topic) => topic.slug === topicSlug)
    const filters: Where[] = []

    if (query?.trim()) {
      filters.push({
        or: [
          { quote: { contains: query.trim() } },
          { context: { contains: query.trim() } },
          { source: { contains: query.trim() } },
        ],
      })
    }
    if (selectedTopic) filters.push({ topic: { equals: selectedTopic.id } })

    const normalizedPage = Math.max(1, page)
    const hasActiveFilter = Boolean(query?.trim() || selectedTopic)
    let featured: Dawuh | null = null

    if (normalizedPage === 1 && !hasActiveFilter) {
      const featuredResult = await payload.find({
        collection: 'dawuh',
        depth: 2,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        sort: '-date',
      })
      featured = featuredResult.docs[0] ?? null
      if (featured) filters.push({ id: { not_equals: featured.id } })
    }

    const [recordsResult, eventsResult] = await Promise.all([
      payload.find({
        collection: 'dawuh',
        depth: 2,
        limit: DAWUH_PAGE_SIZE,
        overrideAccess: false,
        page: normalizedPage,
        sort: '-date',
        where: filters.length ? { and: filters } : undefined,
      }),
      payload.find({
        collection: 'events',
        depth: 1,
        limit: 2,
        overrideAccess: false,
        pagination: false,
        sort: 'startDate',
        where: {
          status: { in: ['upcoming', 'today', 'live'] },
        },
      }),
    ])

    return {
      error: false,
      featured,
      page: recordsResult.page ?? normalizedPage,
      records: recordsResult.docs,
      topics,
      totalDocs: recordsResult.totalDocs,
      totalPages: recordsResult.totalPages,
      upcomingEvents: eventsResult.docs,
    }
  } catch (error) {
    console.error('Unable to load dawuh archive', error)
    return {
      error: true,
      featured: null,
      page: 1,
      records: [],
      topics: [],
      totalDocs: 0,
      totalPages: 0,
      upcomingEvents: [],
    }
  }
}

export const getDawuhBySlug = async (slug: string) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'dawuh',
      depth: 2,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: { slug: { equals: slug } },
    })
    return result.docs[0] ?? null
  } catch (error) {
    console.error(`Unable to load dawuh ${slug}`, error)
    return null
  }
}
