import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Headphones,
  ImageIcon,
  Mic2,
  Play,
  Search,
  ShieldCheck,
  Video,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { MediaCover } from '@/components/media/MediaCover'
import {
  MEDIA_PAGE_SIZE,
  formatMediaDate,
  getMediaArchive,
  getMediaAssetURL,
  getMediaPrimaryURL,
  getMediaTypeLabel,
  isMediaAsset,
  type MediaType,
} from '@/lib/media'
import type { MediaContent } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Galeri Multimedia | guskikin.id',
  description: 'Video, podcast, rekaman audio, dan dokumentasi foto khazanah guskikin.id.',
}

type SearchParams = Promise<{ jenis?: string | string[]; page?: string | string[]; q?: string | string[]; urut?: string | string[] }>
const mediaTypes: MediaContent['type'][] = ['video', 'podcast', 'photo-gallery', 'audio']
const firstValue = (value?: string | string[]) => Array.isArray(value) ? value[0] : value
const validType = (value?: string): MediaType => mediaTypes.includes(value as MediaContent['type']) ? value as MediaType : 'all'
const buildMediaURL = ({ mediaType, page, query, sort }: { mediaType?: MediaType; page?: number; query?: string; sort?: 'terbaru' | 'terlama' }) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (mediaType && mediaType !== 'all') params.set('jenis', mediaType)
  if (sort === 'terlama') params.set('urut', sort)
  if (page && page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `/media?${search}` : '/media'
}

const MediaTypeIcon = ({ type }: { type: MediaContent['type'] }) => type === 'audio' ? <Headphones aria-hidden="true" /> : type === 'photo-gallery' ? <Camera aria-hidden="true" /> : type === 'podcast' ? <Mic2 aria-hidden="true" /> : <Video aria-hidden="true" />

const MediaCard = ({ record }: { record: MediaContent }) => {
  const hasImage = Boolean(getMediaAssetURL(record.thumbnail))
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_14px_32px_rgba(15,81,50,0.08)]">
      <div className={`relative aspect-[16/9] overflow-hidden ${hasImage ? 'bg-surface-container-low' : 'grid place-items-center bg-[#eaf1ff] text-primary'}`}>
        {hasImage ? <MediaCover record={record} sizes="(max-width: 768px) 100vw, 33vw" /> : <span className="[&_svg]:size-11"><MediaTypeIcon type={record.type} /></span>}
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 font-label-sm text-label-sm font-bold text-white">{getMediaTypeLabel(record.type)}</span>
        {record.duration ? <span className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-2 py-1 font-caption text-caption font-bold text-white">{record.duration}</span> : null}
        {(record.type === 'video' || record.type === 'podcast') ? <span className="absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-primary text-white shadow-lg"><Play aria-hidden="true" className="ml-0.5 size-5 fill-current" /></span> : null}
      </div>
      <div className="flex flex-1 flex-col p-5"><div className="flex flex-wrap items-center gap-2 font-caption text-caption text-text-body">{record.series ? <span>{record.series}</span> : null}{record.duration ? <><span>•</span><span>{record.duration}</span></> : null}{formatMediaDate(record.publishedAt) ? <><span>•</span><span>{formatMediaDate(record.publishedAt)}</span></> : null}</div><h3 className="mt-3 font-editorial text-headline-sm font-bold leading-snug text-primary"><Link href={`/media/${record.slug}`}>{record.title}</Link></h3>{record.description ? <p className="mt-3 line-clamp-3 font-body-sm text-body-sm leading-6 text-text-body">{record.description}</p> : null}<div className="mt-auto flex items-center justify-between gap-3 pt-5"><span className="font-caption text-caption text-text-body">{record.host || record.speaker || record.credit || 'Arsip guskikin.id'}</span><Link className="inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary" href={`/media/${record.slug}`}>Buka <ArrowRight aria-hidden="true" className="size-3.5" /></Link></div></div>
    </article>
  )
}

