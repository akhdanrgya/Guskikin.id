import Link from 'next/link'

export const SiteFooter = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(0,0,0,0.03)] mt-space-4xl">
      <div className="max-w-container-max mx-auto px-gutter-desktop py-space-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-2xl">
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-md text-headline-md text-primary">guskikin.id</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Portal resmi khazanah pemikiran, gagasan kebangsaan, dan rekam jejak dakwah K.H. Abdul Hakim Mahfudz (Gus Kikin) — Pengasuh Pondok Pesantren Tebuireng Jombang & Ketua Pengurus Wilayah Nahdlatul Ulama (PWNU) Jawa Timur.
            </p>
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-primary">Rubrik Khazanah</span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <Link href="/dawuh" className="text-on-surface-variant hover:text-primary transition-colors">Dawuh & Tausiyah</Link>
              <Link href="/berita" className="text-on-surface-variant hover:text-primary transition-colors">Opini Kebangsaan</Link>
              <Link href="/tentang" className="text-on-surface-variant hover:text-primary transition-colors">Warta Tebuireng</Link>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-primary">Tautan Lembaga</span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Pesantren Tebuireng</a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">PWNU Jawa Timur</a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">PBNU Official</a>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-cream-bg p-space-lg rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
              <span className="font-headline-sm text-headline-sm text-primary block mb-space-xs">Buletin Khazanah Mingguan</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Dapatkan untaian dawuh, intisari khutbah, dan perspektif keumatan Gus Kikin langsung di kotak masuk surel Anda setiap hari Jumat.
              </p>
              <form className="flex flex-col sm:flex-row gap-space-xs">
                <input 
                  type="email" 
                  placeholder="Ketikkan alamat email Anda..." 
                  className="flex-1 h-11 px-space-md rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary"
                />
                <button type="button" className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-emerald-deep transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] whitespace-nowrap">
                  Langganan
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-space-2xl pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-caption text-caption">
          <p>© 2024 guskikin.id — Seluruh Hak Cipta Dilindungi Undang-Undang. Dikelola oleh Tim Khazanah & Media Pesantren Tebuireng Jombang.</p>
        </div>
      </div>
    </footer>
  )
}
