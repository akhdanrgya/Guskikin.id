'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const HIJRI_MONTHS = [
  'Muharam',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Syakban',
  'Ramadan',
  'Syawal',
  'Zulkaidah',
  'Zulhijah',
]

const getPart = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
  parts.find((part) => part.type === type)?.value ?? ''

const formatHeaderDate = (date: Date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
  }).format(date)

const formatHijriDate = (date: Date) => {
  const parts = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  }).formatToParts(date)
  const monthIndex = Number(getPart(parts, 'month')) - 1
  const month = HIJRI_MONTHS[monthIndex] ?? getPart(parts, 'month')

  return `${getPart(parts, 'day')} ${month} ${getPart(parts, 'year')} H`
}

const HeaderDate = ({ initialNow }: { initialNow: string }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date(initialNow))

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentDate(new Date()), 30_000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-start gap-0 whitespace-nowrap text-[0.65rem] font-medium leading-3 text-primary sm:flex-row sm:items-center sm:gap-space-xs sm:text-label-sm sm:leading-normal" aria-live="polite">
      <time dateTime={currentDate.toISOString()}>{formatHeaderDate(currentDate)}</time>
      <span className="hidden text-outline-variant sm:inline" aria-hidden="true">•</span>
      <span className="text-secondary">{formatHijriDate(currentDate)}</span>
    </div>
  )
}

const NAV_ITEMS = [
  { href: '/', label: 'Beranda' },
  { href: '/dawuh', label: 'Dawuh & Khazanah' },
  { href: '/agenda', label: 'Safari Dakwah' },
  { href: '/berita', label: 'Artikel & Opini' },
  { href: '/media', label: 'Galeri Multimedia' },
]

type SiteHeaderProps = {
  initialNow: string
  isLatestLoading?: boolean
  latestArticle: {
    slug: string
    title: string
  } | null
}

export const SiteHeader = ({ initialNow, isLatestLoading = false, latestArticle }: SiteHeaderProps) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const navClass = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
      ? 'text-primary font-bold font-label-md text-label-md'
      : 'text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors'

  useEffect(() => {
    if (!isMobileMenuOpen && !isSearchOpen) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        setSearchOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen, isSearchOpen])

  const openSearch = () => {
    setMobileMenuOpen(false)
    setSearchOpen(true)
  }

  return (
    <motion.header
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 w-full z-50 bg-cream-bg/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
      initial={{ opacity: 0, y: -28 }}
      transition={{ damping: 24, stiffness: 220, type: 'spring' }}
    >
      <div className="w-full bg-surface-container-low">
        <div className="mx-auto flex h-10 max-w-container-max items-center justify-between px-gutter-mobile font-label-sm text-label-sm text-on-surface-variant sm:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex items-center gap-space-md">
            <HeaderDate initialNow={initialNow} />
            <div className="hidden lg:flex items-center gap-space-xs bg-surface-container-lowest px-space-xs py-space-2xs rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="bg-secondary text-on-secondary px-space-xs py-0.5 rounded-full font-label-sm text-label-sm">
                Terkini
              </span>
              {isLatestLoading ? (
                <span aria-label="Memuat berita terkini" className="h-4 w-64 animate-pulse rounded-full bg-primary/10" />
              ) : latestArticle ? (
                <Link
                  className="text-on-surface truncate max-w-[28rem] font-body-sm text-body-sm hover:text-primary transition-colors"
                  href={`/berita/${latestArticle.slug}`}
                >
                  {latestArticle.title}
                </Link>
              ) : (
                <p className="text-on-surface max-w-[28rem] font-body-sm text-body-sm">
                  Belum ada berita terbaru
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <motion.button
              aria-label="Buka pencarian global"
              className="flex items-center gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-white hover:text-primary sm:px-2"
              onClick={openSearch}
              type="button"
              whileTap={{ scale: 0.94 }}
            >
              <Search aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Cari Arsip</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
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

          <nav className="ml-space-md hidden items-center gap-space-md xl:flex">
            {NAV_ITEMS.map((item) => (
              <Link href={item.href} className={navClass(item.href)} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-space-sm">
          <Link
            href="/dawuh"
            className="hidden md:inline-flex items-center gap-1.5 px-space-md py-space-xs rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-label-md shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all"
          >
            Kutipan Hari Ini
          </Link>
          <motion.button
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="grid size-11 place-items-center rounded-xl border border-border bg-white text-primary shadow-sm transition-colors hover:bg-surface-container-low xl:hidden"
            onClick={() => {
              setSearchOpen(false)
              setMobileMenuOpen((open) => !open)
            }}
            type="button"
            whileTap={{ scale: 0.92 }}
          >
            {isMobileMenuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 top-full w-full border-t border-border bg-cream-bg shadow-[0_16px_30px_rgba(15,23,42,0.12)] xl:hidden"
            exit={{ opacity: 0, y: -14 }}
            id="mobile-navigation"
            initial={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Navigasi mobile" className="mx-auto max-w-container-max px-gutter-mobile py-4 sm:px-gutter-tablet">
              <div className="grid gap-1">
                {NAV_ITEMS.map((item, index) => {
                  const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))

                  return (
                    <motion.div animate={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -12 }} key={item.href} transition={{ delay: index * 0.035 }}>
                      <Link
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded-xl px-4 py-3 font-label-md text-label-md font-bold transition-colors ${active ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container-low'}`}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <motion.button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-3 font-label-sm text-label-sm font-bold text-white" onClick={openSearch} type="button" whileTap={{ scale: 0.96 }}>
                  <Search aria-hidden="true" className="size-4" /> Cari
                </motion.button>
                <Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-3 font-label-sm text-label-sm font-bold text-primary" href="/dawuh" onClick={() => setMobileMenuOpen(false)}>
                  Kutipan Hari Ini
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen ? (
          <motion.div animate={{ opacity: 1 }} aria-labelledby="global-search-title" aria-modal="true" className="fixed inset-0 z-[70] px-gutter-mobile pt-20 sm:px-gutter-tablet sm:pt-28" exit={{ opacity: 0 }} initial={{ opacity: 0 }} role="dialog">
            <motion.button animate={{ opacity: 1 }} aria-label="Tutup pencarian" className="absolute inset-0 bg-emerald-deep/70 backdrop-blur-sm" initial={{ opacity: 0 }} onClick={() => setSearchOpen(false)} type="button" />
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              initial={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ damping: 25, stiffness: 260, type: 'spring' }}
            >
            <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
              <div>
                <p className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">Pencarian Global</p>
                <h2 className="mt-1 font-editorial text-headline-md font-bold text-primary" id="global-search-title">Cari seluruh khazanah</h2>
              </div>
              <button aria-label="Tutup pencarian" className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-container-low text-on-surface transition-colors hover:text-primary" onClick={() => setSearchOpen(false)} type="button">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <form action="/cari" className="p-5 sm:p-6" method="get" onSubmit={() => setSearchOpen(false)}>
              <label className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <Search aria-hidden="true" className="size-5 shrink-0 text-primary" />
                <span className="sr-only">Kata kunci pencarian</span>
                <input autoFocus className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-text-body/65" minLength={2} name="q" placeholder="Artikel, dawuh, agenda, atau media..." required type="search" />
              </label>
              <div className="mt-4 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                <p className="font-caption text-caption text-text-body">Tekan Esc untuk menutup</p>
                <button className="min-h-11 rounded-xl bg-primary px-6 font-label-sm text-label-sm font-bold text-white transition-colors hover:bg-emerald-deep" type="submit">Tampilkan hasil</button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
