import { BookOpenText, FileText, LibraryBig, ScrollText } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'
import type { Category, Khazanah } from '@/payload-types'

const typeLabels: Record<Khazanah['type'], string> = {
  dawuh: 'Dawuh',
  dokumen: 'Dokumen',
  esai: 'Esai',
  kajian: 'Kajian',
  khotbah: 'Naskah Khotbah',
  sanad: 'Sanad Keilmuan',
  transkrip: 'Transkrip Pengajian',
}

const icons = [ScrollText, FileText, BookOpenText] as const

const isCategory = (value: Khazanah['topic']): value is Category =>
  Boolean(value && typeof value === 'object' && 'title' in value)

export function KhazanahSection({ collections }: { collections: Khazanah[] }) {
  if (!collections.length) return null

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
          {collections.map((item, index) => {
            const Icon = icons[index % icons.length]
            const meta = [
              item.year ? String(item.year) : null,
              isCategory(item.topic) ? `Tema ${item.topic.title}` : null,
              item.source,
            ].filter(Boolean).join(' · ')

            return (
              <article key={item.id} className="group rounded-lg border border-white/15 bg-white/[0.07] p-space-xl transition-colors hover:bg-white/[0.11]">
                <div className="flex items-center justify-between gap-space-md">
                  <span className="grid size-11 place-items-center rounded-md bg-white/10 text-[#f5bd66]">
                    <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="font-headline-md text-headline-md font-bold text-white/15" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <span className="mt-space-lg block font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-[#f5bd66]">{typeLabels[item.type]}</span>
                <Link href="/khazanah" className="mt-space-xs block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary">
                  <h3 className="font-headline-sm text-[1.35rem] font-semibold leading-snug text-white transition-colors group-hover:text-[#f5bd66]">{item.title}</h3>
                </Link>
                {meta ? <p className="mt-space-lg border-t border-white/10 pt-space-md font-body-sm text-body-sm text-white/55">{meta}</p> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
