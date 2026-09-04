import Image from 'next/image'

import type { Media, Post } from '@/payload-types'
import { getMediaURL, isMedia } from '@/lib/articles'

const EDITORIAL_FALLBACK =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKU-42Q0m53oqi9tFZGo_HqVDFyGvsSzc_v00Kf1TtY3WHwXcqrruu2hMB12d_fcvOeLjkGu1QleBO01KlF-Ha7w2VZydW5I_fyI2BLZpyuXYeL7ofrDSQjU9tznqX0AH4eKcUetjjZ7G7qmHipU81p-epSptFrcwbaZSwhRMa9UJ_1HEqsD5W52aj6EmGLs2gwphttmO38xSLpZBNj4uzv2d7mYzJk_Xx17Vr9LW14NKQAm9wJFt'

export const ArticleImage = ({
  className = '',
  fallback = false,
  image,
  priority = false,
  sizes,
}: {
  className?: string
  fallback?: boolean
  image: Post['featuredImage']
  priority?: boolean
  sizes: string
}) => {
  const media = isMedia(image) ? (image as Media) : null
  const src = getMediaURL(image, fallback ? 'feature' : 'card') || (fallback ? EDITORIAL_FALLBACK : null)

  if (!src) return null

  return (
    <Image
      alt={media?.alt || 'Khazanah dan kegiatan Pesantren Tebuireng'}
      className={`object-cover ${className}`}
      fill
      priority={priority}
      sizes={sizes}
      src={src}
    />
  )
}
