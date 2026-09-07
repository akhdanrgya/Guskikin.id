import {
  BookOpenText,
  CheckCircle2,
  Compass,
  Quote,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tentang Redaksi | guskikin.id',
  description: 'Visi, misi, dan profil orang-orang di balik redaksi guskikin.id.',
}

const editorialMembers = [
  {
    bio: 'Lahir di Kota Surabaya. Saat ini sedang menyelesaikan program doktoral di UIN Syarif Hidayatullah Jakarta di bidang Filantropi Islam.',
    name: 'Dr. (cand.) Much. Syahril Mubarok, M.Hum.',
    photo: '/images/redaksi/syahril-placeholder.svg',
    role: 'Founder guskikin.id',
  },
  {
    bio: 'Lahir di Kudus. Sebagai Ketua Alumni Pesantren Luhur Ciganjur, Amin merawat peradaban pesantren Ciganjur peninggalan Gus Dur.',
    name: 'H. Syaifullah Amin, M.Pd.',
    photo: '/images/redaksi/amin-placeholder.svg',
    role: 'Co-Founder',
  },
] as const

const missions = [
  'Menyajikan informasi dan gagasan yang akurat, jernih, kontekstual, serta dapat dipertanggungjawabkan.',
  'Merawat khazanah pesantren, nilai keislaman yang moderat, dan pemikiran kebangsaan agar tetap relevan lintas generasi.',
  'Membuka ruang dialog yang sehat antara tradisi, keilmuan, filantropi, dan tantangan masyarakat kontemporer.',
  'Menjaga independensi redaksi melalui proses verifikasi, etika publikasi, dan keberpihakan pada kemaslahatan bersama.',
] as const

function EditorialPortrait({ name, photo }: { name: string; photo: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
      <Image
        alt={`Foto profil sementara ${name}`}
        className="object-cover object-top"
        fill
        sizes="(max-width: 767px) 100vw, 42vw"
        src={photo}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/35 to-transparent"
      />
      <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-primary/80 px-3 py-1 font-caption text-caption font-bold text-white backdrop-blur-sm">
        Foto sementara
      </span>
    </div>
  )
}

export default function EditorialAboutPage() {
  return (
    <main className="bg-[#f7f9fc]">
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-container-max px-gutter-mobile py-4 sm:px-gutter-tablet lg:px-gutter-desktop">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-label-sm text-label-sm text-text-body"
          >
            <Link className="transition-colors hover:text-primary" href="/">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-primary">Tentang Redaksi</span>
          </nav>
        </div>
      </div>

      <header className="relative overflow-hidden bg-primary text-white">
        <div
          aria-hidden="true"
          className="absolute -right-28 -top-32 size-[30rem] rounded-full border-[5rem] border-white/[0.035]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-28 size-[28rem] rounded-full bg-secondary/[0.08]"
        />
        <div className="relative mx-auto grid max-w-container-max gap-10 px-gutter-mobile py-16 sm:px-gutter-tablet lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-gutter-desktop lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-[#f5bd66]">
              <UsersRound aria-hidden="true" className="size-4" />
              Di balik guskikin.id
            </span>
            <h1 className="mt-6 max-w-3xl font-editorial text-[clamp(2.7rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Redaksi yang merawat gagasan dan khazanah.
            </h1>
            <p className="mt-6 max-w-2xl font-body-lg text-body-lg leading-8 text-white/75">
              guskikin.id tumbuh sebagai ruang publikasi yang mempertemukan tradisi pesantren,
              pemikiran Islam, filantropi, dan semangat kebangsaan dalam bahasa yang jernih dan
              bertanggung jawab.
            </p>
          </div>
          <div className="self-end rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <Quote aria-hidden="true" className="size-8 text-[#f5bd66]" />
            <p className="mt-5 font-editorial text-headline-md font-semibold leading-snug">
              Pengetahuan menjadi bermakna ketika dirawat, dipertanggungjawabkan, dan dibagikan
              untuk kemaslahatan.
            </p>
          </div>
        </div>
      </header>

      <section aria-labelledby="editorial-vision-title" className="bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-container-max gap-8 px-gutter-mobile sm:px-gutter-tablet lg:grid-cols-[0.8fr_1.2fr] lg:px-gutter-desktop">
          <div className="rounded-2xl bg-[#edf5ef] p-7 sm:p-9">
            <Compass aria-hidden="true" className="size-8 text-secondary" />
            <p className="mt-6 font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">
              Visi Redaksi
            </p>
            <h2
              className="mt-3 font-editorial text-[2rem] font-bold leading-tight text-primary sm:text-[2.5rem]"
              id="editorial-vision-title"
            >
              Menjadi ruang pengetahuan yang tepercaya, moderat, dan mencerahkan.
            </h2>
            <p className="mt-5 font-body-md text-body-md leading-7 text-text-body">
              Kami ingin menghadirkan jurnalisme gagasan yang menjaga akar tradisi sekaligus peka
              terhadap perubahan zaman.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-7 shadow-[0_14px_40px_rgba(15,81,50,0.06)] sm:p-9">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="size-7 text-secondary" />
              <h2 className="font-editorial text-[2rem] font-bold text-primary">Misi Redaksi</h2>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {missions.map((mission) => (
                <div
                  className="flex gap-3 rounded-xl border border-border bg-surface-container-low p-4"
                  key={mission}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-secondary"
                  />
                  <p className="font-body-sm text-body-sm leading-6 text-text-body">{mission}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="editorial-team-title" className="py-14 lg:py-20">
        <div className="mx-auto max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
          <div className="mb-9 max-w-3xl">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">
              Orang di Balik Redaksi
            </span>
            <h2
              className="mt-2 font-editorial text-[2.35rem] font-bold leading-tight text-primary sm:text-[3rem]"
              id="editorial-team-title"
            >
              Bertumbuh dari jejaring pesantren dan keilmuan
            </h2>
            <p className="mt-4 font-body-md text-body-md leading-7 text-text-body">
              Tim yang merintis guskikin.id membawa pengalaman pendidikan, organisasi alumni, dan
              pengabdian pada peradaban pesantren.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            {editorialMembers.map((member) => (
              <article
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_14px_42px_rgba(15,81,50,0.07)]"
                key={member.name}
              >
                <EditorialPortrait name={member.name} photo={member.photo} />
                <div className="p-6 sm:p-8">
                  <span className="inline-flex rounded-full bg-secondary/10 px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-[0.08em] text-secondary">
                    {member.role}
                  </span>
                  <h3 className="mt-4 font-editorial text-[1.65rem] font-bold leading-tight text-primary sm:text-[1.9rem]">
                    {member.name}
                  </h3>
                  <p className="mt-4 font-body-md text-body-md leading-7 text-text-body">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-12">
        <div className="mx-auto flex max-w-container-max flex-col items-start justify-between gap-6 px-gutter-mobile sm:px-gutter-tablet md:flex-row md:items-center lg:px-gutter-desktop">
          <div>
            <div className="flex items-center gap-2 text-secondary">
              <BookOpenText aria-hidden="true" className="size-5" />
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-[0.1em]">
                Publikasi Redaksi
              </span>
            </div>
            <h2 className="mt-2 font-editorial text-headline-md font-bold text-primary">
              Jelajahi gagasan dan kabar terbaru kami.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-primary px-5 py-3 font-label-sm text-label-sm font-bold text-white transition-colors hover:bg-emerald-deep"
              href="/artikel"
            >
              Baca artikel
            </Link>
            <Link
              className="rounded-full border border-primary px-5 py-3 font-label-sm text-label-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              href="/berita"
            >
              Lihat berita
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
