import { GraduationCap, HeartHandshake, Landmark, Network, UsersRound } from 'lucide-react'
import Link from 'next/link'

import { SectionHeading } from '@/components/shared/SectionHeading'
import type { CommunityPost } from '@/payload-types'

const typeIcons = {
  alumni: GraduationCap,
  jamaah: UsersRound,
  organisasi: Network,
  program: Landmark,
  sosial: HeartHandshake,
} as const

const plainText = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''
  if ('text' in value && typeof value.text === 'string') return value.text
  if ('children' in value && Array.isArray(value.children)) {
    return value.children.map(plainText).filter(Boolean).join(' ')
  }
  if ('root' in value) return plainText(value.root)
  return ''
}

export function CommunitySection({ records }: { records: CommunityPost[] }) {
  if (!records.length) return null

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
          {records.map((record) => {
            const Icon = typeIcons[record.type]
            const description = plainText(record.content)

            return (
              <article key={record.id} className="group border-b border-border p-space-lg last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0 lg:p-space-xl">
                <span className="grid size-11 place-items-center rounded-md bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <Link href="/komunitas" className="mt-space-lg block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
                  <h3 className="font-headline-sm text-[1.25rem] font-bold text-text-headline transition-colors group-hover:text-primary">{record.title}</h3>
                </Link>
                {description ? <p className="mt-space-xs line-clamp-3 font-body-sm text-body-sm leading-5 text-text-body">{description}</p> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
