import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroStory',
      type: 'relationship',
      relationTo: 'posts',
      label: { en: 'Featured Article', id: 'Artikel Utama' },
    },
    {
      name: 'trendingStories',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
      label: { en: 'Supporting Articles', id: 'Artikel Pendamping' },
    },
    {
      name: 'featuredNews',
      type: 'relationship',
      relationTo: 'news',
      hasMany: true,
      maxRows: 4,
      label: { en: 'Featured News', id: 'Berita Pilihan' },
    },
    {
      name: 'featuredDawuh',
      type: 'relationship',
      relationTo: 'dawuh',
      hasMany: true,
    },
    {
      name: 'featuredEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
    {
      name: 'featuredKhazanah',
      type: 'relationship',
      relationTo: 'khazanah',
      hasMany: true,
    },
  ],
}
