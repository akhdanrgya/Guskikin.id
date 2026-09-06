import type { LucideIcon } from 'lucide-react'

export function HomepageSectionEmptyState({
  description,
  eyebrow,
  icon: Icon,
  title,
  titleId,
  tone = 'cream',
}: {
  description: string
  eyebrow: string
  icon: LucideIcon
  title: string
  titleId: string
  tone?: 'blue' | 'cream'
}) {
  return (
    <section
      aria-labelledby={titleId}
      className={tone === 'blue' ? 'bg-[#edf3ff] py-space-3xl' : 'bg-cream-bg py-space-3xl'}
    >
      <div className="mx-auto w-full max-w-container-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="rounded-lg border border-dashed border-primary/25 bg-white px-space-xl py-space-2xl text-center shadow-[0_10px_30px_rgba(15,81,50,0.04)] sm:py-space-3xl">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-surface-container-low text-primary">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </span>
          <span className="mt-space-md block font-label-sm text-label-sm font-bold uppercase tracking-[0.12em] text-secondary">
            {eyebrow}
          </span>
          <h2
            className="mt-space-xs font-headline-lg text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight text-primary"
            id={titleId}
          >
            {title}
          </h2>
          <p className="mx-auto mt-space-sm max-w-xl font-body-md text-body-md leading-7 text-text-body">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
