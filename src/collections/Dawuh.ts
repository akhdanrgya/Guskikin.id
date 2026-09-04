import type { CollectionConfig } from 'payload'

export const Dawuh: CollectionConfig = {
  slug: 'dawuh',
  admin: {
    useAsTitle: 'quote',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
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
      name: 'context',
      type: 'text',
    },
    {
      name: 'topic',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
