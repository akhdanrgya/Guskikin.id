import { Clock3, Newspaper } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'

const categories = ['Terbaru', 'PBNU', 'Tebuireng', 'Kebangsaan', 'Opini', 'Dakwah'] as const

const stories = [
  {
    category: 'Tebuireng',
    title: 'Pesantren sebagai Ruang Tumbuh Ilmu, Akhlak, dan Kemandirian Generasi Muda',
    excerpt:
      'Catatan redaksi mengenai peran pesantren dalam merawat tradisi sekaligus menjawab kebutuhan masyarakat yang terus berubah.',
    readingTime: '5 menit baca',
    href: '/berita',
  },
  {
    category: 'Kebangsaan',
    title: 'Merawat Dialog Keumatan di Tengah Perubahan Sosial yang Bergerak Cepat',
    excerpt: 'Ruang temu menjadi penting agar perbedaan dapat dikelola dengan adab dan kejernihan berpikir.',
    readingTime: '4 menit baca',
    href: '/berita',
  },
  {
    category: 'Pendidikan',
    title: 'Membaca Ulang Peran Santri dalam Ekosistem Pengetahuan Digital',
    excerpt: 'Literasi digital perlu tumbuh beriringan dengan ketelitian sumber dan tanggung jawab keilmuan.',
    readingTime: '6 menit baca',
    href: '/khazanah',
  },
  {
    category: 'Dakwah',
    title: 'Dakwah yang Meneduhkan Berangkat dari Keteladanan Sehari-hari',
    excerpt: 'Pesan yang baik memperoleh daya hidupnya dari sikap, konsistensi, dan kepekaan sosial.',
    readingTime: '3 menit baca',
    href: '/dawuh',
  },
] as const

export function LatestNewsSection() {
  const [featuredStory, ...compactStories] = stories

  return (
    <section aria-labelledby="latest-news-title" className="bg-surface-container-lowest py-space-3xl">
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <SectionHeading
          eyebrow="Warta & Perspektif"
          title="Berita Terbaru"
          titleId="latest-news-title"
          description="Kabar resmi, catatan kebangsaan, dan percakapan keilmuan yang disajikan dengan konteks yang jernih."
          href="/berita"
          linkLabel="Lihat semua berita"
          icon={Newspaper}
        />

        <div className="mb-space-lg flex gap-space-xs overflow-x-auto pb-space-xs" aria-label="Kategori berita">
          {categories.map((category, index) => (
            <span
              key={category}
              className={`shrink-0 rounded-full border px-space-md py-space-xs font-label-sm text-label-sm font-bold ${
                index === 0
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-cream-bg text-text-body'
              }`}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="grid gap-space-xl lg:grid-cols-12">
          <article className="relative overflow-hidden rounded-lg bg-primary p-space-xl text-primary-foreground lg:col-span-5 lg:p-space-2xl">
            <span className="absolute -right-2 -top-10 select-none font-headline-lg text-[10rem] font-bold leading-none text-white/5" aria-hidden="true">
              01
            </span>
            <div className="relative flex min-h-80 flex-col justify-between">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-space-sm py-1 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-[#f5bd66]">
                  {featuredStory.category}
                </span>
                <Link href={featuredStory.href} className="mt-space-lg block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary">
                  <h3 className="max-w-[18ch] font-headline-lg text-[clamp(1.75rem,3.3vw,2.7rem)] font-bold leading-[1.12] tracking-[-0.02em] transition-colors hover:text-[#f5bd66]">
                    {featuredStory.title}
                  </h3>
                </Link>
                <p className="mt-space-md max-w-[52ch] font-body-md text-body-md leading-7 text-white/70">
                  {featuredStory.excerpt}
                </p>
              </div>
              <span className="mt-space-xl inline-flex items-center gap-space-xs font-label-sm text-label-sm text-white/65">
                <Clock3 className="size-4" aria-hidden="true" />
                {featuredStory.readingTime}
              </span>
            </div>
          </article>

          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-cream-bg lg:col-span-7">
            {compactStories.map((story, index) => (
              <article key={story.title} className="group grid gap-space-md p-space-lg sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:p-space-xl">
                <span className="font-headline-md text-headline-md font-bold text-secondary/35 group-hover:text-secondary" aria-hidden="true">
                  {String(index + 2).padStart(2, '0')}
                </span>
                <div>
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-primary">
                    {story.category}
                  </span>
                  <Link href={story.href} className="mt-1 block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                    <h3 className="font-headline-sm text-[1.25rem] font-semibold leading-snug text-text-headline transition-colors group-hover:text-primary sm:text-[1.45rem]">
                      {story.title}
                    </h3>
                  </Link>
                  <p className="mt-space-xs font-body-sm text-body-sm leading-5 text-text-body">{story.excerpt}</p>
                </div>
                <span className="inline-flex items-center gap-1 self-start font-label-sm text-label-sm text-text-body sm:justify-self-end">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {story.readingTime}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
