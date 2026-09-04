import { ArrowRight, BookOpenText, MapPin, Quote } from 'lucide-react'
import Link from 'next/link'

export function DawuhFeature() {
  return (
    <section aria-labelledby="dawuh-title" className="bg-[#edf3ff] py-space-3xl">
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <span className="mb-space-xs inline-flex items-center gap-space-xs font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">
              <Quote className="size-4 fill-current" aria-hidden="true" />
              Kalam &amp; Mutiara Hikmah
            </span>
            <h2 id="dawuh-title" className="font-headline-lg text-[clamp(1.9rem,3vw,2.8rem)] font-bold leading-tight tracking-[-0.02em] text-primary">
              Dawuh &amp; Petuah Hikmah Gus Kikin
            </h2>
            <p className="mt-space-xs font-body-md text-body-md text-text-body">
              Pedoman moral, adab pencari ilmu, dan peta jalan peradaban santri Indonesia.
            </p>
          </div>

          <Link href="/dawuh" className="group inline-flex w-fit items-center gap-space-xs rounded-sm font-label-sm text-label-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
            Arsip seluruh dawuh
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <article className="grid overflow-hidden rounded-lg border border-border/70 bg-white shadow-[0_14px_40px_rgba(15,81,50,0.08)] lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="p-space-xl sm:p-space-2xl">
            <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm font-bold text-secondary">
              <MapPin className="size-4" aria-hidden="true" />
              Pengajian Bulanan Santri, Tebuireng
            </span>
            <blockquote className="mt-space-lg max-w-[49rem] font-headline-md text-[clamp(1.45rem,2.6vw,2.15rem)] font-semibold italic leading-[1.45] text-text-headline">
              “Santri tidak hanya dituntut menguasai kitab, tetapi juga mampu membaca realitas zaman dengan hati yang jernih dan integritas yang tidak tergoyahkan.”
            </blockquote>
            <div className="mt-space-xl flex items-center gap-space-sm">
              <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
                <BookOpenText className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-headline-sm text-[1.1rem] font-bold text-primary">K.H. Abdul Hakim Mahfudz</p>
                <p className="font-body-sm text-body-sm text-text-body">Pengasuh Pondok Pesantren Tebuireng</p>
              </div>
            </div>
          </div>

          <div className="m-space-lg grid min-h-64 place-items-center rounded-lg bg-[#e8eefc] p-space-xl text-center lg:m-space-xl lg:ml-0">
            <div>
              <BookOpenText className="mx-auto size-12 text-secondary" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-space-lg font-headline-md text-headline-md font-bold text-primary">Sanad &amp; Adab</p>
              <p className="mt-space-xs font-body-sm text-body-sm leading-5 text-text-body">Mutiara hikmah dwimingguan santri Indonesia</p>
              <span className="mt-space-lg inline-block rounded-full bg-white px-space-md py-1 font-label-sm text-label-sm font-bold text-secondary">
                Edisi Rabiul Akhir
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
