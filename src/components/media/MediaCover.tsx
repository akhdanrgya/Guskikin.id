import Image from 'next/image'

import { getMediaAssetURL, isMediaAsset } from '@/lib/media'
import type { MediaContent } from '@/payload-types'

const EDITORIAL_FALLBACK = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKU-42Q0m53oqi9tFZGo_HqVDFyGvsSzc_v00Kf1TtY3WHwXcqrruu2hMB12d_fcvOeLjkGu1QleBO01KlF-Ha7w2VZydW5I_fyI2BLZpyuXYeL7ofrDSQjU9tznqX0AH4eKcUetjjZ7G7qmHipU81p-epSptFrcwbaZSwhRMa9UJ_1HEqsD5W52aj6EmGLs2gwphttmO38xSLpZBNj4uzv2d7mYzJk_Xx17Vr9LW14NKQAm9wJFt'

export function MediaCover({ record, fallback = false, priority = false, sizes }: { record: MediaContent; fallback?: boolean; priority?: boolean; sizes: string }) {
  const media = isMediaAsset(record.thumbnail) ? record.thumbnail : null
  const src = getMediaAssetURL(record.thumbnail, fallback ? 'feature' : 'card') || (fallback ? EDITORIAL_FALLBACK : null)
  if (!src) return null
  return <Image alt={media?.alt || 'Dokumentasi khazanah guskikin.id'} className="object-cover" fill priority={priority} sizes={sizes} src={src} />
}
