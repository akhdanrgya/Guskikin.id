import config from '@payload-config'
import { getPayload } from 'payload'

import type {
  CommunityPost,
  Dawuh,
  Event,
  Homepage,
  Khazanah,
  MediaContent,
  Post,
} from '@/payload-types'

export type HomepageContent = {
  community: CommunityPost[]
  dawuh: Dawuh | null
  error: boolean
  events: Event[]
  hero: Post | null
  khazanah: Khazanah[]
  latestStories: Post[]
  mediaAudio: MediaContent[]
  mediaFeatured: MediaContent | null
  trendingStories: Post[]
}

const isPopulated = <T extends { id: number }>(value: number | T | null | undefined): value is T =>
  Boolean(value && typeof value === 'object' && 'id' in value)

const populatedMany = <T extends { id: number }>(values?: (number | T)[] | null) =>
  values?.filter(isPopulated<T>) ?? []

const emptyHomepage: HomepageContent = {
  community: [],
  dawuh: null,
  error: true,
  events: [],
  hero: null,
  khazanah: [],
  latestStories: [],
  mediaAudio: [],
  mediaFeatured: null,
  trendingStories: [],
}

export const getHomepageContent = async (): Promise<HomepageContent> => {
  try {
    const payload = await getPayload({ config })
    const [homepage, posts, dawuh, events, khazanah, media, community] = await Promise.all([
      payload.findGlobal({
        slug: 'homepage',
        depth: 2,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'posts',
        depth: 2,
        limit: 10,
        overrideAccess: false,
        pagination: false,
        sort: '-publishedAt',
        where: { _status: { equals: 'published' } },
      }),
      payload.find({
        collection: 'dawuh',
        depth: 2,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        sort: '-date',
      }),
      payload.find({
        collection: 'events',
        depth: 1,
        limit: 3,
        overrideAccess: false,
        pagination: false,
        sort: 'startDate',
        where: { status: { in: ['live', 'today', 'upcoming'] } },
      }),
      payload.find({
        collection: 'khazanah',
        depth: 1,
        limit: 3,
        overrideAccess: false,
        pagination: false,
        sort: '-year',
      }),
      payload.find({
        collection: 'media-contents',
        depth: 2,
        limit: 10,
        overrideAccess: false,
        pagination: false,
        sort: '-publishedAt',
      }),
      payload.find({
        collection: 'community-posts',
        depth: 1,
        limit: 4,
        overrideAccess: false,
        pagination: false,
        sort: '-createdAt',
      }),
    ])

    const homepageData = homepage as Partial<Homepage>
    const hero = isPopulated<Post>(homepageData.heroStory)
      ? homepageData.heroStory
      : posts.docs[0] ?? null
    const selectedTrending = populatedMany<Post>(homepageData.trendingStories)
    const trendingStories = (selectedTrending.length
      ? selectedTrending
      : posts.docs.filter((post) => post.id !== hero?.id)
    ).slice(0, 3)
    const selectedDawuh = populatedMany<Dawuh>(homepageData.featuredDawuh)
    const selectedEvents = populatedMany<Event>(homepageData.featuredEvents)
    const selectedKhazanah = populatedMany<Khazanah>(homepageData.featuredKhazanah)
    const mediaFeatured =
      media.docs.find((record) => record.isFeatured) ??
      media.docs.find((record) => record.type === 'video' || record.type === 'podcast') ??
      media.docs[0] ??
      null

  return {
    community: community.docs,
    dawuh: selectedDawuh[0] ?? dawuh.docs[0] ?? null,
    error: false,
      events: (selectedEvents.length ? selectedEvents : events.docs).slice(0, 3),
      hero,
      khazanah: (selectedKhazanah.length ? selectedKhazanah : khazanah.docs).slice(0, 3),
      latestStories: posts.docs.filter((post) => post.id !== hero?.id).slice(0, 4),
      mediaAudio: media.docs
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
    console.error('Unable to load homepage content', error)
    return emptyHomepage
  }
}
