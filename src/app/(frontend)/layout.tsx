import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { MotionFooter, MotionPage, MotionProvider } from '@/components/motion/SiteMotion'
import { getLatestArticle } from '@/lib/articles'
import { Suspense } from 'react'

async function HeaderWithLatestArticle({ initialNow }: { initialNow: string }) {
  const latestArticle = await getLatestArticle()

  return (
    <SiteHeader
      initialNow={initialNow}
      latestArticle={latestArticle ? { slug: latestArticle.slug, title: latestArticle.title } : null}
    />
  )
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialNow = new Date().toISOString()

  return (
    <MotionProvider>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<SiteHeader initialNow={initialNow} isLatestLoading latestArticle={null} />}>
          <HeaderWithLatestArticle initialNow={initialNow} />
        </Suspense>
        <main className="flex-1 w-full pt-[7.5rem] bg-cream-bg">
          <MotionPage>{children}</MotionPage>
        </main>
        <MotionFooter>
          <SiteFooter />
        </MotionFooter>
      </div>
    </MotionProvider>
  )
}
