import Link from 'next/link'

export const SiteFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-surface-container-lowest">
      <div className="mx-auto max-w-container-max px-gutter-mobile py-space-3xl sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="grid grid-cols-1 gap-space-2xl md:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-4">
            <span className="font-headline-md text-headline-md font-bold text-primary">guskikin.id</span>
            <p className="max-w-sm font-body-md text-body-md leading-7 text-text-body">
              Portal khazanah pemikiran, gagasan kebangsaan, dan rekam jejak dakwah K.H. Abdul Hakim Mahfudz.
            </p>
          </div>

          <div className="flex flex-col gap-space-sm lg:col-span-2">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">Rubrik Khazanah</span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-text-body">
              <Link href="/dawuh" className="transition-colors hover:text-primary">Dawuh &amp; Tausiyah</Link>
              <Link href="/berita" className="transition-colors hover:text-primary">Opini Kebangsaan</Link>
              <Link href="/khazanah" className="transition-colors hover:text-primary">Arsip Keilmuan</Link>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm lg:col-span-2">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">Jelajahi</span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-text-body">
              <Link href="/agenda" className="transition-colors hover:text-primary">Safari Dakwah</Link>
              <Link href="/media" className="transition-colors hover:text-primary">Video &amp; Audio</Link>
              <Link href="/komunitas" className="transition-colors hover:text-primary">Komunitas</Link>
            </div>
          </div>

          <div className="flex flex-col gap-space-md lg:col-span-4">
            <div className="rounded-lg bg-cream-bg p-space-lg">
              <span className="mb-space-xs block font-headline-sm text-headline-sm font-bold text-primary">Identitas Editorial</span>
              <p className="font-body-sm text-body-sm leading-6 text-text-body">
                Informasi penulis, sumber, tanggal terbit, dan kebijakan koreksi disajikan secara jelas pada setiap publikasi.
              </p>
              <Link href="/tentang" className="mt-space-md inline-flex font-label-sm text-label-sm font-bold text-secondary hover:text-accent-gold-dark">
                Tentang redaksi
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-space-2xl flex flex-col gap-space-md border-t border-border pt-space-lg font-caption text-caption text-text-body md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} guskikin.id — Seluruh hak cipta dilindungi.</p>
          <div className="flex flex-wrap gap-space-md">
            <Link href="/tentang" className="hover:text-primary">Pedoman media</Link>
            <Link href="/tentang" className="hover:text-primary">Kebijakan privasi</Link>
            <Link href="/tentang" className="hover:text-primary">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
