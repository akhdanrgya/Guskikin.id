import type { CollectionConfig } from 'payload'

export const CommunityPosts: CollectionConfig = {
  slug: 'community-posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Alumni Tebuireng', value: 'alumni' },
        { label: 'Jamaah', value: 'jamaah' },
        { label: 'Kegiatan Sosial', value: 'sosial' },
        { label: 'Organisasi', value: 'organisasi' },
        { label: 'Program Komunitas', value: 'program' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
