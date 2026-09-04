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
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Halaqah & Akademik', value: 'halaqah' },
        { label: 'Pengajian Rutin', value: 'pengajian-rutin' },
        { label: 'Tabligh Akbar', value: 'tabligh-akbar' },
        { label: 'Silaturahmi Pesantren', value: 'silaturahmi' },
        { label: 'Agenda Lainnya', value: 'lainnya' },
      ],
      defaultValue: 'lainnya',
      admin: {
        position: 'sidebar',
      },
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
      name: 'scheduleLabel',
      type: 'text',
      admin: {
        description: 'Gunakan untuk jadwal berulang, misalnya “Setiap Ahad Pagi”.',
      },
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
      name: 'organizer',
      type: 'text',
    },
    {
      name: 'audience',
      type: 'text',
      admin: {
        description: 'Contoh: Terbuka untuk umum, santri dan alumni, atau undangan.',
      },
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
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
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
      name: 'mapUrl',
      type: 'text',
    },
    {
      name: 'registrationUrl',
      type: 'text',
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
