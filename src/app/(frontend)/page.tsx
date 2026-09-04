import { CommunitySection } from '@/components/community/CommunitySection'
import { DawuhFeature } from '@/components/dawuh/DawuhFeature'
import { EditorialHero } from '@/components/editorial/EditorialHero'
import { LatestNewsSection } from '@/components/editorial/LatestNewsSection'
import { SafariDakwahSection } from '@/components/events/SafariDakwahSection'
import { KhazanahSection } from '@/components/khazanah/KhazanahSection'
import { MediaSection } from '@/components/media/MediaSection'
import { NewsletterSection } from '@/components/shared/NewsletterSection'
import { getHomepageContent } from '@/lib/homepage'

export default async function Page() {
  const content = await getHomepageContent()

  return (
    <div className="flex w-full flex-col">
      <EditorialHero leadStory={content.hero} supportingStories={content.trendingStories} />
      <LatestNewsSection stories={content.latestStories} />
      <DawuhFeature record={content.dawuh} />
      <SafariDakwahSection events={content.events} />
      <KhazanahSection collections={content.khazanah} />
      <MediaSection audioItems={content.mediaAudio} featured={content.mediaFeatured} />
      <CommunitySection records={content.community} />
      <NewsletterSection />
    </div>
  )
}
