import { GraduationCap, HeartHandshake, Landmark, Network, UsersRound } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'

const networks = [
  { title: 'Alumni Tebuireng', description: 'Jejaring pengabdian lintas daerah dan bidang.', Icon: GraduationCap },
  { title: 'Kegiatan Sosial', description: 'Kolaborasi kemanusiaan berbasis kebutuhan publik.', Icon: HeartHandshake },
  { title: 'Organisasi & Jamaah', description: 'Kabar program dan ruang silaturahmi resmi.', Icon: UsersRound },
  { title: 'Warisan Tebuireng', description: 'Cerita, tokoh, dan nilai yang terus dirawat.', Icon: Landmark },
] as const

export function CommunitySection() {
  return (
    <section aria-labelledby="community-title" className="bg-cream-bg py-space-3xl">
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <SectionHeading
          eyebrow="Tebuireng & Jejaring Umat"
          title="Komunitas yang Tumbuh dalam Pengabdian"
          titleId="community-title"
          description="Ruang untuk mengenal gerakan alumni, program sosial, lembaga, dan cerita publik dari ekosistem Tebuireng."
          href="/komunitas"
          linkLabel="Jelajahi komunitas"
          icon={Network}
        />

        <div className="grid overflow-hidden rounded-lg border border-border bg-white sm:grid-cols-2 lg:grid-cols-4">
          {networks.map(({ Icon, ...item }) => (
            <article key={item.title} className="group border-b border-border p-space-lg last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0 lg:p-space-xl">
              <span className="grid size-11 place-items-center rounded-md bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <Link href="/komunitas" className="mt-space-lg block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                <h3 className="font-headline-sm text-[1.25rem] font-bold text-text-headline transition-colors group-hover:text-primary">{item.title}</h3>
              </Link>
              <p className="mt-space-xs font-body-sm text-body-sm leading-5 text-text-body">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
