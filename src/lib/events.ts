import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Event, Media } from '@/payload-types'

export const EVENT_PAGE_SIZE = 6

export type EventType = 'all' | NonNullable<Event['eventType']>

export type EventRegion = { city: string; count: number; percentage: number }

export type EventArchive = {
  completedEvents: Event[]
  error: boolean
  featured: Event | null
  page: number
  records: Event[]
  regions: EventRegion[]
  statusCounts: Record<NonNullable<Event['status']>, number>
  typeCounts: Record<Exclude<EventType, 'all'>, number>
  totalDocs: number
  totalPages: number
}

export const isEventMedia = (value: Event['poster']): value is Media =>
  Boolean(value && typeof value === 'object' && 'alt' in value)

export const getEventImageURL = (poster: Event['poster']) => {
  if (!isEventMedia(poster)) return null
  return poster.sizes?.card?.url || poster.sizes?.feature?.url || poster.url || null
}

export const formatEventDate = (date: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date))

export const formatEventDay = (date: string) =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date))

export const formatEventTime = (startDate: string, endDate?: string | null) => {
  const formatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
  const start = formatter.format(new Date(startDate)).replace('.', ':')
  if (!endDate) return `${start} WIB`
  const end = formatter.format(new Date(endDate)).replace('.', ':')
  return `${start}–${end} WIB`
}

export const getEventStatusLabel = (status?: Event['status']) => ({
  completed: 'Selesai',
  live: 'Sedang Live',
  today: 'Hari Ini',
  upcoming: 'Mendatang',
}[status || 'upcoming'])

export const getEventTypeLabel = (type?: Event['eventType']) => ({
  halaqah: 'Halaqah & Akademik',
  lainnya: 'Agenda Lainnya',
  'pengajian-rutin': 'Pengajian Rutin',
  silaturahmi: 'Silaturahmi Pesantren',
  'tabligh-akbar': 'Tabligh Akbar',
}[type || 'lainnya'])

export const getMapURL = (event: Event) => {
  if (event.mapUrl) return event.mapUrl
  const destination = [event.venue, event.address, event.city].filter(Boolean).join(', ')
  return destination
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`
    : null
}

export const getCalendarURL = (event: Event) => {
  const compact = (date: string) => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const end = event.endDate || new Date(new Date(event.startDate).getTime() + 60 * 60 * 1000).toISOString()
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates: `${compact(event.startDate)}/${compact(end)}`,
    details: event.description || '',
    location: [event.venue, event.address, event.city].filter(Boolean).join(', '),
    text: event.title,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export const getEventArchive = async ({
  city,
  eventType = 'all',
  page = 1,
  query,
}: {
  city?: string
  eventType?: EventType
  page?: number
  query?: string
}): Promise<EventArchive> => {
  try {
    const payload = await getPayload({ config })
    const statusValues = ['upcoming', 'today', 'live', 'completed'] as const
    const typeValues = ['halaqah', 'pengajian-rutin', 'tabligh-akbar', 'silaturahmi', 'lainnya'] as const
    const [allEvents, ...counts] = await Promise.all([
      payload.find({
        collection: 'events',
        depth: 0,
        limit: 500,
        overrideAccess: false,
        pagination: false,
        sort: 'startDate',
      }),
      ...statusValues.map((value) => payload.count({
        collection: 'events',
        overrideAccess: false,
        where: { status: { equals: value } },
      })),
      ...typeValues.map((value) => payload.count({
        collection: 'events',
        overrideAccess: false,
        where: { eventType: { equals: value } },
      })),
    ])

    const statusCounts = Object.fromEntries(
      statusValues.map((value, index) => [value, counts[index].totalDocs]),
    ) as EventArchive['statusCounts']
    const typeCounts = Object.fromEntries(
      typeValues.map((value, index) => [value, counts[statusValues.length + index].totalDocs]),
    ) as EventArchive['typeCounts']

    const regionCounts = new Map<string, number>()
    for (const event of allEvents.docs) {
      if (!event.city) continue
      regionCounts.set(event.city, (regionCounts.get(event.city) || 0) + 1)
    }
    const regions = Array.from(regionCounts, ([regionCity, count]) => ({
      city: regionCity,
      count,
      percentage: allEvents.totalDocs ? Math.round((count / allEvents.totalDocs) * 100) : 0,
    })).sort((a, b) => b.count - a.count)

    const filters: Where[] = []
    if (query?.trim()) {
      filters.push({
        or: [
          { title: { contains: query.trim() } },
          { description: { contains: query.trim() } },
          { venue: { contains: query.trim() } },
          { city: { contains: query.trim() } },
        ],
      })
    }
    if (city && regions.some((region) => region.city === city)) filters.push({ city: { equals: city } })
    if (eventType !== 'all') filters.push({ eventType: { equals: eventType } })

    const normalizedPage = Math.max(1, page)
    const hasActiveFilter = Boolean(query?.trim() || city || eventType !== 'all')
    let featured: Event | null = null
    if (normalizedPage === 1 && !hasActiveFilter) {
      let featuredResult = await payload.find({
        collection: 'events',
        depth: 1,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        sort: 'startDate',
        where: {
          and: [
            { status: { in: ['live', 'today', 'upcoming'] } },
            { isFeatured: { equals: true } },
          ],
        },
      })
      if (!featuredResult.docs.length) {
        featuredResult = await payload.find({
          collection: 'events', depth: 1, limit: 1, overrideAccess: false,
          pagination: false, sort: 'startDate',
          where: { status: { in: ['live', 'today', 'upcoming'] } },
        })
      }
      featured = featuredResult.docs[0] ?? null
      if (featured) filters.push({ id: { not_equals: featured.id } })
    }

    const [recordsResult, completedResult] = await Promise.all([
      payload.find({
        collection: 'events',
        depth: 1,
        limit: EVENT_PAGE_SIZE,
        overrideAccess: false,
        page: normalizedPage,
        sort: '-startDate',
        where: filters.length ? { and: filters } : undefined,
      }),
      payload.find({
        collection: 'events',
        depth: 1,
        limit: 3,
        overrideAccess: false,
        pagination: false,
        sort: '-startDate',
        where: { status: { equals: 'completed' } },
      }),
    ])

    return {
      completedEvents: completedResult.docs,
      error: false,
      featured,
      page: recordsResult.page ?? normalizedPage,
      records: recordsResult.docs,
      regions,
      statusCounts,
      typeCounts,
      totalDocs: recordsResult.totalDocs,
      totalPages: recordsResult.totalPages,
    }
  } catch (error) {
    console.error('Unable to load event archive', error)
    return {
      completedEvents: [], error: true, featured: null, page: 1, records: [], regions: [],
      statusCounts: { completed: 0, live: 0, today: 0, upcoming: 0 },
      typeCounts: { halaqah: 0, lainnya: 0, 'pengajian-rutin': 0, silaturahmi: 0, 'tabligh-akbar': 0 },
      totalDocs: 0, totalPages: 0,
    }
  }
}

export const getEventBySlug = async (slug: string) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: { slug: { equals: slug } },
    })
    return result.docs[0] ?? null
  } catch (error) {
    console.error(`Unable to load event ${slug}`, error)
    return null
  }
}
