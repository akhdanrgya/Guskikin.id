import type { CollectionConfig } from 'payload'

export const MediaContents: CollectionConfig = {
  slug: 'media-contents',
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
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'Podcast', value: 'podcast' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'youtubeId',
      type: 'text',
    },
    {
      name: 'audioUrl',
      type: 'text',
    },
    {
      name: 'videoUrl',
      type: 'text',
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'speaker',
      type: 'text',
    },
    {
      name: 'series',
      type: 'text',
    },
    {
      name: 'episode',
      type: 'number',
    },
    {
      name: 'transcript',
      type: 'richText',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
