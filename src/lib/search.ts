import config from '@payload-config'
import { getPayload, type Where } from 'payload'

export type GlobalSearchResult = {
  date: string | null
  excerpt: string | null
  href: string
  id: string
  title: string
  type: 'Agenda' | 'Artikel' | 'Dawuh' | 'Media'
}

export type GlobalSearchResponse = {
  error: boolean
  results: GlobalSearchResult[]
}

const matchingFields = (query: string, fields: string[]): Where => ({
  or: fields.map((field) => ({ [field]: { contains: query } })),
})

export const searchSite = async (rawQuery: string): Promise<GlobalSearchResponse> => {
  const query = rawQuery.trim()

  if (query.length < 2) return { error: false, results: [] }

  try {
    const payload = await getPayload({ config })
    const [posts, dawuh, events, media] = await Promise.all([
      payload.find({
        collection: 'posts',
        depth: 0,
        limit: 8,
        overrideAccess: false,
        sort: '-publishedAt',
        where: {
          and: [
            { _status: { equals: 'published' } },
            matchingFields(query, ['title', 'excerpt']),
          ],
        },
      }),
      payload.find({
        collection: 'dawuh',
        depth: 0,
        limit: 8,
        overrideAccess: false,
        sort: '-date',
        where: matchingFields(query, ['quote', 'context', 'source']),
      }),
      payload.find({
        collection: 'events',
        depth: 0,
        limit: 8,
        overrideAccess: false,
        sort: '-startDate',
        where: matchingFields(query, ['title', 'description', 'venue', 'city', 'organizer']),
      }),
      payload.find({
        collection: 'media-contents',
        depth: 0,
        limit: 8,
        overrideAccess: false,
        sort: '-publishedAt',
        where: matchingFields(query, ['title', 'description', 'speaker', 'host', 'series']),
      }),
    ])

    const results: GlobalSearchResult[] = [
      ...posts.docs.map((post) => ({
        date: post.publishedAt ?? post.createdAt,
        excerpt: post.excerpt ?? null,
        href: `/berita/${post.slug}`,
        id: `artikel-${post.id}`,
        title: post.title,
        type: 'Artikel' as const,
      })),
      ...dawuh.docs.map((record) => ({
        date: record.date ?? record.createdAt,
        excerpt: record.context || record.source || null,
        href: `/dawuh/${record.slug}`,
        id: `dawuh-${record.id}`,
        title: record.quote,
        type: 'Dawuh' as const,
      })),
      ...events.docs.map((event) => ({
        date: event.startDate,
        excerpt: event.description || [event.venue, event.city].filter(Boolean).join(', ') || null,
        href: `/agenda/${event.slug}`,
        id: `agenda-${event.id}`,
        title: event.title,
        type: 'Agenda' as const,
      })),
      ...media.docs.map((record) => ({
        date: record.publishedAt ?? record.createdAt,
        excerpt: record.description || record.speaker || record.host || null,
        href: `/media/${record.slug}`,
        id: `media-${record.id}`,
        title: record.title,
        type: 'Media' as const,
      })),
    ]

    results.sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0
      const bTime = b.date ? new Date(b.date).getTime() : 0
      return bTime - aTime
    })

    return { error: false, results: results.slice(0, 24) }
  } catch (error) {
    console.error('Unable to search site content', error)
    return { error: true, results: [] }
  }
}
