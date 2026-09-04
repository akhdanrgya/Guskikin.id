import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
    },
    {
      name: 'venue',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Mendatang', value: 'upcoming' },
        { label: 'Hari Ini', value: 'today' },
        { label: 'Live', value: 'live' },
        { label: 'Selesai', value: 'completed' },
      ],
      defaultValue: 'upcoming',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'livestreamUrl',
      type: 'text',
    },
    {
      name: 'youtubeVideoId',
      type: 'text',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
