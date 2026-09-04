import { Clock3, Headphones, Play, Podcast, Video } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'

const audioItems = [
  { title: 'Menata Niat dalam Belajar dan Mengabdi', series: 'Dawuh Pilihan', duration: '08:42' },
  { title: 'Pesantren dan Etika Mengelola Perubahan', series: 'Khazanah Audio', duration: '14:18' },
  { title: 'Membaca Realitas dengan Jernih', series: 'Refleksi Pekanan', duration: '11:06' },
] as const

export function MediaSection() {
  return (
    <section aria-labelledby="media-title" className="bg-surface-container-lowest py-space-3xl">
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <SectionHeading
          eyebrow="Tonton & Dengarkan"
          title="Ruang Audiovisual"
          titleId="media-title"
          description="Kajian, dokumentasi kegiatan, dan rekaman audio untuk menemani proses belajar di mana saja."
          href="/media"
          linkLabel="Buka pusat media"
          icon={Video}
        />

        <div className="grid gap-space-xl lg:grid-cols-12">
          <article className="group relative flex min-h-[25rem] overflow-hidden rounded-lg bg-[#0b1c30] p-space-xl text-white lg:col-span-7 lg:p-space-2xl">
            <div className="absolute inset-0 opacity-35" aria-hidden="true">
              <div className="absolute -right-24 -top-24 size-80 rounded-full border-[60px] border-primary" />
              <div className="absolute -bottom-32 left-24 size-96 rounded-full border-[72px] border-secondary/50" />
            </div>
            <div className="relative flex w-full flex-col justify-between">
              <span className="inline-flex w-fit items-center gap-space-xs rounded-full bg-red-600 px-space-sm py-1 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em]">
                <Video className="size-3.5" aria-hidden="true" /> Video Pilihan
              </span>
              <div>
                <Link href="/video" className="mb-space-lg grid size-16 place-items-center rounded-full bg-white text-primary transition-transform motion-safe:group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5bd66] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b1c30]" aria-label="Putar video pilihan">
                  <Play className="ml-1 size-6 fill-current" aria-hidden="true" />
                </Link>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-[#f5bd66]">Halaqah Peradaban</span>
                <h3 className="mt-space-xs max-w-[18ch] font-headline-lg text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.12]">Menjaga Tradisi, Menjawab Tantangan Zaman</h3>
                <p className="mt-space-md inline-flex items-center gap-space-xs font-body-sm text-body-sm text-white/65">
                  <Clock3 className="size-4" aria-hidden="true" /> 24 menit · Dokumentasi kajian
                </p>
              </div>
            </div>
          </article>

          <div className="rounded-lg border border-border bg-cream-bg p-space-lg lg:col-span-5 lg:p-space-xl">
            <div className="mb-space-md flex items-center gap-space-sm">
              <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground"><Podcast className="size-5" aria-hidden="true" /></span>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Audio &amp; Podcast Terbaru</h3>
                <p className="font-body-sm text-body-sm text-text-body">Diputar hanya saat pengguna memilih</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {audioItems.map((item) => (
                <article key={item.title} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-space-md py-space-lg first:pt-space-md last:pb-0">
                  <Link href="/audio" aria-label={`Dengarkan ${item.title}`} className="grid size-10 place-items-center rounded-full border border-primary/20 bg-white text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                    <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                  </Link>
                  <div className="min-w-0">
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.08em] text-secondary">{item.series}</span>
                    <h4 className="mt-1 font-headline-sm text-[1.05rem] font-semibold leading-snug text-text-headline transition-colors group-hover:text-primary">{item.title}</h4>
                  </div>
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-text-body"><Headphones className="size-3.5" aria-hidden="true" />{item.duration}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
