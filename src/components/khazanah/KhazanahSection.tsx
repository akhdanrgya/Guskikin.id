import { BookOpenText, FileText, LibraryBig, ScrollText } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'

const collections = [
  { type: 'Transkrip Pengajian', title: 'Adab Menuntut Ilmu dan Tanggung Jawab Menjaga Kesahihan Sumber', meta: '12 naskah · Tema pendidikan', Icon: ScrollText },
  { type: 'Naskah Khotbah', title: 'Kemandirian Umat sebagai Jalan Panjang Membangun Peradaban', meta: '8 naskah · Tema keumatan', Icon: FileText },
  { type: 'Kajian & Sanad', title: 'Jejak Keilmuan Tebuireng dari Masyayikh hingga Generasi Santri', meta: '15 materi · Tema sanad', Icon: BookOpenText },
] as const

export function KhazanahSection() {
  return (
    <section aria-labelledby="khazanah-title" className="bg-primary py-space-3xl">
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <SectionHeading
          eyebrow="Pustaka Digital"
          title="Khazanah Pemikiran"
          titleId="khazanah-title"
          description="Naskah, transkrip, kajian, dan sanad keilmuan yang ditata sebagai arsip pengetahuan yang mudah ditelusuri."
          href="/khazanah"
          linkLabel="Jelajahi perpustakaan"
          icon={LibraryBig}
          inverted
        />

        <div className="grid gap-space-md lg:grid-cols-3">
          {collections.map(({ Icon, ...item }, index) => (
            <article key={item.title} className="group rounded-lg border border-white/15 bg-white/[0.07] p-space-xl transition-colors hover:bg-white/[0.11]">
              <div className="flex items-center justify-between gap-space-md">
                <span className="grid size-11 place-items-center rounded-md bg-white/10 text-[#f5bd66]">
                  <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="font-headline-md text-headline-md font-bold text-white/15" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <span className="mt-space-lg block font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-[#f5bd66]">{item.type}</span>
              <Link href="/khazanah" className="mt-space-xs block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary">
                <h3 className="font-headline-sm text-[1.35rem] font-semibold leading-snug text-white transition-colors group-hover:text-[#f5bd66]">{item.title}</h3>
              </Link>
              <p className="mt-space-lg border-t border-white/10 pt-space-md font-body-sm text-body-sm text-white/55">{item.meta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
