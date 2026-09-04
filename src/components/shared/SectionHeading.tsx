import { ArrowRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
  href: string
  linkLabel: string
  icon: LucideIcon
  titleId?: string
  inverted?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  icon: Icon,
  titleId,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <div className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
      <div className="max-w-3xl">
        <span
          className={`mb-space-xs inline-flex items-center gap-space-xs font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] ${
            inverted ? 'text-[#f5bd66]' : 'text-secondary'
          }`}
        >
          <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
          {eyebrow}
        </span>
        <h2
          id={titleId}
          className={`font-headline-lg text-[clamp(1.85rem,3vw,2.7rem)] font-bold leading-tight tracking-[-0.02em] ${
            inverted ? 'text-white' : 'text-primary'
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-space-xs max-w-2xl font-body-md text-body-md leading-6 ${
            inverted ? 'text-white/70' : 'text-text-body'
          }`}
        >
          {description}
        </p>
      </div>

      <Link
        href={href}
        className={`group inline-flex w-fit shrink-0 items-center gap-space-xs rounded-sm font-label-sm text-label-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${
          inverted
            ? 'text-[#f5bd66] focus-visible:ring-white'
            : 'text-primary hover:text-secondary focus-visible:ring-primary'
        }`}
      >
        {linkLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
