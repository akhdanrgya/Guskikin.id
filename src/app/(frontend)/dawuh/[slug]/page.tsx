import { ArrowLeft, BookOpenText, CalendarDays, MapPin, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { QuoteActions } from '@/components/dawuh/QuoteActions'
import {
  formatDawuhDate,
  getDawuhBySlug,
  getDawuhImageURL,
  isDawuhEvent,
  isDawuhMedia,
  isDawuhTopic,
} from '@/lib/dawuh'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const record = await getDawuhBySlug(slug)
  if (!record) return { title: 'Dawuh tidak ditemukan | guskikin.id' }

  return {
    title: `${record.context || 'Mutiara Dawuh'} | guskikin.id`,
    description: record.quote,
  }
}

export default async function DawuhDetailPage({ params }: PageProps) {
  const { slug } = await params
  const record = await getDawuhBySlug(slug)
  if (!record) notFound()

  const topic = isDawuhTopic(record.topic) ? record.topic : null
  const event = isDawuhEvent(record.event) ? record.event : null
  const media = isDawuhMedia(record.portrait) ? record.portrait : null
  const imageURL = getDawuhImageURL(record.portrait)
  const date = formatDawuhDate(record.date)

  return (
    <article className="bg-cream-bg">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
          <nav className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-text-body" aria-label="Breadcrumb">
            <Link className="hover:text-primary" href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link className="hover:text-primary" href="/dawuh">Dawuh &amp; Khazanah</Link>
            {topic ? <><span aria-hidden="true">/</span><span className="font-bold text-primary">{topic.title}</span></> : null}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_rgba(15,81,50,0.07)] before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-secondary">
          {imageURL ? (
            <div className="relative aspect-[16/7] overflow-hidden bg-surface-container-low">
              <Image alt={media?.alt || 'Dokumentasi kegiatan pengajian'} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 960px" src={imageURL} />
            </div>
          ) : null}
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-primary"><BookOpenText aria-hidden="true" className="size-4 text-secondary" /> {topic?.title || 'Mutiara Hikmah'}</span>
              {date ? <span className="inline-flex items-center gap-2 font-label-sm text-label-sm font-semibold text-secondary"><CalendarDays aria-hidden="true" className="size-4" /> {date}</span> : null}
            </div>
            <h1 className="mt-6 max-w-3xl font-editorial text-headline-xl-mobile font-bold leading-[1.08] text-primary sm:text-headline-xl">{record.context || 'Catatan Dawuh & Mutiara Hikmah'}</h1>
            <span aria-hidden="true" className="mt-8 block font-editorial text-8xl leading-none text-secondary/20">“</span>
            <blockquote className="-mt-10 max-w-4xl pl-6 font-editorial text-[clamp(1.8rem,3.6vw,3rem)] font-semibold italic leading-[1.45] text-primary">{record.quote}</blockquote>

            <div className="mt-10 grid gap-6 border-t border-border pt-7 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-start">
              <div>
                <p className="flex items-start gap-2 font-body-sm text-body-sm leading-6 text-text-body"><MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-secondary" /> {record.source || event?.title || 'Arsip editorial guskikin.id'}</p>
                {event ? <p className="mt-2 pl-6 font-caption text-caption text-text-body">{event.venue || event.city || event.title}</p> : null}
              </div>
              <QuoteActions quote={record.quote} />
            </div>
          </div>
        </section>

        <aside className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/15 bg-surface-container-low p-5">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div><h2 className="font-label-md text-label-md font-bold text-primary">Catatan editorial</h2><p className="mt-1 font-body-sm text-body-sm leading-6 text-text-body">Konteks dan sumber kutipan mengikuti data yang dikelola redaksi di Payload. Periksa informasi sumber sebelum menggunakan kutipan untuk publikasi lain.</p></div>
        </aside>

        <Link className="mt-8 inline-flex items-center gap-2 font-label-sm text-label-sm font-bold text-primary hover:text-emerald-deep" href="/dawuh"><ArrowLeft aria-hidden="true" className="size-4" /> Kembali ke koleksi dawuh</Link>
      </div>
    </article>
  )
}
