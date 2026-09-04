import {
  ArrowRight,
  BookOpenText,
  Clock3,
  Landmark,
  Network,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const leadStory = {
  category: 'Khazanah Kebangsaan',
  title:
    'Gus Kikin: Meneguhkan Nilai Moderasi Beragama dan Kemandirian Ekonomi Pesantren Abad Kedua NU',
  excerpt:
    'Dalam lawatan halaqah peradaban, Pengasuh Pesantren Tebuireng menggarisbawahi pentingnya gerakan santri yang berakar pada tradisi keilmuan dan tanggap terhadap perubahan zaman.',
  href: '/berita',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKU-42Q0m53oqi9tFZGo_HqVDFyGvsSzc_v00Kf1TtY3WHwXcqrruu2hMB12d_fcvOeLjkGu1QleBO01KlF-Ha7w2VZydW5I_fyI2BLZpyuXYeL7ofrDSQjU9tznqX0AH4eKcUetjjZ7G7qmHipU81p-epSptFrcwbaZSwhRMa9UJ_1HEqsD5W52aj6EmGLs2gwphttmO38xSLpZBNj4uzv2d7mYzJk_Xx17Vr9LW14NKQAm9wJFt',
  imageAlt: 'Gus Kikin menyampaikan kajian di hadapan para santri',
  author: 'Tim Redaksi Khazanah Tebuireng',
  publishedAt: '2024-10-24',
  publishedLabel: '22 Rabiul Awal 1446 H',
  readingTime: '5 menit baca',
}

const supportingStories = [
  {
    category: 'Tebuireng Heritage',
    readingTime: '4 menit baca',
    title: 'Pesan Mendalam Pengasuh Tebuireng dalam Menjaga Sanad Keilmuan Para Masyayikh',
    excerpt: 'Keotentikan sanad adalah benteng nurani santri agar tidak tercerabut dari adab ulama terdahulu.',
    href: '/khazanah',
    Icon: BookOpenText,
  },
  {
    category: 'Opini & Wacana',
    readingTime: '6 menit baca',
    title: 'Optimalisasi Potensi Santri di Era Transformasi Digital Tanpa Kehilangan Jati Diri',
    excerpt: 'Transformasi digital adalah instrumen syiar, bukan tujuan yang menggeser akar keilmuan pesantren.',
    href: '/berita',
    Icon: Network,
  },
  {
    category: 'Refleksi Moral',
    readingTime: '3 menit baca',
    title: 'Menjaga Kejujuran dan Keteladanan di Tengah Perubahan Zaman',
    excerpt: 'Refleksi kepemimpinan berbasis akhlak yang tetap relevan untuk membaca tantangan hari ini.',
    href: '/dawuh',
    Icon: Landmark,
  },
] as const

export function EditorialHero() {
  return (
    <section
      aria-labelledby="editorial-hero-title"
      className="border-b border-border/70 bg-cream-bg"
    >
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile pb-space-3xl pt-space-md sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="mb-space-md flex min-h-8 flex-wrap items-center justify-between gap-space-sm border-y border-border/70 py-space-xs">
          <div className="flex min-w-0 items-center gap-space-sm">
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface-container-low px-space-sm py-1 font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-primary">
              <span className="size-1.5 rounded-full bg-secondary" aria-hidden="true" />
              Pilihan Redaksi
            </span>
            <span className="hidden truncate font-body-sm text-body-sm text-text-body sm:inline">
              Kajian utama khazanah pemikiran &amp; kebangsaan
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Kanal Resmi Tebuireng
          </span>
        </div>

        <div className="grid items-start gap-space-xl lg:grid-cols-12">
          <article className="overflow-hidden rounded-lg border border-border/65 bg-surface-container-lowest shadow-[0_12px_35px_rgba(23,74,55,0.06)] lg:col-span-7">
            <Link
              href={leadStory.href}
              aria-label={`Baca: ${leadStory.title}`}
              className="group/image relative block aspect-video overflow-hidden bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              <Image
                className="object-cover transition-transform duration-500 motion-safe:group-hover/image:scale-[1.025]"
                src={leadStory.image}
                alt={leadStory.imageAlt}
                fill
                sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(100vw - 3rem), 720px"
                preload
              />

              <span className="absolute left-space-md top-space-md rounded-md bg-secondary px-space-sm py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-[0.08em] text-secondary-foreground shadow-sm">
                {leadStory.category}
              </span>

              <span className="absolute bottom-space-sm right-space-sm inline-flex items-center gap-1.5 rounded-md bg-white/95 px-space-sm py-1.5 font-label-sm text-label-sm font-semibold text-primary shadow-sm">
                <Clock3 className="size-3.5" aria-hidden="true" />
                {leadStory.readingTime}
              </span>
            </Link>

            <div className="p-space-lg sm:p-space-xl">
              <Link
                href={leadStory.href}
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                <h1
                  id="editorial-hero-title"
                  className="max-w-[19ch] font-headline-lg text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-text-headline transition-colors hover:text-primary"
                >
                  {leadStory.title}
                </h1>
              </Link>

              <p className="mt-space-md max-w-[68ch] font-body-md text-body-md leading-7 text-text-body">
                {leadStory.excerpt}
              </p>

              <div className="mt-space-lg flex flex-col gap-space-sm rounded-md bg-surface-container-low px-space-md py-space-sm font-label-sm text-label-sm text-text-body sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-space-xs font-semibold text-primary">
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    TK
                  </span>
                  {leadStory.author}
                </span>
                <time dateTime={leadStory.publishedAt}>{leadStory.publishedLabel}</time>
              </div>
            </div>
          </article>

          <aside aria-labelledby="supporting-stories-title" className="lg:col-span-5">
            <div className="mb-space-sm flex items-end justify-between gap-space-md">
              <div>
                <span className="mb-1 block font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">
                  Sorotan
                </span>
                <h2
                  id="supporting-stories-title"
                  className="font-headline-sm text-headline-sm font-bold text-primary"
                >
                  Topik Utama Pilihan
                </h2>
              </div>

              <Link
                href="/berita"
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-sm font-label-sm text-label-sm font-bold text-secondary transition-colors hover:text-accent-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                Arsip lengkap
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-border/65 bg-surface-container-lowest shadow-[0_12px_35px_rgba(23,74,55,0.04)]">
              {supportingStories.map(({ Icon, ...story }, index) => (
                <article
                  key={story.title}
                  className="group grid grid-cols-[2rem_minmax(0,1fr)_3.75rem] gap-space-sm border-b border-border/65 p-space-md last:border-b-0 sm:grid-cols-[2.25rem_minmax(0,1fr)_4.5rem] sm:gap-space-md sm:p-space-lg"
                >
                  <span
                    className="pt-0.5 font-headline-md text-headline-md font-bold text-secondary/35 transition-colors group-hover:text-secondary"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0">
                    <div className="mb-space-xs flex flex-wrap items-center gap-x-space-xs gap-y-1 font-label-sm text-label-sm">
                      <span className="rounded-full bg-surface-container px-space-xs py-0.5 font-bold text-primary">
                        {story.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-text-body">
                        <Clock3 className="size-3" aria-hidden="true" />
                        {story.readingTime}
                      </span>
                    </div>

                    <Link
                      href={story.href}
                      className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                    >
                      <h3 className="font-headline-sm text-[1.05rem] font-semibold leading-snug text-text-headline transition-colors group-hover:text-primary sm:text-[1.12rem]">
                        {story.title}
                      </h3>
                    </Link>

                    <p className="mt-space-xs hidden font-body-sm text-body-sm leading-5 text-text-body sm:line-clamp-2">
                      {story.excerpt}
                    </p>
                  </div>

                  <div className="grid aspect-square place-items-center self-start rounded-md border border-border/70 bg-surface-container-low text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
