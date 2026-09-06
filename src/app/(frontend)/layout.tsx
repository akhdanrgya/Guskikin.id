import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { MotionFooter, MotionPage, MotionProvider } from '@/components/motion/SiteMotion'
import { getLatestNews } from '@/lib/news'
import { Suspense } from 'react'

async function HeaderWithLatestNews({ initialNow }: { initialNow: string }) {
  const latestNews = await getLatestNews()

  return (
    <SiteHeader
      initialNow={initialNow}
      latestNews={latestNews ? { slug: latestNews.slug, title: latestNews.title } : null}
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
        <Suspense fallback={<SiteHeader initialNow={initialNow} isLatestLoading latestNews={null} />}>
          <HeaderWithLatestNews initialNow={initialNow} />
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
