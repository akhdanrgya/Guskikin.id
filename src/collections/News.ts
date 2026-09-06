import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    plural: { en: 'News', id: 'Berita' },
    singular: { en: 'News', id: 'Berita' },
  },
  admin: {
    group: { en: 'Editorial', id: 'Redaksi' },
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', id: 'Judul' },
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: { en: 'Summary', id: 'Ringkasan' },
    },
    {
      name: 'content',
      type: 'richText',
      label: { en: 'Content', id: 'Isi Berita' },
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: { en: 'Featured Image', id: 'Gambar Utama' },
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      label: { en: 'Category', id: 'Kategori' },
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      label: { en: 'Authors', id: 'Penulis' },
      relationTo: 'authors',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { en: 'Published At', id: 'Tanggal Terbit' },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: { en: 'Reading Time (minutes)', id: 'Waktu Baca (menit)' },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: { en: 'Featured News', id: 'Berita Pilihan' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isBreaking',
      type: 'checkbox',
      label: { en: 'Breaking News', id: 'Berita Terkini' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
