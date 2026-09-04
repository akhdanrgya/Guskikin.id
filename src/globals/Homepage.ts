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
      required: true,
    },
    {
      name: 'trendingStories',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
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
