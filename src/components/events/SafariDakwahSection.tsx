import { CalendarDays, Clock3, MapPin, Radio } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'

const events = [
  {
    day: '18', month: 'Okt 2024', dateTime: '2024-10-18', status: 'Live stream', live: true,
    time: '19.30 WIB – selesai', title: 'Halaqah Kebangsaan & Doa Bersama Hari Santri Nasional',
    location: 'Kompleks Makam Masyayikh, Tebuireng, Jombang',
  },
  {
    day: '24', month: 'Okt 2024', dateTime: '2024-10-24', status: 'Mendatang', live: false,
    time: '09.00–12.00 WIB', title: 'Silaturahmi Ulama Umara & Dialog Pemberdayaan Ekonomi Umat',
    location: 'Aula Muktamar PWNU Jawa Timur, Surabaya',
  },
  {
    day: '02', month: 'Nov 2024', dateTime: '2024-11-02', status: 'Mendatang', live: false,
    time: '13.00–15.30 WIB', title: 'Kuliah Umum: Integrasi Nilai Kepesantrenan dalam Kepemimpinan Modern',
    location: 'Auditorium Utama UIN Sunan Ampel, Surabaya',
  },
] as const

export function SafariDakwahSection() {
  return (
    <section aria-labelledby="agenda-title" className="bg-cream-bg py-space-3xl">
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <SectionHeading
          eyebrow="Jadwal Tausiyah & Majelis"
          title="Safari Dakwah & Agenda Terjadwal"
          titleId="agenda-title"
          description="Informasi resmi kehadiran majelis, forum bahtsul masail, dan silaturahmi keumatan."
          href="/agenda"
          linkLabel="Lihat kalender lengkap"
          icon={CalendarDays}
        />

        <div className="grid gap-space-lg lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.dateTime} className="group flex flex-col rounded-lg border border-border bg-white p-space-lg transition-transform motion-safe:hover:-translate-y-1 sm:p-space-xl">
              <div className="flex items-start justify-between gap-space-md">
                <time className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary text-center text-primary-foreground" dateTime={event.dateTime}>
                  <span>
                    <strong className="block font-headline-md text-headline-md leading-none">{event.day}</strong>
                    <span className="mt-1 block font-label-sm text-[0.62rem] font-bold uppercase tracking-[0.08em]">{event.month}</span>
                  </span>
                </time>
                <span className={`inline-flex items-center gap-1 rounded-full px-space-sm py-1 font-label-sm text-label-sm font-bold ${event.live ? 'bg-red-100 text-red-700' : 'bg-surface-container text-primary'}`}>
                  {event.live && <Radio className="size-3" aria-hidden="true" />}
                  {event.status}
                </span>
              </div>
              <span className="mt-space-lg inline-flex items-center gap-space-xs font-label-sm text-label-sm font-bold text-secondary">
                <Clock3 className="size-4" aria-hidden="true" />
                {event.time}
              </span>
              <Link href="/agenda" className="mt-space-xs rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                <h3 className="font-headline-sm text-[1.28rem] font-bold leading-snug text-text-headline transition-colors group-hover:text-primary">{event.title}</h3>
              </Link>
              <p className="mt-space-md inline-flex items-start gap-space-xs font-body-sm text-body-sm leading-5 text-text-body">
                <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                {event.location}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
