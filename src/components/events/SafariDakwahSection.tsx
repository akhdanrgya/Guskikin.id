import { CalendarDays, Clock3, MapPin, Radio } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'
import { formatEventTime, getEventStatusLabel } from '@/lib/events'
import type { Event } from '@/payload-types'

const eventDateParts = (date: string) => {
  const value = new Date(date)
  return {
    day: new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(value),
    month: new Intl.DateTimeFormat('id-ID', {
      month: 'short',
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
    }).format(value),
  }
}

export function SafariDakwahSection({ events }: { events: Event[] }) {
  if (!events.length) return null

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
          {events.map((event) => {
            const date = eventDateParts(event.startDate)
            const isLive = event.status === 'live'
            const location = [event.venue, event.city].filter(Boolean).join(', ')

            return (
              <article key={event.id} className="group flex flex-col rounded-lg border border-border bg-white p-space-lg transition-transform motion-safe:hover:-translate-y-1 sm:p-space-xl">
                <div className="flex items-start justify-between gap-space-md">
                  <time className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary text-center text-primary-foreground" dateTime={event.startDate}>
                    <span>
                      <strong className="block font-headline-md text-headline-md leading-none">{date.day}</strong>
                      <span className="mt-1 block font-label-sm text-[0.62rem] font-bold uppercase tracking-[0.08em]">{date.month}</span>
                    </span>
                  </time>
                  <span className={`inline-flex items-center gap-1 rounded-full px-space-sm py-1 font-label-sm text-label-sm font-bold ${isLive ? 'bg-red-100 text-red-700' : 'bg-surface-container text-primary'}`}>
                    {isLive ? <Radio className="size-3" aria-hidden="true" /> : null}
                    {getEventStatusLabel(event.status)}
                  </span>
                </div>
                <span className="mt-space-lg inline-flex items-center gap-space-xs font-label-sm text-label-sm font-bold text-secondary">
                  <Clock3 className="size-4" aria-hidden="true" />
                  {event.scheduleLabel || formatEventTime(event.startDate, event.endDate)}
                </span>
                <Link href={`/agenda/${event.slug}`} className="mt-space-xs rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                  <h3 className="font-headline-sm text-[1.28rem] font-bold leading-snug text-text-headline transition-colors group-hover:text-primary">{event.title}</h3>
                </Link>
                {location ? (
                  <p className="mt-space-md inline-flex items-start gap-space-xs font-body-sm text-body-sm leading-5 text-text-body">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                    {location}
                  </p>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
