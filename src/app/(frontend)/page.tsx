import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex flex-col w-full">
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full pt-space-md pb-space-3xl">
        <div className="flex items-center justify-between pb-space-md">
          <div className="flex items-center gap-space-sm">
            <span className="bg-surface-container-low text-primary-container px-space-sm py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Pilihan Redaksi
            </span>
            <span className="text-text-body font-body-sm text-body-sm hidden sm:inline">
              Kajian Utama Khazanah Pemikiran & Kebangsaan
            </span>
          </div>
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary">
            <span>Kanal Resmi Tebuireng</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-stretch">
          <article className="lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between overflow-hidden">
            <div className="p-space-lg flex flex-col flex-1">
              <div className="relative w-full h-[22rem] rounded-xl overflow-hidden shadow-inner bg-surface-container-low">
                <Image
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzKU-42Q0m53oqi9tFZGo_HqVDFyGvsSzc_v00Kf1TtY3WHwXcqrruu2hMB12d_fcvOeLjkGu1QleBO01KlF-Ha7w2VZydW5I_fyI2BLZpyuXYeL7ofrDSQjU9tznqX0AH4eKcUetjjZ7G7qmHipU81p-epSptFrcwbaZSwhRMa9UJ_1HEqsD5W52aj6EmGLs2gwphttmO38xSLpZBNj4uzv2d7mYzJk_Xx17Vr9LW14NKQAm9wJFt" 
                  alt="Gus Kikin menyampaikan kajian kebangsaan"
                  fill
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  preload
                />
                <div className="absolute top-space-md left-space-md">
                  <span className="bg-secondary text-on-secondary px-space-sm py-1 rounded-full font-label-sm text-label-sm tracking-wide shadow-sm">
                    KHAZANAH KEBANGSAAN
                  </span>
                </div>
              </div>
              <div className="pt-space-lg flex flex-col flex-1 justify-between">
                <div>
                  <Link href="/berita" className="group">
                    <h1 className="font-headline-lg text-headline-lg text-text-headline group-hover:text-primary transition-colors leading-tight mb-space-sm">
                      Gus Kikin: Meneguhkan Nilai Moderasi Beragama dan Kemandirian Ekonomi Pesantren Abad Kedua NU
                    </h1>
                  </Link>
                  <p className="font-body-md text-body-md text-text-body line-clamp-3 mb-space-md">
                    Dalam lawatan halaqah peradaban, Pengasuh Pesantren Tebuireng menggarisbawahi urgensi reorientasi gerakan santri...
                  </p>
                </div>
              </div>
            </div>
          </article>
          
          <div className="lg:col-span-5 flex flex-col gap-space-md justify-between">
            <div className="flex items-center justify-between pb-space-2xs">
              <div className="flex items-center gap-space-xs">
                <h2 className="font-headline-sm text-headline-sm text-primary">Topik Utama Pilihan</h2>
              </div>
              <Link href="/khazanah" className="font-label-sm text-label-sm text-secondary hover:text-accent-gold-dark flex items-center gap-1 font-semibold">
                <span>Arsip Lengkap</span>
              </Link>
            </div>
            
            <article className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-space-md group">
              <span className="font-headline-lg text-headline-lg text-secondary/30 group-hover:text-secondary transition-colors select-none pt-1">01</span>
              <div className="flex-1 flex flex-col gap-space-2xs min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="bg-surface-container text-primary px-space-xs py-0.5 rounded-full font-label-sm text-label-sm">
                    Tebuireng Heritage
                  </span>
                </div>
                <Link href="/khazanah">
                  <h3 className="font-headline-sm text-[17px] leading-snug text-text-headline group-hover:text-primary transition-colors line-clamp-2">
                    Pesan Mendalam Pengasuh Tebuireng dalam Menjaga Sanad Keilmuan Para Masyayikh
                  </h3>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