const FeaturedMedia = ({ record }: { record: MediaContent }) => {
  const primaryURL = getMediaPrimaryURL(record)
  return (
    <article className="grid overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_rgba(15,81,50,0.08)] lg:grid-cols-[1.35fr_0.92fr]">
      <div className="relative min-h-[21rem] overflow-hidden bg-primary lg:min-h-[34rem]"><MediaCover fallback priority record={record} sizes="(max-width: 1024px) 100vw, 58vw" /><div className="absolute inset-0 bg-primary/20" /><span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1 font-label-sm text-label-sm font-bold text-white">Pilihan Redaksi • {getMediaTypeLabel(record.type)}</span>{record.duration ? <span className="absolute right-5 top-5 rounded-lg bg-black/70 px-3 py-1 font-caption text-caption font-bold text-white">{record.duration}</span> : null}<Link aria-label={`Putar ${record.title}`} className="absolute inset-0 m-auto grid size-20 place-items-center rounded-full bg-primary text-white shadow-xl hover:bg-emerald-deep" href={primaryURL || `/media/${record.slug}`} target={primaryURL ? '_blank' : undefined}><Play aria-hidden="true" className="ml-1 size-8 fill-current" /></Link></div>
      <div className="flex flex-col justify-center p-7 sm:p-9"><span className="font-label-sm text-label-sm font-bold text-primary">{record.series || getMediaTypeLabel(record.type)}{record.episode ? ` • Episode ${record.episode}` : ''}</span><h2 className="mt-4 font-editorial text-[2rem] font-bold leading-[1.17] text-primary">{record.title}</h2>{record.speaker ? <div className="mt-5 rounded-xl bg-surface-container-low p-4"><p className="font-label-sm text-label-sm font-bold text-primary">{record.speaker}</p><p className="mt-1 font-caption text-caption text-text-body">{record.host ? `Dipandu oleh ${record.host}` : 'Arsip khazanah guskikin.id'}</p></div> : null}{record.description ? <p className="mt-5 font-body-md text-body-md leading-7 text-text-body">{record.description}</p> : null}<div className="mt-7 flex flex-wrap gap-2"><Link className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-label-sm text-label-sm font-bold text-white hover:bg-emerald-deep" href={primaryURL || `/media/${record.slug}`} target={primaryURL ? '_blank' : undefined}><Play aria-hidden="true" className="size-4 fill-current" /> {record.type === 'audio' ? 'Dengarkan' : 'Tonton selengkapnya'}</Link><Link className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 font-label-sm text-label-sm font-bold text-primary" href={`/media/${record.slug}`}>Detail tayangan</Link></div></div>
    </article>
  )
}

