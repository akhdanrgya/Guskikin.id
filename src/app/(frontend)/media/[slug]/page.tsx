import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, CalendarDays, Download, ExternalLink, Headphones, ImageIcon, Mic2, Play, Video } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaCover } from '@/components/media/MediaCover'
import {
  formatMediaDate,
  getMediaAssetURL,
  getMediaBySlug,
  getMediaPrimaryURL,
  getMediaTypeLabel,
  isMediaAsset,
} from '@/lib/media'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const record = await getMediaBySlug(slug)
  if (!record) return { title: 'Media tidak ditemukan | guskikin.id' }
  const image = getMediaAssetURL(record.thumbnail, 'feature')
  return {
    title: `${record.title} | guskikin.id`,
    description: record.description || undefined,
    openGraph: image ? { images: [{ url: image }], title: record.title } : undefined,
  }
}

const TypeIcon = ({ type }: { type: 'video' | 'audio' | 'podcast' | 'photo-gallery' }) => type === 'audio' ? <Headphones /> : type === 'photo-gallery' ? <ImageIcon /> : type === 'podcast' ? <Mic2 /> : <Video />

export default async function MediaDetailPage({ params }: PageProps) {
  const { slug } = await params
  const record = await getMediaBySlug(slug)
  if (!record) notFound()

  const primaryURL = getMediaPrimaryURL(record)
  const file = isMediaAsset(record.downloadableFile) ? record.downloadableFile : null
  const date = formatMediaDate(record.publishedAt)
  const hasCover = Boolean(getMediaAssetURL(record.thumbnail, 'feature'))

  return <article className="bg-cream-bg">
    <header className="border-b border-border bg-white"><div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14"><nav className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-text-body" aria-label="Breadcrumb"><Link className="hover:text-primary" href="/">Beranda</Link><span>/</span><Link className="hover:text-primary" href="/media">Galeri Multimedia</Link><span>/</span><span className="font-bold text-primary">{getMediaTypeLabel(record.type)}</span></nav></div></header>
    <div className="mx-auto max-w-5xl px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-14">
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_rgba(15,81,50,0.07)]">
        {record.youtubeId ? <div className="aspect-video bg-black"><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="size-full" src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(record.youtubeId)}`} title={record.title} /></div> : record.type === 'video' && record.videoUrl ? <video className="aspect-video w-full bg-black" controls poster={getMediaAssetURL(record.thumbnail, 'feature') || undefined} preload="metadata" src={record.videoUrl}>Peramban Anda tidak mendukung video.</video> : hasCover ? <div className="relative aspect-[16/7] overflow-hidden bg-primary"><MediaCover priority record={record} sizes="(max-width: 1024px) 100vw, 960px" /></div> : null}
        <div className="border-l-[6px] border-primary p-7 sm:p-10 lg:p-12"><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm font-bold text-primary [&_svg]:size-4"><TypeIcon type={record.type} /> {getMediaTypeLabel(record.type)}</span>{date ? <span className="inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary"><CalendarDays className="size-4" /> {date}</span> : null}{record.duration ? <span className="font-label-sm text-label-sm text-text-body">Durasi {record.duration}</span> : null}</div><h1 className="mt-6 max-w-4xl font-editorial text-headline-xl-mobile font-bold leading-[1.08] text-primary sm:text-headline-xl">{record.title}</h1>{record.description ? <p className="mt-5 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">{record.description}</p> : null}<dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5 font-body-sm text-body-sm">{record.speaker ? <div><dt className="text-text-body">Narasumber</dt><dd className="font-bold text-primary">{record.speaker}</dd></div> : null}{record.host ? <div><dt className="text-text-body">Host</dt><dd className="font-bold text-primary">{record.host}</dd></div> : null}{record.series ? <div><dt className="text-text-body">Seri</dt><dd className="font-bold text-primary">{record.series}{record.episode ? ` #${record.episode}` : ''}</dd></div> : null}{record.location ? <div><dt className="text-text-body">Lokasi</dt><dd className="font-bold text-primary">{record.location}</dd></div> : null}</dl><div className="mt-7 flex flex-wrap gap-3">{primaryURL && !record.youtubeId && !(record.type === 'video' && record.videoUrl) ? <a className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-label-sm text-label-sm font-bold text-white" href={primaryURL} rel="noreferrer" target="_blank"><Play className="size-4 fill-current" /> Buka media <ExternalLink className="size-3.5" /></a> : null}{file?.url ? <a className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 font-label-sm text-label-sm font-bold text-primary" download href={file.url}><Download className="size-4" /> Unduh lampiran {record.fileSize ? `(${record.fileSize})` : ''}</a> : null}</div></div>
      </section>

      {record.type === 'audio' && record.audioUrl ? <section className="mt-6 rounded-2xl border border-border bg-surface-container-low p-6"><h2 className="font-editorial text-headline-sm font-bold text-primary">Dengarkan Rekaman</h2><audio className="mt-4 w-full" controls preload="metadata" src={record.audioUrl}>Peramban Anda tidak mendukung audio.</audio></section> : null}
      {record.type === 'photo-gallery' ? <section className="mt-8"><div className="mb-5 flex items-end justify-between"><h2 className="font-editorial text-headline-md font-bold text-primary">Isi Album</h2><span className="font-caption text-caption text-text-body">{record.galleryItems?.length || 0} foto</span></div>{record.galleryItems?.length ? <div className="grid gap-4 sm:grid-cols-2">{record.galleryItems.map((item) => { const image = isMediaAsset(item.image) ? item.image : null; return image?.url ? <figure className="overflow-hidden rounded-2xl border border-border bg-white" key={item.id || image.id}><div className="relative aspect-[4/3]"><Image alt={image.alt} className="object-cover" fill sizes="(max-width: 640px) 100vw, 50vw" src={image.sizes?.feature?.url || image.url} /></div>{item.caption ? <figcaption className="p-4 font-body-sm text-body-sm text-text-body">{item.caption}</figcaption> : null}</figure> : null })}</div> : <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-12 text-center"><ImageIcon className="mx-auto size-9 text-primary/40" /><p className="mt-3 font-body-sm text-body-sm text-text-body">Foto album belum diunggah oleh redaksi.</p></div>}</section> : null}
      {record.transcript ? <section className="mt-8"><h2 className="mb-5 font-editorial text-headline-md font-bold text-primary">Transkrip &amp; Catatan</h2><RichText className="article-prose rounded-2xl border border-border bg-white p-7 sm:p-10" data={record.transcript} /></section> : null}
      {record.credit || record.resolution ? <aside className="mt-6 rounded-2xl border border-primary/15 bg-surface-container-low p-5"><p className="font-label-sm text-label-sm font-bold text-primary">Informasi arsip</p><p className="mt-2 font-body-sm text-body-sm text-text-body">{[record.credit && `Kredit: ${record.credit}`, record.resolution && `Resolusi: ${record.resolution}`].filter(Boolean).join(' • ')}</p></aside> : null}
      <Link className="mt-8 inline-flex items-center gap-2 font-label-sm text-label-sm font-bold text-primary" href="/media"><ArrowLeft className="size-4" /> Kembali ke galeri multimedia</Link>
    </div>
  </article>
}
