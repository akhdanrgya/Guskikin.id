import { CommunitySection } from '@/components/community/CommunitySection'
import { DawuhFeature } from '@/components/dawuh/DawuhFeature'
import { EditorialHero } from '@/components/editorial/EditorialHero'
import { LatestNewsSection } from '@/components/editorial/LatestNewsSection'
import { SafariDakwahSection } from '@/components/events/SafariDakwahSection'
import { KhazanahSection } from '@/components/khazanah/KhazanahSection'
import { MediaSection } from '@/components/media/MediaSection'
import { NewsletterSection } from '@/components/shared/NewsletterSection'

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <EditorialHero />
      <LatestNewsSection />
      <DawuhFeature />
      <SafariDakwahSection />
      <KhazanahSection />
      <MediaSection />
      <CommunitySection />
      <NewsletterSection />
    </div>
  )
}
