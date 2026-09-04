import { BookOpenText, CalendarDays, Headphones, Quote, Sparkles } from 'lucide-react'

const emptyCollections = [
  {
    description: 'Tulisan, opini, dan refleksi terbaru akan hadir di sini.',
    icon: BookOpenText,
    title: 'Artikel & Opini',
  },
  {
    description: 'Petuah dan mutiara hikmah sedang dipersiapkan.',
    icon: Quote,
    title: 'Dawuh & Khazanah',
  },
  {
    description: 'Jadwal safari dakwah akan muncul setelah diterbitkan.',
    icon: CalendarDays,
    title: 'Agenda Kegiatan',
  },
  {
    description: 'Rekaman kajian, video, dan podcast akan segera tersedia.',
    icon: Headphones,
    title: 'Media',
  },
]

export function HomepageEmptyState({ error }: { error: boolean }) {
  return (
    <section aria-labelledby="homepage-empty-title" className="relative overflow-hidden bg-cream-bg py-16 sm:py-20 lg:py-24">
      <div className="absolute -right-20 top-6 size-64 rounded-full bg-secondary/[0.06] blur-3xl" aria-hidden="true" />
      <div className="absolute -left-24 bottom-0 size-72 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-3 py-1.5 font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary shadow-sm">
            <Sparkles aria-hidden="true" className="size-3.5" /> guskikin.id
          </span>
          <h1 className="mt-5 font-editorial text-headline-xl-mobile font-bold leading-tight text-primary lg:text-headline-xl" id="homepage-empty-title">
            {error ? 'Konten belum dapat dimuat' : 'Khazanah sedang dipersiapkan'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body-md text-body-md leading-7 text-text-body">
            {error
              ? 'Kami sedang mengalami kendala saat mengambil data. Silakan kunjungi kembali halaman ini beberapa saat lagi.'
              : 'Belum ada konten yang diterbitkan saat ini. Tim redaksi sedang menyiapkan artikel, dawuh, agenda, dan media untuk Anda.'}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emptyCollections.map((item) => {
            const Icon = item.icon

            return (
              <article className="rounded-2xl border border-border bg-white p-5 text-center shadow-[0_10px_28px_rgba(15,81,50,0.05)]" key={item.title}>
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-surface-container-low text-primary">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </span>
                <h2 className="mt-4 font-editorial text-headline-sm font-bold text-text-headline">{item.title}</h2>
                <p className="mt-2 font-body-sm text-body-sm leading-6 text-text-body">{item.description}</p>
              </article>
            )
          })}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center font-caption text-caption text-text-body">
          Terima kasih telah berkunjung. Nantikan pembaruan khazanah dari guskikin.id.
        </p>
      </div>
    </section>
  )
}
