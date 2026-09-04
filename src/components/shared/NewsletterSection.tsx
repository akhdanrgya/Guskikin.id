import { ArrowRight, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function NewsletterSection() {
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="bg-cream-bg pb-space-3xl">
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="relative overflow-hidden rounded-lg bg-primary px-space-xl py-space-2xl text-primary-foreground shadow-[0_18px_45px_rgba(15,81,50,0.18)] sm:px-space-2xl lg:px-space-3xl">
          <Sparkles className="absolute -bottom-16 right-4 size-64 text-white/[0.08]" strokeWidth={1.2} aria-hidden="true" />
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-space-xs rounded-full bg-white/10 px-space-sm py-1 font-label-sm text-label-sm font-bold uppercase tracking-[0.1em] text-[#f5bd66]">
              <Mail className="size-3.5" aria-hidden="true" /> Pustaka Surel Santri
            </span>
            <h2 id="newsletter-title" className="mt-space-md font-headline-lg text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight tracking-[-0.025em]">
              Ikuti Buletin Khazanah Mingguan
            </h2>
            <p className="mt-space-sm max-w-2xl font-body-md text-body-md leading-7 text-white/70">
              Dapatkan rangkuman khutbah, catatan halaqah, dan pilihan arsip melalui kanal resmi guskikin.id.
            </p>
            <div className="mt-space-xl flex flex-col items-start gap-space-md sm:flex-row sm:items-center">
              <Link href="/tentang" className="group inline-flex h-12 items-center gap-space-xs rounded-md bg-secondary px-space-lg font-label-md text-label-md font-bold text-secondary-foreground transition-colors hover:bg-[#b95f04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-primary">
                Lihat kanal resmi
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <span className="inline-flex items-center gap-space-xs font-body-sm text-body-sm text-white/60">
                <ShieldCheck className="size-4" aria-hidden="true" /> Tanpa popup agresif dan tanpa metrik semu.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