const GalleryCard = ({ record, large = false }: { record: MediaContent; large?: boolean }) => {
  const firstGalleryImage = record.galleryItems?.find((item) => isMediaAsset(item.image))?.image
  const imageURL = getMediaAssetURL(record.thumbnail) || (firstGalleryImage && isMediaAsset(firstGalleryImage) ? firstGalleryImage.sizes?.card?.url || firstGalleryImage.url : null)
  return <article className={`group relative overflow-hidden rounded-2xl bg-primary ${large ? 'min-h-[25rem] md:col-span-2 md:row-span-2' : 'min-h-48'}`}>{imageURL ? <MediaCover record={{ ...record, thumbnail: firstGalleryImage || record.thumbnail }} sizes={large ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'} /> : <div className="absolute inset-0 grid place-items-center bg-[#173f31] text-white/30"><ImageIcon aria-hidden="true" className="size-14" /></div>}<div className="absolute inset-0 bg-black/45" /><div className="absolute inset-x-0 bottom-0 p-5 text-white"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-secondary px-2.5 py-1 font-caption text-caption font-bold">{record.galleryItems?.length ? `${record.galleryItems.length} foto` : 'Album editorial'}</span>{record.location ? <span className="rounded-full bg-black/35 px-2.5 py-1 font-caption text-caption">{record.location}</span> : null}</div><h3 className={`mt-3 font-editorial font-bold leading-tight ${large ? 'text-headline-md sm:text-headline-lg-mobile' : 'text-headline-sm'}`}><Link href={`/media/${record.slug}`}>{record.title}</Link></h3>{record.description && large ? <p className="mt-2 line-clamp-2 max-w-xl font-body-sm text-body-sm leading-6 text-white/80">{record.description}</p> : null}</div></article>
}

export default async function MediaPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = firstValue(params.q)?.trim() || ''
  const mediaType = validType(firstValue(params.jenis))
  const sort = firstValue(params.urut) === 'terlama' ? 'terlama' as const : 'terbaru' as const
  const requestedPage = Number.parseInt(firstValue(params.page) || '1', 10)
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1
  const archive = await getMediaArchive({ mediaType, page, query, sort })
  const totalAvailable = Object.values(archive.typeCounts).reduce((sum, count) => sum + count, 0)
  const activeView = Boolean(query || mediaType !== 'all' || page > 1 || sort === 'terlama')
  const start = archive.totalDocs ? (archive.page - 1) * MEDIA_PAGE_SIZE + 1 : 0
  const end = archive.records.length ? start + archive.records.length - 1 : 0

  return <div className="bg-cream-bg">
    <div className="border-b border-border bg-surface-container-low"><div className="mx-auto flex max-w-container-max flex-wrap items-center justify-between gap-3 px-gutter-mobile py-4 font-label-sm text-label-sm sm:px-gutter-tablet lg:px-gutter-desktop"><nav className="flex items-center gap-2 text-text-body" aria-label="Breadcrumb"><Link className="hover:text-primary" href="/">Beranda</Link><span>/</span><span className="font-bold text-primary">Galeri Multimedia</span><span>•</span><span>Video, Foto &amp; Rekaman Audio</span></nav><span className="rounded-full bg-[#fff0df] px-3 py-1 font-bold text-[#9a5000]">Arsip editorial</span></div></div>
    <section className="border-b border-border bg-white"><div className="mx-auto max-w-container-max px-gutter-mobile py-12 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-16"><span className="inline-flex items-center gap-2 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-secondary"><Video aria-hidden="true" className="size-4" /> Pusat arsip audio-visual &amp; dokumentasi</span><h1 className="mt-5 max-w-4xl font-editorial text-headline-xl-mobile font-bold leading-[1.08] tracking-tight text-primary lg:text-headline-xl">Galeri Multimedia &amp; Dokumentasi Khazanah Gus Kikin</h1><p className="mt-5 max-w-3xl font-body-lg text-body-lg leading-8 text-text-body">Tayangan video, podcast, dokumentasi foto, serta rekaman audio kalam keilmuan yang dikelola melalui satu arsip editorial.</p>
      <div className="mt-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><nav aria-label="Jenis media" className="flex flex-wrap gap-2"><Link className={`rounded-full px-4 py-2 font-label-sm text-label-sm font-bold ${mediaType === 'all' ? 'bg-primary text-white' : 'bg-surface-container-low text-text-body hover:text-primary'}`} href={buildMediaURL({ query, sort })}>Semua Media ({totalAvailable})</Link>{mediaTypes.map((type) => <Link className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-label-sm text-label-sm font-semibold [&_svg]:size-4 ${mediaType === type ? 'bg-primary text-white' : 'bg-surface-container-low text-text-body hover:text-primary'}`} href={buildMediaURL({ mediaType: type, query, sort })} key={type}><MediaTypeIcon type={type} /> {getMediaTypeLabel(type)} ({archive.typeCounts[type]})</Link>)}</nav><form action="/media" className="flex flex-col gap-2 sm:flex-row" method="get"><label className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-white px-4"><Search aria-hidden="true" className="size-4 text-text-body" /><span className="sr-only">Cari media</span><input className="w-full bg-transparent font-body-sm text-body-sm outline-none" defaultValue={query} name="q" placeholder="Cari topik tayangan..." type="search" /></label>{mediaType !== 'all' ? <input name="jenis" type="hidden" value={mediaType} /> : null}<select className="min-h-11 rounded-xl border border-border bg-white px-4 font-label-sm text-label-sm font-bold" defaultValue={sort} name="urut"><option value="terbaru">Terbaru</option><option value="terlama">Terlama</option></select><button className="min-h-11 rounded-xl bg-primary px-5 font-label-sm text-label-sm font-bold text-white" type="submit">Terapkan</button></form></div>
    </div></section>

    <div className="mx-auto max-w-container-max px-gutter-mobile py-10 sm:px-gutter-tablet lg:px-gutter-desktop lg:py-12">{archive.error ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><h2 className="font-editorial text-headline-md font-bold">Galeri belum dapat dimuat</h2><p className="mt-2 text-text-body">Koneksi basis data sedang tidak tersedia.</p></div> : null}
      {activeView ? <section><div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4"><h2 className="font-editorial text-headline-md font-bold text-primary">{mediaType !== 'all' ? getMediaTypeLabel(mediaType) : query ? `Hasil pencarian “${query}”` : 'Semua Media'}</h2><p className="font-caption text-caption text-text-body">{archive.totalDocs ? `Menampilkan ${start}–${end} dari ${archive.totalDocs} arsip` : 'Belum ada media'}</p></div>{archive.records.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{archive.records.map((record) => <MediaCard key={record.id} record={record} />)}</div> : !archive.error ? <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-14 text-center"><Video aria-hidden="true" className="mx-auto size-9 text-primary/45" /><h2 className="mt-4 font-editorial text-headline-md font-bold text-primary">Belum ada media yang cocok</h2><Link className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 font-label-sm text-label-sm font-bold text-white" href="/media">Lihat semua media</Link></div> : null}{archive.totalPages > 1 ? <nav aria-label="Navigasi galeri" className="mt-8 flex items-center justify-end gap-2 rounded-2xl border border-border bg-white p-3">{archive.page > 1 ? <Link className="grid size-10 place-items-center rounded-xl border" href={buildMediaURL({ mediaType, page: archive.page - 1, query, sort })}><ChevronLeft aria-hidden="true" className="size-4" /></Link> : null}<span className="px-3 font-label-sm text-label-sm font-bold text-primary">{archive.page} / {archive.totalPages}</span>{archive.page < archive.totalPages ? <Link className="grid size-10 place-items-center rounded-xl border" href={buildMediaURL({ mediaType, page: archive.page + 1, query, sort })}><ChevronRight aria-hidden="true" className="size-4" /></Link> : null}</nav> : null}</section> : <div className="space-y-12">
        {archive.featured ? <FeaturedMedia record={archive.featured} /> : null}
        {archive.videos.length ? <section><div className="mb-5 flex items-end justify-between gap-4"><div><span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-secondary">Siaran digital pilihan</span><h2 className="mt-1 font-editorial text-headline-lg-mobile font-bold text-primary">Tayangan Video &amp; Podcast</h2></div><Link className="font-label-sm text-label-sm font-bold text-primary" href="/media?jenis=video">Jelajahi video <ArrowRight className="inline size-4" /></Link></div><div className="grid gap-5 md:grid-cols-3">{archive.videos.map((record) => <MediaCard key={record.id} record={record} />)}</div></section> : null}
        {archive.galleries.length ? <section className="rounded-2xl bg-surface-container-low p-5 sm:p-7"><div className="mb-5"><span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-secondary">Arsip visual beresolusi tinggi</span><h2 className="mt-1 font-editorial text-headline-lg-mobile font-bold text-primary">Dokumentasi Foto Khazanah &amp; Lawatan Keumatan</h2></div><div className="grid gap-4 md:grid-cols-3">{archive.galleries.map((record, index) => <GalleryCard key={record.id} large={index === 0} record={record} />)}</div></section> : null}
        {archive.audio.length ? <section className="grid gap-6 rounded-2xl border border-border bg-white p-6 sm:p-8 lg:grid-cols-[1fr_24rem]"><div><span className="inline-flex items-center gap-2 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-secondary"><Headphones aria-hidden="true" className="size-4" /> Audio player khazanah kalam</span><h2 className="mt-3 font-editorial text-headline-lg-mobile font-bold text-primary">{archive.audio[0].title}</h2>{archive.audio[0].description ? <p className="mt-3 font-body-sm text-body-sm leading-6 text-text-body">{archive.audio[0].description}</p> : null}{archive.audio[0].audioUrl ? <audio className="mt-6 w-full" controls preload="metadata" src={archive.audio[0].audioUrl}>Peramban Anda tidak mendukung pemutar audio.</audio> : <Link className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-label-sm text-label-sm font-bold text-white" href={`/media/${archive.audio[0].slug}`}><Play aria-hidden="true" className="size-4 fill-current" /> Buka rekaman</Link>}</div><div className="rounded-2xl bg-surface-container-low p-5"><div className="flex items-center justify-between"><h3 className="font-editorial text-headline-sm font-bold text-primary">Daftar Putar Kalam</h3><span className="font-caption text-caption text-text-body">{archive.audio.length} rekaman</span></div><div className="mt-4 space-y-2">{archive.audio.map((record, index) => <Link className={`flex items-center gap-3 rounded-xl p-3 ${index === 0 ? 'bg-white' : 'hover:bg-white/70'}`} href={`/media/${record.slug}`} key={record.id}><span className="grid size-8 place-items-center rounded-full bg-primary text-white"><Play aria-hidden="true" className="size-3 fill-current" /></span><span className="min-w-0 flex-1"><strong className="block truncate font-label-sm text-label-sm text-primary">{record.title}</strong><span className="font-caption text-caption text-text-body">{record.speaker || record.series || 'Arsip Kalam'}</span></span><span className="font-caption text-caption text-secondary">{record.duration}</span></Link>)}</div></div></section> : null}
        {!archive.featured && !archive.videos.length && !archive.galleries.length && !archive.audio.length && !archive.error ? <div className="rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-16 text-center"><Video aria-hidden="true" className="mx-auto size-10 text-primary/40" /><h2 className="mt-4 font-editorial text-headline-md font-bold text-primary">Arsip multimedia masih kosong</h2><p className="mx-auto mt-2 max-w-md font-body-sm text-body-sm leading-6 text-text-body">Konten video, foto, dan audio yang ditambahkan di Payload akan tampil otomatis di sini.</p></div> : null}
      </div>}
      <section className="mt-12 grid gap-5 md:grid-cols-3"><div className="rounded-2xl border border-border bg-white p-6"><Video className="size-7 text-secondary" /><h2 className="mt-4 font-editorial text-headline-sm font-bold text-primary">Siaran Resmi Pesantren</h2><p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">Setiap tautan kanal dan tayangan mengikuti URL yang dikelola redaksi dalam Payload.</p></div><div className="rounded-2xl border border-border bg-white p-6"><FileDown className="size-7 text-primary" /><h2 className="mt-4 font-editorial text-headline-sm font-bold text-primary">Arsip Unduhan</h2><p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">Lampiran berkas tersedia pada detail media apabila telah diunggah dan diizinkan redaksi.</p></div><div className="rounded-2xl bg-emerald-deep p-6 text-white"><ShieldCheck className="size-7 text-[#8de0aa]" /><h2 className="mt-4 font-editorial text-headline-sm font-bold">Kredit &amp; Hak Cipta</h2><p className="mt-2 font-body-sm text-body-sm leading-6 text-white/75">Informasi sumber, lokasi, dan kredit mengikuti metadata setiap arsip.</p><Link className="mt-4 inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-white" href="/tentang">Pedoman pemanfaatan <ArrowRight className="size-3.5" /></Link></div></section>
    </div>
  </div>
}
