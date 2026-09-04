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
        { label: 'Galeri Foto', value: 'photo-gallery' },
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
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
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
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'Tautan tayangan atau publikasi pada kanal eksternal.',
      },
    },
    {
      name: 'downloadableFile',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'galleryItems',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'photo-gallery',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
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
      name: 'host',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'credit',
      type: 'text',
    },
    {
      name: 'resolution',
      type: 'text',
    },
    {
      name: 'fileSize',
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
