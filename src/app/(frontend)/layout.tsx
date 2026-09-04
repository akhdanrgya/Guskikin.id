import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { MotionFooter, MotionPage, MotionProvider } from '@/components/motion/SiteMotion'
import { getLatestArticle } from '@/lib/articles'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const latestArticle = await getLatestArticle()

  return (
    <MotionProvider>
      <div className="flex flex-col min-h-screen">
        <SiteHeader
          initialNow={new Date().toISOString()}
          latestArticle={latestArticle ? { slug: latestArticle.slug, title: latestArticle.title } : null}
        />
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
