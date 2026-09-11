import Image from 'next/image'

import type { Author, Media } from '@/payload-types'

const isMedia = (value: Author['avatar']): value is Media =>
  Boolean(value && typeof value === 'object' && 'url' in value)

const initialsFor = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'GR'

type AuthorProfileProps = {
  author?: Author
  className?: string
  compact?: boolean
  tone?: 'default' | 'inverse'
}

export function AuthorProfile({
  author,
  className = '',
  compact = false,
  tone = 'default',
}: AuthorProfileProps) {
  const name = author?.name || 'Tim Redaksi Guskikin'
  const bio = author?.bio || 'Redaksi guskikin.id'
  const avatar = isMedia(author?.avatar) ? author.avatar : null

  if (compact) {
    return (
      <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
        <span className={`relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full font-label-sm text-label-sm font-bold ${tone === 'inverse' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
          {avatar?.url ? (
            <Image
              alt={avatar.alt || `Foto ${name}`}
              className="object-cover"
              height={36}
              sizes="36px"
              src={avatar.sizes?.avatar?.url || avatar.sizes?.thumbnail?.url || avatar.url}
              width={36}
            />
          ) : (
            initialsFor(name)
          )}
        </span>
        <span className="min-w-0">
          <span className={`block truncate font-label-sm text-label-sm font-bold ${tone === 'inverse' ? 'text-white' : 'text-primary'}`}>{name}</span>
          <span className={`block line-clamp-1 font-caption text-caption ${tone === 'inverse' ? 'text-white/70' : 'text-text-body'}`}>{bio}</span>
        </span>
      </div>
    )
  }

  return (
    <section className={`flex gap-3 rounded-xl border border-border bg-surface-container-low p-4 ${className}`}>
      <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-primary font-label-md text-label-md font-bold text-primary-foreground">
        {avatar?.url ? (
          <Image
            alt={avatar.alt || `Foto ${name}`}
            className="object-cover"
            height={48}
            sizes="48px"
            src={avatar.sizes?.avatar?.url || avatar.sizes?.thumbnail?.url || avatar.url}
            width={48}
          />
        ) : (
          initialsFor(name)
        )}
      </span>
      <div className="min-w-0">
        <p className="font-label-md text-label-md font-bold text-primary">{name}</p>
        <p className="mt-1 font-body-sm text-body-sm leading-5 text-text-body">{bio}</p>
      </div>
    </section>
  )
}
