import type { CollectionConfig } from 'payload'

export const Khazanah: CollectionConfig = {
  slug: 'khazanah',
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
        { label: 'Dawuh', value: 'dawuh' },
        { label: 'Transkrip Pengajian', value: 'transkrip' },
        { label: 'Naskah Khotbah', value: 'khotbah' },
        { label: 'Esai', value: 'esai' },
        { label: 'Kajian', value: 'kajian' },
        { label: 'Dokumen', value: 'dokumen' },
        { label: 'Sanad Keilmuan', value: 'sanad' },
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
      name: 'topic',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'year',
      type: 'number',
    },
  ],
}
