import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Media, MediaContent, Tag } from '@/payload-types'

export const MEDIA_PAGE_SIZE = 9
export type MediaType = 'all' | MediaContent['type']

export type MediaArchive = {
  audio: MediaContent[]
  error: boolean
  featured: MediaContent | null
  galleries: MediaContent[]
  page: number
  records: MediaContent[]
  tags: Tag[]
  totalDocs: number
  totalPages: number
  typeCounts: Record<MediaContent['type'], number>
  videos: MediaContent[]
}

export const isMediaAsset = (value: MediaContent['thumbnail'] | MediaContent['downloadableFile'] | NonNullable<MediaContent['galleryItems']>[number]['image']): value is Media =>
  Boolean(value && typeof value === 'object' && 'alt' in value)

export const getMediaAssetURL = (value: MediaContent['thumbnail'], size: 'card' | 'feature' = 'card') => {
  if (!isMediaAsset(value)) return null
  return value.sizes?.[size]?.url || value.url || null
}

export const getMediaTypeLabel = (type: MediaContent['type']) => ({
  audio: 'Kalam Audio',
  podcast: 'Podcast',
  'photo-gallery': 'Galeri Foto',
  video: 'Video',
}[type])

export const getMediaPrimaryURL = (record: MediaContent) => {
  if (record.externalUrl) return record.externalUrl
  if (record.videoUrl) return record.videoUrl
  if (record.audioUrl) return record.audioUrl
  if (record.youtubeId) return `https://www.youtube.com/watch?v=${encodeURIComponent(record.youtubeId)}`
  return null
}

export const formatMediaDate = (date?: string | null) => {
  if (!date) return null
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta',
  }).format(new Date(date))
}

export const getMediaArchive = async ({
  mediaType = 'all',
  page = 1,
  query,
  sort = 'terbaru',
}: {
  mediaType?: MediaType
  page?: number
  query?: string
  sort?: 'terbaru' | 'terlama'
}): Promise<MediaArchive> => {
  try {
    const payload = await getPayload({ config })
    const types = ['video', 'podcast', 'photo-gallery', 'audio'] as const
    const [tagsResult, ...countResults] = await Promise.all([
      payload.find({ collection: 'tags', limit: 16, overrideAccess: false, pagination: false, sort: 'title' }),
      ...types.map((type) => payload.count({ collection: 'media-contents', overrideAccess: false, where: { type: { equals: type } } })),
    ])
    const typeCounts = Object.fromEntries(types.map((type, index) => [type, countResults[index].totalDocs])) as MediaArchive['typeCounts']
    const filters: Where[] = []
    if (query?.trim()) {
      filters.push({ or: [
        { title: { contains: query.trim() } },
        { description: { contains: query.trim() } },
        { speaker: { contains: query.trim() } },
        { series: { contains: query.trim() } },
      ] })
    }
    if (mediaType !== 'all') filters.push({ type: { equals: mediaType } })

    const normalizedPage = Math.max(1, page)
    const activeFilter = Boolean(query?.trim() || mediaType !== 'all')
    let featured: MediaContent | null = null
    if (normalizedPage === 1 && !activeFilter) {
      let featuredResult = await payload.find({
        collection: 'media-contents', depth: 2, limit: 1, overrideAccess: false,
        pagination: false, sort: '-publishedAt', where: { isFeatured: { equals: true } },
      })
      if (!featuredResult.docs.length) {
        featuredResult = await payload.find({
          collection: 'media-contents', depth: 2, limit: 1, overrideAccess: false,
          pagination: false, sort: '-publishedAt', where: { type: { in: ['video', 'podcast'] } },
        })
      }
      featured = featuredResult.docs[0] ?? null
      if (featured) filters.push({ id: { not_equals: featured.id } })
    }

    const [recordsResult, videosResult, galleriesResult, audioResult] = await Promise.all([
      payload.find({
        collection: 'media-contents', depth: 2, limit: MEDIA_PAGE_SIZE, overrideAccess: false,
        page: normalizedPage, sort: sort === 'terlama' ? 'publishedAt' : '-publishedAt',
        where: filters.length ? { and: filters } : undefined,
      }),
      payload.find({
        collection: 'media-contents', depth: 2, limit: 3, overrideAccess: false,
        pagination: false, sort: '-publishedAt', where: { type: { in: ['video', 'podcast'] } },
      }),
      payload.find({
        collection: 'media-contents', depth: 2, limit: 5, overrideAccess: false,
        pagination: false, sort: '-publishedAt', where: { type: { equals: 'photo-gallery' } },
      }),
      payload.find({
        collection: 'media-contents', depth: 2, limit: 3, overrideAccess: false,
        pagination: false, sort: '-publishedAt', where: { type: { equals: 'audio' } },
      }),
    ])

    return {
      audio: audioResult.docs, error: false, featured, galleries: galleriesResult.docs,
      page: recordsResult.page ?? normalizedPage, records: recordsResult.docs, tags: tagsResult.docs,
      totalDocs: recordsResult.totalDocs, totalPages: recordsResult.totalPages,
      typeCounts, videos: videosResult.docs.filter((record) => record.id !== featured?.id),
    }
  } catch (error) {
    console.error('Unable to load media archive', error)
    return {
      audio: [], error: true, featured: null, galleries: [], page: 1, records: [], tags: [],
      totalDocs: 0, totalPages: 0,
      typeCounts: { audio: 0, podcast: 0, 'photo-gallery': 0, video: 0 }, videos: [],
    }
  }
}

export const getMediaBySlug = async (slug: string) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'media-contents', depth: 2, limit: 1, overrideAccess: false,
      pagination: false, where: { slug: { equals: slug } },
    })
    return result.docs[0] ?? null
  } catch (error) {
    console.error(`Unable to load media ${slug}`, error)
    return null
  }
}
