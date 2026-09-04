'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SiteHeader = () => {
  const pathname = usePathname()
  const navClass = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
      ? 'text-primary font-bold font-label-md text-label-md'
      : 'text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors'

  return (
    <header className="fixed top-0 w-full z-50 bg-cream-bg/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="w-full bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter-desktop h-10 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs text-primary font-medium">
              <span>Kamis, 24 Oktober 2024</span>
              <span className="text-outline-variant">•</span>
              <span className="text-secondary">20 Rabiul Akhir 1446 H</span>
            </div>
            <div className="hidden lg:flex items-center gap-space-xs bg-surface-container-lowest px-space-xs py-space-2xs rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="bg-secondary text-on-secondary px-space-xs py-0.5 rounded-full font-label-sm text-label-sm">
                Terkini
              </span>
              <p className="text-on-surface truncate max-w-[28rem] font-body-sm text-body-sm">
                Pesantren Tebuireng Gelar Halaqah Fiqih Peradaban
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
              Cari Arsip
            </button>
          </div>
        </div>
      </div>

      <div className="h-20 max-w-container-max mx-auto px-gutter-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <Link href="/" className="flex items-center gap-space-sm">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">
                guskikin.id
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-medium tracking-wide">
                Khazanah & Pemikiran
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-space-md ml-space-md">
            <Link href="/" className={navClass('/')}>
              Beranda
            </Link>
            <Link href="/dawuh" className={navClass('/dawuh')}>
              Dawuh & Khazanah
            </Link>
            <Link href="/agenda" className={navClass('/agenda')}>
              Safari Dakwah
            </Link>
            <Link href="/berita" className={navClass('/berita')}>
              Artikel & Opini
            </Link>
            <Link href="/media" className={navClass('/media')}>
              Galeri Multimedia
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-space-sm">
          <Link
            href="/dawuh"
            className="hidden md:inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-label-md shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all"
          >
            Kutipan Hari Ini
          </Link>
        </div>
      </div>
    </header>
  )
}
