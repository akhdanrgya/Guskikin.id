import config from '@payload-config'
import { getPayload } from 'payload'

import type {
  CommunityPost,
  Dawuh,
  Event,
  Homepage,
  Khazanah,
  MediaContent,
  News,
  Post,
} from '@/payload-types'

export type HomepageContent = {
  community: CommunityPost[]
  dawuh: Dawuh | null
  events: Event[]
  hero: Post | null
  khazanah: Khazanah[]
  latestStories: News[]
  mediaAudio: MediaContent[]
  mediaFeatured: MediaContent | null
  trendingStories: Post[]
}

const emptyHomepage: HomepageContent = {
  community: [],
  dawuh: null,
  events: [],
  hero: null,
  khazanah: [],
  latestStories: [],
  mediaAudio: [],
  mediaFeatured: null,
  trendingStories: [],
}

const published = {
  _status: {
    equals: 'published' as const,
  },
}

const isPopulated = <T extends { id: number }>(
  value: number | T | null | undefined,
): value is T => Boolean(value && typeof value === 'object' && 'id' in value)

const populatedMany = <T extends { id: number }>(values?: (number | T)[] | null) =>
  values?.filter(isPopulated<T>) ?? []

const safeDocs = async <T>(
  label: string,
  query: () => Promise<{ docs: T[] }>,
): Promise<T[]> => {
  try {
    return (await query()).docs
  } catch (error) {
    console.error(`Unable to load homepage ${label}`, error)
    return []
  }
}

const safeHomepageGlobal = async (
  query: () => Promise<Homepage>,
): Promise<Partial<Homepage>> => {
  try {
    return await query()
  } catch (error) {
    console.error('Unable to load homepage selections', error)
    return {}
  }
}

export const getHomepageContent = async (): Promise<HomepageContent> => {
  try {
    const payload = await getPayload({ config })
    const [homepageData, posts, news, dawuh, events, khazanah, media, community] =
      await Promise.all([
        safeHomepageGlobal(() =>
          payload.findGlobal({
            slug: 'homepage',
            depth: 2,
            overrideAccess: false,
          }),
        ),
        safeDocs<Post>('articles', () =>
          payload.find({
            collection: 'posts',
            depth: 2,
            limit: 10,
            overrideAccess: false,
            pagination: false,
            sort: '-publishedAt',
            where: published,
          }),
        ),
        safeDocs<News>('news', () =>
          payload.find({
            collection: 'news',
            depth: 2,
            limit: 4,
            overrideAccess: false,
            pagination: false,
            sort: '-publishedAt',
            where: published,
          }),
        ),
        safeDocs<Dawuh>('dawuh', () =>
          payload.find({
            collection: 'dawuh',
            depth: 2,
            limit: 1,
            overrideAccess: false,
            pagination: false,
            sort: '-date',
          }),
        ),
        safeDocs<Event>('events', () =>
          payload.find({
            collection: 'events',
            depth: 1,
            limit: 3,
            overrideAccess: false,
            pagination: false,
            sort: 'startDate',
            where: {
              status: {
                in: ['live', 'today', 'upcoming'],
              },
            },
          }),
        ),
        safeDocs<Khazanah>('khazanah', () =>
          payload.find({
            collection: 'khazanah',
            depth: 1,
            limit: 3,
            overrideAccess: false,
            pagination: false,
            sort: '-year',
          }),
        ),
        safeDocs<MediaContent>('media', () =>
          payload.find({
            collection: 'media-contents',
            depth: 2,
            limit: 10,
            overrideAccess: false,
            pagination: false,
            sort: '-publishedAt',
          }),
        ),
        safeDocs<CommunityPost>('community', () =>
          payload.find({
            collection: 'community-posts',
            depth: 1,
            limit: 4,
            overrideAccess: false,
            pagination: false,
            sort: '-createdAt',
          }),
        ),
      ])

    const selectedHero = isPopulated<Post>(homepageData.heroStory)
      ? homepageData.heroStory
      : null
    const hero = selectedHero?._status === 'published' ? selectedHero : posts[0] ?? null
    const selectedTrending = populatedMany<Post>(homepageData.trendingStories).filter(
      (post) => post._status === 'published',
    )
    const trendingStories = (
      selectedTrending.length
        ? selectedTrending
        : posts.filter((post) => post.id !== hero?.id)
    ).slice(0, 3)
    const selectedNews = populatedMany<News>(homepageData.featuredNews).filter(
      (record) => record._status === 'published',
    )
    const selectedDawuh = populatedMany<Dawuh>(homepageData.featuredDawuh)
    const selectedEvents = populatedMany<Event>(homepageData.featuredEvents)
    const selectedKhazanah = populatedMany<Khazanah>(homepageData.featuredKhazanah)
    const mediaFeatured =
      media.find((record) => record.isFeatured) ??
      media.find((record) => record.type === 'video' || record.type === 'podcast') ??
      media[0] ??
      null

    return {
      community,
      dawuh: selectedDawuh[0] ?? dawuh[0] ?? null,
      events: (selectedEvents.length ? selectedEvents : events).slice(0, 3),
      hero,
      khazanah: (selectedKhazanah.length ? selectedKhazanah : khazanah).slice(0, 3),
      latestStories: (selectedNews.length ? selectedNews : news).slice(0, 4),
      mediaAudio: media
        .filter(
          (record) =>
            record.id !== mediaFeatured?.id &&
            (record.type === 'audio' || record.type === 'podcast'),
        )
        .slice(0, 3),
      mediaFeatured,
      trendingStories,
    }
  } catch (error) {
    console.error('Unable to initialize homepage content', error)
    return emptyHomepage
  }
}
